import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReportNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { token, content, category, isAnonymous, contact } = await req.json();

  if (!token || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
    include: {
      company: {
        include: {
          managers: true,
        },
      },
    },
  });

  if (!magicLink || !magicLink.active) {
    return NextResponse.json(
      { error: "Invalid or inactive link" },
      { status: 400 }
    );
  }

  const report = await prisma.report.create({
    data: {
      companyId: magicLink.companyId,
      magicLinkId: magicLink.id,
      content,
      category,
      isAnonymous: isAnonymous ?? true,
      contact: isAnonymous ? null : contact,
    },
  });

  // Send email notifications to all managers of the company
  try {
    const managers = magicLink.company.managers;
    console.log("📧 Sending emails to", managers.length, "manager(s)");

    const emailPromises = managers.map((manager: { email: string }) =>
      sendReportNotification({
        managerEmail: manager.email,
        companyName: magicLink.company.name,
        reportCategory: category || "Unspecified",
        reportContent: content,
        magicLinkLabel: magicLink.label,
        isAnonymous,
        submittedAt: report.createdAt,
      })
    );

    // Send emails in parallel without blocking the response
    const results = await Promise.allSettled(emailPromises);
    console.log("📧 Email results:", results);
  } catch (error) {
    // Log error but don't fail the request
    console.error("❌ Failed to send email notifications:", error);
  }

  return NextResponse.json({ success: true });
}

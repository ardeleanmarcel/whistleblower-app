import { getCurrentManager } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StatusDropdown from "@/components/StatusDropdown";

export default async function ReportsPage() {
  const manager = await getCurrentManager();
  if (!manager) redirect("/");

  const reports = await prisma.report.findMany({
    where: { companyId: manager.companyId },
    orderBy: { createdAt: "desc" },
    include: { magicLink: true },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-black">Reports</h1>
      <div className="space-y-3">
        {reports.map(
          (r: {
            id: string;
            category: string | null;
            status: string;
            content: string;
            isAnonymous: boolean;
            contact: string | null;
            createdAt: Date;
            magicLink: { label: string | null; token: string };
          }) => (
            <div
              key={r.id}
              className="bg-white border-2 border-gray-300 rounded-lg p-4 text-sm space-y-2 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-lg text-black">
                  {r.category || "Uncategorized"}
                </span>
                <StatusDropdown reportId={r.id} currentStatus={r.status} />
              </div>
              <p className="whitespace-pre-wrap text-base text-black leading-relaxed">
                {r.content}
              </p>
              <p className="text-sm text-gray-700 font-medium">
                Via link: {r.magicLink.label || r.magicLink.token.slice(0, 8)}
              </p>
              {!r.isAnonymous && r.contact && (
                <p className="text-sm text-gray-700 font-medium">
                  Contact: {r.contact}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Submitted: {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          )
        )}
        {reports.length === 0 && (
          <p className="text-base text-gray-600">No reports yet.</p>
        )}
      </div>
    </div>
  );
}

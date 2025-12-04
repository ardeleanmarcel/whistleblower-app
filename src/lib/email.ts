import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface ReportNotificationData {
  managerEmail: string;
  companyName: string;
  reportCategory: string;
  reportContent: string;
  magicLinkLabel: string;
  isAnonymous: boolean;
  submittedAt: Date;
}

export async function sendReportNotification(data: ReportNotificationData) {
  // Skip if email is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("❌ Email not configured, skipping notification");
    return { success: false, reason: "Email not configured" };
  }

  console.log("📧 Attempting to send email to:", data.managerEmail);
  console.log("📧 SMTP configured:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
  });

  try {
    const mailOptions = {
      from: `"Whistleblower App" <${process.env.SMTP_USER}>`,
      to: data.managerEmail,
      subject: `New Report Submitted - ${
        data.reportCategory || "Uncategorized"
      }`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .report-box { background-color: white; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .label { font-weight: bold; color: #4b5563; }
              .value { color: #1f2937; margin-bottom: 10px; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
              .badge { display: inline-block; padding: 4px 8px; background-color: #dbeafe; color: #1e40af; border-radius: 4px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 New Report Submitted</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>A new report has been submitted for <strong>${
                  data.companyName
                }</strong>.</p>
                
                <div class="report-box">
                  <div class="value">
                    <span class="label">Category:</span> ${
                      data.reportCategory || "Uncategorized"
                    }
                  </div>
                  <div class="value">
                    <span class="label">Submitted via:</span> ${
                      data.magicLinkLabel
                    }
                  </div>
                  <div class="value">
                    <span class="label">Type:</span> 
                    ${
                      data.isAnonymous
                        ? '<span class="badge">Anonymous</span>'
                        : '<span class="badge" style="background-color: #fef3c7; color: #92400e;">Named Report</span>'
                    }
                  </div>
                  <div class="value">
                    <span class="label">Submitted at:</span> ${data.submittedAt.toLocaleString()}
                  </div>
                </div>

                <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
                  <div class="label">Report Content:</div>
                  <p style="white-space: pre-wrap; margin-top: 10px;">${
                    data.reportContent
                  }</p>
                </div>

                <p style="margin-top: 30px;">
                  <a href="${
                    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
                  }/reports" 
                     style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    View Report in Dashboard
                  </a>
                </p>
              </div>
              <div class="footer">
                <p>This is an automated notification from Whistleblower App.</p>
                <p>Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return { success: false, error };
  }
}

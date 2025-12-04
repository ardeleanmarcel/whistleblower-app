import { getCurrentManager } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CreateLinkForm from "./CreateLinkForm";

export default async function MagicLinksPage() {
  const manager = await getCurrentManager();
  if (!manager) redirect("/");

  const links = await prisma.magicLink.findMany({
    where: { companyId: manager.companyId },
    orderBy: { createdAt: "desc" },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Magic Links</h1>

      <CreateLinkForm />

      <div className="space-y-2">
        {links.map(
          (link: {
            id: string;
            token: string;
            label: string | null;
            active: boolean;
            createdAt: Date;
          }) => (
            <div
              key={link.id}
              className="bg-white border rounded-lg p-3 text-sm flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-lg text-black">
                  {link.label || "Untitled link"}{" "}
                  {!link.active && (
                    <span className="ml-1 text-xs text-red-600">
                      (inactive)
                    </span>
                  )}
                </p>
                <p className="text-blue-600 break-all font-mono text-sm mt-1">
                  {baseUrl}/r/{link.token}
                </p>
              </div>
            </div>
          )
        )}
        {links.length === 0 && (
          <p className="text-sm text-slate-600">No magic links yet.</p>
        )}
      </div>
    </div>
  );
}

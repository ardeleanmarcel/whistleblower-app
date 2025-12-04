import Link from "next/link";
import { getCurrentManager } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const manager = await getCurrentManager();
  if (!manager) {
    redirect("/");
  }

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
      <header className="flex items-center justify-between border-b-2 border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-lg text-gray-900 mt-2">
            <span className="font-bold text-gray-700">Company:</span>{" "}
            <span className="font-bold text-blue-600 text-xl">
              {manager.company.name}
            </span>
          </p>
        </div>
        <Link
          href="/reports"
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors shadow-md"
        >
          View Reports
        </Link>
      </header>

      <div className="space-y-2">
        <Link
          href="/magic-links"
          className="block bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg border-2 border-blue-700"
        >
          <h2 className="font-bold text-xl">Create Magic Links</h2>
          <p className="text-sm text-blue-100 mt-1">
            Create and manage unique reporting links for employees.
          </p>
        </Link>
      </div>
    </div>
  );
}

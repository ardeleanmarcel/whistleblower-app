"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Don't show nav on login/signup pages or public report form
  if (
    pathname === "/" ||
    pathname === "/signup" ||
    pathname?.startsWith("/r/")
  ) {
    return null;
  }

  return (
    <nav className="bg-white border-b-2 border-gray-300 mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              Whistleblower App
            </Link>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/magic-links"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/magic-links"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Magic Links
              </Link>
              <Link
                href="/reports"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/reports"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Reports
              </Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

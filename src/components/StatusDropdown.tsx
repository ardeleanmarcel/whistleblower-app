"use client";

import { useState } from "react";

interface StatusDropdownProps {
  readonly reportId: string;
  readonly currentStatus: string;
}

const STATUSES = ["OPEN", "IN_REVIEW", "CLOSED"];

const STATUS_COLORS = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  CLOSED: "bg-green-100 text-green-800",
};

export default function StatusDropdown({
  reportId,
  currentStatus,
}: StatusDropdownProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
        // Refresh the page to show updated data
        globalThis.location.reload();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={isUpdating}
      className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded cursor-pointer border-none transition-colors ${
        STATUS_COLORS[status as keyof typeof STATUS_COLORS]
      } ${isUpdating ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}

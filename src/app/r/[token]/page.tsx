"use client";

import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ReportFormPage() {
  const { token } = useParams<{ token: string }>();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/reports/public", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        content,
        category,
        isAnonymous,
        contact: isAnonymous ? null : contact,
      }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  }

  if (submitted) {
    return (
      <div className="space-y-3 max-w-xl mx-auto">
        <h1 className="text-xl font-semibold">Thank you</h1>
        <p className="text-sm text-slate-700">
          Your report has been submitted to the company management. If you
          provided contact details, they may follow up with you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-black">Report an issue</h1>
      <p className="text-base text-black">
        You can submit this form anonymously or confidentially. Your report will
        be sent directly to management.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white border-2 border-gray-400 rounded-lg p-6 shadow-sm"
      >
        {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-bold text-black mb-2"
          >
            Category (optional)
          </label>
          <input
            id="category"
            className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 text-base text-black placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Safety, Ethics, HR"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-bold text-black mb-2"
          >
            What happened? *
          </label>
          <textarea
            id="content"
            className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 text-base text-black placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white min-h-[150px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Describe the issue in detail..."
          />
        </div>
        <div className="space-y-2">
          <label className="inline-flex items-center gap-2 text-base font-semibold text-black cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4"
            />{" "}
            Submit anonymously
          </label>
          {!isAnonymous && (
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-bold text-black mb-2"
              >
                Contact (email or phone)
              </label>
              <input
                id="contact"
                className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 text-base text-black placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="your@email.com or phone"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold text-base rounded-lg py-3 px-4 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors"
        >
          Submit report
        </button>
      </form>
    </div>
  );
}

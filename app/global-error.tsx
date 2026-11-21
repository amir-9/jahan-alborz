"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import "./globals.css";

/**
 * Last-resort error boundary for failures in the root layout.
 * It must provide its own html/body and does not inherit layout metadata.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          fontFamily:
            'Vazirmatn, Tahoma, "Segoe UI", sans-serif',
        }}
      >
        <title>مشکلی پیش آمد | جهان البرز</title>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
            background: "#F7F8FA",
            color: "#142D4E",
          }}
        >
          <div
            style={{
              display: "flex",
              height: "3.5rem",
              width: "3.5rem",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "1rem",
              background: "rgba(220, 38, 38, 0.1)",
              color: "#B91C1C",
            }}
          >
            <TriangleMark />
          </div>
          <h1 style={{ marginTop: "1.25rem", fontSize: "1.25rem", fontWeight: 800 }}>
            مشکلی پیش آمد
          </h1>
          <p
            style={{
              marginTop: "0.5rem",
              maxWidth: "28rem",
              fontSize: "0.8125rem",
              lineHeight: 1.9,
              color: "#5A6B7F",
            }}
          >
            نتوانستیم صفحه را بارگذاری کنیم. لطفاً دوباره تلاش کنید؛ اگر مشکل
            ادامه داشت با پشتیبانی فروشگاه تماس بگیرید.
          </p>
          <button
            type="button"
            onClick={retry}
            style={{
              marginTop: "1.5rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "0.75rem",
              background: "#F28C28",
              color: "#142D4E",
              fontWeight: 700,
              fontSize: "0.8125rem",
              padding: "0.625rem 1.25rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            <RefreshCcw size={16} aria-hidden="true" />
            تلاش دوباره
          </button>
        </main>
      </body>
    </html>
  );
}

function TriangleMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

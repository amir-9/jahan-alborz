import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

export const alt =
  "جهان البرز — فروشگاه تجهیزات گرمایشی و خدمات تعمیر و نصب در قزوین";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(weight: 400 | 700) {
  const file = weight === 700 ? "Vazirmatn-Bold.ttf" : "Vazirmatn-Regular.ttf";
  const data = await readFile(join(process.cwd(), "public/fonts", file));
  return { name: "Vazirmatn", data, weight, style: "normal" as const };
}

export default async function OpengraphImage() {
  const [regular, bold] = await Promise.all([loadFont(400), loadFont(700)]);

  return new ImageResponse(
    (
      <div
        dir="rtl"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#142D4E",
          color: "#FFFFFF",
          fontFamily: "Vazirmatn",
          position: "relative",
          padding: "80px",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: "rgba(242, 140, 40, 0.14)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -140,
            width: 480,
            height: 480,
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.05)",
            display: "flex",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            border: "1px solid rgba(242, 140, 40, 0.45)",
            background: "rgba(242, 140, 40, 0.10)",
            borderRadius: 999,
            padding: "12px 26px",
            color: "#F28C28",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F28C28"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
          </svg>
          {siteConfig.business.serviceCoverageCity} · {siteConfig.business.productCoverage}
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: -1,
          }}
        >
          {siteConfig.name}
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 32,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.82)",
          }}
        >
          {siteConfig.tagline}
        </div>

        {/* Accent rule */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            width: 180,
            height: 6,
            borderRadius: 999,
            background: "#F28C28",
          }}
        />

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 80,
            display: "flex",
            fontSize: 22,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.55)",
            direction: "ltr",
          }}
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size, fonts: [regular, bold] },
  );
}

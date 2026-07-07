import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#f7fbf8",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(21,228,122,0.16), transparent 45%), radial-gradient(circle at 85% 85%, rgba(227,163,69,0.16), transparent 45%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "rgba(21,228,122,0.15)",
              color: "#0b8b4d",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
            }}
          >
            $
          </div>
          <div style={{ display: "flex", fontSize: "36px", fontWeight: 700, color: "#0b3b2a" }}>
            All<span style={{ color: "#15a35a", fontStyle: "italic" }}>Pay</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "64px",
              fontWeight: 700,
              color: "#0b3b2a",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: "980px",
            }}
          >
            Stablecoin invoicing for the internet economy
          </div>
          <div style={{ display: "flex", fontSize: "28px", color: "#5c6b64", maxWidth: "820px" }}>
            Create invoices, share payment links, and get paid in USDC on Arc.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "#ffffff",
              border: "1px solid #dfe8e3",
              color: "#0b3b2a",
              fontSize: "22px",
              fontWeight: 600,
            }}
          >
            Built on Arc · Settled in USDC
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

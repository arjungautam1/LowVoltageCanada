import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#f9f9f6",
        color: "#202321",
        padding: "70px",
        borderTop: "18px solid #ce272e",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#ce272e",
          fontSize: 27,
          fontWeight: 700,
          letterSpacing: "4px",
        }}
      >
        LOW VOLTAGE CANADA
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: "-4px",
          lineHeight: 1.1,
        }}
      >
        <span>Canada,</span>
        <span style={{ color: "#ce272e" }}>connected.</span>
      </div>
      <div style={{ display: "flex", fontSize: 27 }}>
        AV · Security · Networking · Smart Buildings
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}

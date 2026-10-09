import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const logo = await readFile(
    join(process.cwd(), "public/brand/low-voltage-canada.png"),
  );
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#fff",
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
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "4px",
        }}
      >
        THE SIGNAL FOR CANADA’S CONNECTED INDUSTRY
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: "-4px",
          lineHeight: 1.1,
        }}
      >
        <span>Canada,</span>
        <span style={{ color: "#ce272e" }}>connected.</span>
      </div>
      {/* ImageResponse renders the original logo directly into the sharing card. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${logo.toString("base64")}`}
        alt="Low Voltage Canada"
        width={480}
        height={480}
        style={{ position: "absolute", right: 45, top: 90 }}
      />
      <div style={{ display: "flex", fontSize: 27 }}>
        AV · Security · Networking · Smart Buildings
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}

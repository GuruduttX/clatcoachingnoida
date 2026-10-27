import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<AppIcon size={512} />, size);
}

export function AppIcon({ size }: { size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fcc419",
        color: "#e40014",
        fontWeight: 800,
        letterSpacing: -size * 0.01,
      }}
    >
      <div style={{ fontSize: size * 0.36, lineHeight: 1 }}>LPT</div>
      <div
        style={{
          marginTop: size * 0.04,
          fontSize: size * 0.085,
          background: "#e40014",
          color: "#fff",
          padding: `${size * 0.012}px ${size * 0.05}px`,
          borderRadius: size * 0.02,
          letterSpacing: size * 0.008,
        }}
      >
        NOIDA
      </div>
    </div>
  );
}

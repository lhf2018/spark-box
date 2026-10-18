import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "64px",
          background: "#d7efe6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "11px",
            background: "#143f38",
          }}
        />
      </div>
    ),
    { ...size },
  );
}

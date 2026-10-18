import type { Metadata } from "next";
import { Fraunces, Noto_Sans_SC, Outfit, ZCOOL_XiaoWei } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const zcool = ZCOOL_XiaoWei({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zcool",
  preload: false,
  adjustFontFallback: false,
});

const noto = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "灵感盒",
    template: "%s · 灵感盒",
  },
  description: "周末能做完的 vibe coding 小项目。按心情挑一个，或者直接打开玩玩。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${outfit.variable} ${zcool.variable} ${noto.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

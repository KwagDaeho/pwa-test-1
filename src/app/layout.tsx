import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import LoginGoogle from "@/components/LoginGoogle";

export const generateViewport = () => ({
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  shrinkToFit: "no",
  viewportFit: "cover",
});
export const metadata: Metadata = {
  title: "PWA Next App",
  description: "PWA Next APP TEST by 9DuCK3",
  manifest: "/manifest.json",
  icons: [{ rel: "icon", url: "/icon512_maskable.png", sizes: "192x192" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Link
          href={"/"}
          style={{
            position: "fixed",
            left: "10px",
            top: "10px",
            width: "70px",
            padding: "5px 12px",
            backgroundColor: "rgba(255,255,255,0.4)",
            color: "#232323",
          }}>
          Home
        </Link>
        <Link
          href={"/LuckyDraw"}
          style={{
            position: "fixed",
            left: "90px",
            top: "10px",
            padding: "5px 12px",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            color: "#232323",
          }}>
          LuckyDraw
        </Link>
        <Link
          href={"/Game"}
          style={{
            position: "fixed",
            left: "10px",
            top: "48px",
            width: "70px",
            padding: "5px 12px",
            backgroundColor: "rgba(255,255,255,0.4)",
            color: "#232323",
          }}>
          Game
        </Link>
        <Link
          href={"/Game/LeaderBoard"}
          style={{
            position: "fixed",
            left: "90px",
            top: "48px",
            padding: "5px 12px",
            backgroundColor: "rgba(255,255,255,0.4)",
            color: "#232323",
          }}>
          Leader Board
        </Link>
        <LoginGoogle />
        {children}
        <Script src="/service-worker.js" />
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
        {children}
        <Script src="/service-worker.js" />
      </body>
    </html>
  );
}

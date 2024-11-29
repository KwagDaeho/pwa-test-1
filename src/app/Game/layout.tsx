import Link from "next/link";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Link
        href={"/Game"}
        style={{
          position: "fixed",
          left: "10px",
          top: "10px",
          padding: "5px 12px",
          backgroundColor: "rgba(255,255,255,0.4)",
          color: "#232323",
        }}>
        Game Home
      </Link>
      <main>{children}</main>
    </>
  );
}

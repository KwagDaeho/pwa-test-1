import Link from "next/link";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Link
        href={"/"}
        style={{
          position: "fixed",
          left: "10px",
          top: "10px",
          padding: "5px 12px",
          backgroundColor: "rgba(255,255,255,0.4)",
          color: "#232323",
        }}>
        HOME
      </Link>
      <main>{children}</main>
    </>
  );
}

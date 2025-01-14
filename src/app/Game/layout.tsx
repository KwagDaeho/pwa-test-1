export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main style={{ minHeight: "100dvh" }}>{children}</main>
    </>
  );
}

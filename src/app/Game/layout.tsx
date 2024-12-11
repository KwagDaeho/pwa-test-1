"use client";

import LoginGoogle from "@/components/LoginGoogle";
import useGoogleLogin from "@/hooks/useGoogleLogin";
import Link from "next/link";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, googleLogout } = useGoogleLogin();
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
        Game
      </Link>
      <Link
        href={"/Game/LeaderBoard"}
        style={{
          position: "fixed",
          left: "90px",
          top: "10px",
          padding: "5px 12px",
          backgroundColor: "rgba(255,255,255,0.4)",
          color: "#232323",
        }}>
        Leader Board
      </Link>
      {user == null ? (
        <LoginGoogle />
      ) : (
        <div
          style={{
            position: "fixed",
            right: "0px",
            top: "0px",
            padding: "5px 12px",
            backgroundColor: "rgba(255,255,255,0.4)",
            color: "#232323",
          }}
          onClick={googleLogout}>
          Logout
        </div>
      )}
      <main>{children}</main>
    </>
  );
}

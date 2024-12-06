"use client";

import Link from "next/link";

export default function LeaderBoard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        marginTop: "50px",
        textAlign: "center",
      }}>
      <Link
        href={"/"}
        style={{
          padding: "5px 12px",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          color: "#232323",
        }}>
        Home
      </Link>
      <h1>
        PWA Games
        <br />
        by Daeho Kwag{" "}
      </h1>
    </div>
  );
}

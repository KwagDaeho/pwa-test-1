"use client";

import Link from "next/link";
import "./style.css";

export default function Game() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        marginTop: "80px",
        textAlign: "center",
      }}>
      <h1>
        PWA Games
        <br />
        by Daeho Kwag <br />
      </h1>
      <h2>== Game List ==</h2>
      <ul id="game_wrap">
        <li>
          <button>
            <Link href={"/Game/Emoji"}>Emoji</Link>
          </button>
        </li>
        <li>
          <button>
            <Link href={"/Game/Santa"}>Santa</Link>
          </button>
        </li>
        <li>
          <button>
            <Link href={"/Game/Set"}>Set</Link>
          </button>
        </li>
        <li>
          <button>
            <Link href={"/Game/Bird"}>Bird</Link>
          </button>
        </li>
        <li>
          <button>
            <Link href={"/Game/CrossingBridge"}>CrossingBridge</Link>
          </button>
        </li>
      </ul>
      <div
        style={{
          marginTop: "20px",
          padding: "24px",
        }}></div>
    </div>
  );
}

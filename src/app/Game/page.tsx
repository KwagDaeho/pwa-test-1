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
        by Daeho Kwag{" "}
      </h1>
      <h2>== Game List ==</h2>
      <ul id="game_wrap">
        <li>
          <button>
            <Link href={"/Game/Santa"} target="_blank">
              Santa
            </Link>
          </button>
        </li>
        <li>
          <button>
            <Link href={"/Game/Set"} target="_blank">
              Set
            </Link>
          </button>
        </li>
        <li>
          <button>
            <Link href={"/Game/Bird"} target="_blank">
              Bird
            </Link>
          </button>
        </li>
        <li>
          <button>
            <Link href={"/Game/CrossingBridge"} target="_blank">
              CrossingBridge
            </Link>
          </button>
        </li>
      </ul>
    </div>
  );
}

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
      <div
        style={{
          marginTop: "20px",
          padding: "24px",
        }}>
        <p>
          구글 로그인을 하시면, Set/Santa 게임 종료시
          <br />
          점수가 구글 닉네임으로 자동 등록됩니다.
          <br />
          나머지 2개 게임은 리팩토링이 아직... ㅎㅎ
        </p>
      </div>
    </div>
  );
}

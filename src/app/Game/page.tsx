"use client";
import Link from "next/link";

export default function Game() {
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
      <h1>
        PWA APP
        <br />
        by Daeho Kwag{" "}
      </h1>
      <div>
        <a href="https://open.kakao.com/o/sFBLKRZe" target="_blank">
          카카오 오픈채팅
        </a>
      </div>
      <div>
        <a
          href="https://www.notion.so/darby-daeho/f16abea6cc5c4791998b6a062173da93?pvs=4"
          target="_blank">
          노션 연결
        </a>
      </div>
      <button>
        <Link href={"/Game/Bird"} target="_blank">
          [Game] Bird GO!
        </Link>
      </button>
      <button>
        <Link href={"/Game/CrossingBridge"} target="_blank">
          [Game] CrossingBridge GO!
        </Link>
      </button>
    </div>
  );
}

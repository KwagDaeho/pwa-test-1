"use client";
import Link from "next/link";

export default function Set() {
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
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          color: "#232323",
        }}>
        Go To Home
      </Link>
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
        <Link href={"/Game/Santa"} target="_blank">
          [Game] Santa GO!
        </Link>
      </button>
      <button>
        <Link href={"/Game/Set"} target="_blank">
          [Game] Set GO!
        </Link>
      </button>
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

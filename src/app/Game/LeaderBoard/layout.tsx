import Link from "next/link";
import "./style.css";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h1 style={{ paddingBlock: "100px 20px", textAlign: "center" }}>
        Leader Board
      </h1>
      <div className="leader_board_wrap">
        <ul
          id="leader_board"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            width: "max-content",
            listStyle: "none",
          }}>
          <li>
            <button>
              <Link href={"/Game/LeaderBoard/Set"}>Set</Link>
            </button>
          </li>
          <li>
            <button>
              <Link href={"/Game/LeaderBoard/Santa"}>Santa</Link>
            </button>
          </li>
          <li>
            <button>
              <Link href={"/Game/LeaderBoard/Bird"}>Bird</Link>
            </button>
          </li>
          <li>
            <button>
              <Link href={"/Game/LeaderBoard/CrossingBridge"}>
                CrossingBridge
              </Link>
            </button>
          </li>
        </ul>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          paddingBlock: "24px",
        }}>
        {children}
      </div>
    </>
  );
}

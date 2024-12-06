import Link from "next/link";
import "./style.css";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <h1 style={{ paddingTop: "100px", textAlign: "center" }}>Leader Board</h1>
      <ul
        id="leader_board"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
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

      <div>{children}</div>
    </>
  );
}

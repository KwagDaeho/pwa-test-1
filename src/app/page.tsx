import Push from "@/components/Push";
import styles from "./page.module.css";
import InstallPrompt from "@/components/InstallPrompt";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>PWA 입니다.</h1>
        <h2>다크모드를 추천!</h2>
        <div>
          <a href="https://open.kakao.com/o/sFBLKRZe" target="_blank">
            카카오 오픈채팅 연결 [새 창이 열려요!]
          </a>
        </div>
        <div>
          <a
            href="https://www.notion.so/darby-daeho/f16abea6cc5c4791998b6a062173da93?pvs=4"
            target="_blank">
            노션 연결 [새 창이 열려요!]
          </a>
        </div>
        <InstallPrompt />
        <Push />
        <Link className={styles.game} href={"/Game"}>
          <button>Play Game</button>
        </Link>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}

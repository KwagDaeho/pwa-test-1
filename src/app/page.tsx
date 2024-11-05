import styles from "./page.module.css";
import InstallPrompt from "@/components/InstallPrompt";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>93DuCK - PWA APP </h1>
        <div>
          {/* <a href="https://open.kakao.com/o/sFBLKRZe" target="_blank"> */}
          카카오 오픈채팅 연결 [새 창이 열려요!]
          {/* </a> */}
        </div>
        <div>
          {/* <a
            href="https://www.notion.so/darby-daeho/f16abea6cc5c4791998b6a062173da93?pvs=4"
            target="_blank"> */}
          노션 연결 [새 창이 열려요!]
          {/* </a> */}
        </div>
        <InstallPrompt />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}

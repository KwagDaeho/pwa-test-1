import styles from "./page.module.css";
import InstallPrompt from "@/components/InstallPrompt";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>Hi! My Name is 9DuCK3!</div>
      </main>
      <footer className={styles.footer}>
        <p>다운로드 버튼 만들기 !!</p>
        <InstallPrompt />
      </footer>
    </div>
  );
}

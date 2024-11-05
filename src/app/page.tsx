import styles from "./page.module.css";
import InstallPrompt from "@/components/InstallPrompt";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>Hi! My Name is 9DuCK3!</div>
        <InstallPrompt />
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}

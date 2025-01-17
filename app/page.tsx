import styles from "./page.module.css";
import GroupApp from "./components/group-chat/groupApp";
import ChatApp from "./components/group-chat/chatApp";

export default function Home() {
  return (
    <div className={styles.page}>
      <main>
        <div className={styles.container}>
          <GroupApp />
        </div>
      </main>
    </div>
  );
}

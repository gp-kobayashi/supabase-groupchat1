import styles from "./page.module.css";
import GroupApp from "./components/group-chat/groupApp";
import { createClient } from "@/utils/supabase/server";

const Home = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className={styles.page}>
      <main>
        <div className={styles.container}>
          <GroupApp user={user} />
        </div>
      </main>
    </div>
  );
};

export default Home;

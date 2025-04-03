import styles from "./chatApp.module.css";
import { useState } from "react";
import { redirect } from "next/navigation";
import { joinGroup } from "@/app/utils/supabase_function/group";

type Props = {
  userId: string | null;
  groupId: number;
};

const JoinCheck = (props: Props) => {
  const { userId, groupId } = props;

  const [isUserInGroup, setIsUserInGroup] = useState<boolean>(false);

  const joinChatGroup = async () => {
    if (!userId) {
      redirect("/");
    }
    await joinGroup(groupId, userId);
    setIsUserInGroup(true);
  };

  const redirectToGroupList = () => {
    redirect("/");
  };
  return (
    <div>
      {!isUserInGroup && (
        <div className={styles.join_check_container}>
          <div className={styles.join_check_info}>
            <h3>チャットへ参加しますか？</h3>
            <div className={styles.join_check_btn_container}>
              <button className={styles.join_check_btn} onClick={joinChatGroup}>
                参加
              </button>
              <button
                className={styles.join_check_btn}
                onClick={redirectToGroupList}
              >
                退室
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinCheck;

"use client";

import { SetStateAction } from "react";
import styles from "./group.module.css";
import { useRouter } from "next/navigation";
import { Group } from "@/app/types/groupchat-types";

type Props = {
  groupList: Group[];
  setGroupList: React.Dispatch<SetStateAction<Group[]>>;
};

const GroupList = ({ groupList }: Props) => {
  const router = useRouter();

  const handleClick = (id: number) => {
    router.push(`/group/${id}`);
  };
  return (
    <div>
      <ul className={styles.group_list_container}>
        {groupList.map((group) => (
          <li className={styles.group_list} key={group.id}>
            <div className={styles.group_title}>{group.title}</div>
            <button
              className={styles.group_join_btn}
              onClick={() => handleClick(group.id)}
            >
              参加
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;

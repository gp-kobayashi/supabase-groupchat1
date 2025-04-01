"use client";
import styles from "./chatApp.module.css";
import type { MemberProfile } from "@/app/types/groupchat-types";
import Image from "next/image";

type Props = {
  groupMembers: MemberProfile[];
  isShowMembers: boolean;
};

const MemberList = (props: Props) => {
  const { groupMembers, isShowMembers } = props;

  return (
    <div
      className={isShowMembers ? styles.member_list : styles.member_list_hide}
    >
      <h3>参加者</h3>
      {groupMembers.map((member) => (
        <div key={member.user_id} className={styles.member_list_item}>
          <Image
            src={member.avatar_url}
            alt="avatar"
            className={styles.member_list_avatar}
            width={40}
            height={40}
          />
          <p>{member.username}</p>
        </div>
      ))}
    </div>
  );
};

export default MemberList;

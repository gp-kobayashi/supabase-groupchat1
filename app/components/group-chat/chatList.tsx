"use client";

import styles from "./chat.module.css";
import Image from "next/image";
import { ChatWithAvatar, JoinGroups } from "@/app/types/groupchat-types";
import { useRef, useEffect } from "react";
import { redirect } from "next/navigation";
import { joinGroup } from "@/app/utils/supabase_function";

type Props = {
  chatList: ChatWithAvatar[];
  userId: string | null;
  groupId: number;
  joinGroupUser: JoinGroups[];
};

const ChatList = (props: Props) => {
  const { chatList, userId, groupId, joinGroupUser } = props;

  const redirectToGropuList = () => {
    redirect("/");
  };

  let isUserInGroup = joinGroupUser.some((user) => user.user_id === userId);

  const joinChatGroup = () => {
    if (userId === null) {
      redirect("/");
    }
    joinGroup(groupId, userId);
    isUserInGroup = true;
  };

  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatList]);

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
                onClick={redirectToGropuList}
              >
                退室
              </button>
            </div>
          </div>
        </div>
      )}

      <ul>
        {chatList.map((chat) => (
          <li className={styles.chat_list_container} key={chat.id}>
            {chat.user_id !== userId && (
              <Image
                className={styles.chat_list_avatar}
                src={chat.avatar_url}
                alt="avatar"
                width={40}
                height={40}
              />
            )}
            <div
              className={
                chat.user_id === userId
                  ? styles.chat_list_user
                  : styles.chat_list_user_other
              }
            >
              {chat.text}
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.chat_end} ref={chatEndRef}></div>
    </div>
  );
};

export default ChatList;

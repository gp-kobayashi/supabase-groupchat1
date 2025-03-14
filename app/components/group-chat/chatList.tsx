"use client";

import styles from "./chatList.module.css";
import Image from "next/image";
import { ChatWithAvatar, GroupMember } from "@/app/types/groupchat-types";
import { useRef, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { joinGroup } from "@/app/utils/supabase_function/group";

type Props = {
  chatList: ChatWithAvatar[];
  userId: string | null;
  groupId: number;
  groupMembers: GroupMember[];
};

const ChatList = (props: Props) => {
  const { chatList, userId, groupId, groupMembers } = props;
  const [isUserInGroup, setIsUserInGroup] = useState<boolean>(false);

  useEffect(() => {
    if (userId && groupMembers) {
      setIsUserInGroup(groupMembers.some((user) => user.user_id === userId));
    }
  }, [groupMembers, userId]);

  const redirectToGropuList = () => {
    redirect("/");
  };

  const joinChatGroup = async () => {
    if (!userId) {
      redirect("/");
    }
    await joinGroup(groupId, userId);
    setIsUserInGroup(true);
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

      <ul className={styles.chat_list_container}>
        {chatList.map((chat) => (
          <li className={styles.chat_list_item} key={chat.id}>
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

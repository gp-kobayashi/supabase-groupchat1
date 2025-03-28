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

  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatList]);

  return (
    <div>
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

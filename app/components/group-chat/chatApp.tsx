"use client";

import { useState, useEffect, useCallback } from "react";
import {
  addChat,
  getChatList,
  getJoinGroupUser,
  leaveCahtGroup,
} from "@/app/utils/supabase_function";
import ChatList from "./chatList";
import styles from "./chat.module.css";
import { ChatWithAvatar, Group, JoinGroups } from "@/app/types/groupchat-types";
import { redirect } from "next/navigation";

type Props = {
  groupId: Group["id"];
  userId: string | null;
};

const ChatApp = (props: Props) => {
  const { groupId, userId } = props;
  const [chatList, setChatList] = useState<ChatWithAvatar[]>([]);
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState("");
  const [joinGroupUser, setJoinGroupUser] = useState<JoinGroups[]>([]);

  useEffect(() => {
    const chatList = async () => {
      const { data, error } = await getChatList(groupId);
      if (error) {
        setMessages("エラーが発生しました" + error.message);
        return;
      }
      setChatList(data || []);
      console.log(data);
    };
    chatList();
    const joinGroupUser = async () => {
      const { data, error } = await getJoinGroupUser(groupId);
      if (error) {
        setMessages("エラーが発生しました" + error.message);
        return;
      }
      setJoinGroupUser(data || []);
    };
    joinGroupUser();
  }, [groupId]);

  const leaveGroup = () => {
    if (userId === null) {
      return;
    }
    leaveCahtGroup(groupId, userId);
    redirect("/");
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (text === "") return;
      if (userId === null) {
        setMessages("ログインしてください");
        return;
      }
      const { data: updatedChat, error } = await addChat(groupId, userId, text);

      if (error) {
        setMessages("エラーが発生しました" + error.message);
        return;
      }
      if (updatedChat) {
        setChatList((prevChatList) => [...prevChatList, updatedChat]);
      }
      setText("");
      setMessages("");
    },
    [text, groupId, userId]
  );

  let joinUserList = true;

  return (
    <div className={styles.chat_container}>
      <ChatList
        chatList={chatList}
        userId={userId}
        groupId={groupId}
        joinGroupUser={joinGroupUser}
      />

      <div className={styles.chat_form}>
        <button className={styles.member_list_btn}>参加者</button>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            className={styles.chat_input}
            type="text"
            placeholder="チャット…"
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <button className={styles.chat_input_btn}>送信</button>
        </form>
        <button className={styles.leave_btn} onClick={leaveGroup}>
          退室
        </button>
      </div>
      {messages && <div>{messages}</div>}
    </div>
  );
};

export default ChatApp;

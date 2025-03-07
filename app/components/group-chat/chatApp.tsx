"use client";

import { useState, useEffect, useCallback } from "react";
import {
  addChat,
  getChatList,
  getGroupMember,
  breakGroup,
  leaveGroup,
} from "@/app/utils/supabase_function";
import ChatList from "./chatList";
import styles from "./chat.module.css";
import {
  ChatWithAvatar,
  Group,
  MemberProfile,
} from "@/app/types/groupchat-types";
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
  const [groupMembers, setGroupMembers] = useState<MemberProfile[]>([]);
  const [isShowMembers, setIsShowMembers] = useState(false);
  const isUserAdmin = groupMembers.some(
    (member) => member.user_id === userId && member.role === "admin"
  );

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
    const groupMembers = async () => {
      const { data, error } = await getGroupMember(groupId);
      if (error) {
        setMessages("エラーが発生しました" + error.message);
        return;
      }
      setGroupMembers(data || []);
    };
    groupMembers();
  }, [groupId]);

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
  const showMembersToggle = () => {
    setIsShowMembers(!isShowMembers);
  };

  const breakChatGroup = async () => {
    breakGroup(groupId);
    redirect("/");
  };

  const leaveChatGroup = async () => {
    if (userId) {
      leaveGroup(groupId, userId);
      redirect("/");
    }
  };

  return (
    <div className={styles.chat_container}>
      <div className={styles.main_space}>
        <div
          className={
            isShowMembers ? styles.member_list : styles.member_list_hide
          }
        >
          <h3>参加者</h3>
          {groupMembers.map((member) => (
            <div key={member.user_id} className={styles.member_list_item}>
              <img
                src={member.avatar_url}
                alt="avatar"
                className={styles.member_list_avatar}
              />
              <p>{member.username}</p>
            </div>
          ))}
        </div>
        <ChatList
          chatList={chatList}
          userId={userId}
          groupId={groupId}
          groupMembers={groupMembers}
        />
      </div>
      <div className={styles.chat_form}>
        <button className={styles.member_list_btn} onClick={showMembersToggle}>
          参加者
        </button>
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
        {isUserAdmin ? (
          <button className={styles.break_group_btn} onClick={breakChatGroup}>
            グループ解散
          </button>
        ) : (
          <button className={styles.leave_group_btn} onClick={leaveChatGroup}>
            退室
          </button>
        )}
      </div>

      {messages && <div>{messages}</div>}
    </div>
  );
};

export default ChatApp;

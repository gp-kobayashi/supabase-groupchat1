"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getGroupMember,
  breakGroup,
  leaveGroup,
  joinGroup,
} from "@/app/utils/supabase_function/group";
import { getChatList, addChat } from "@/app/utils/supabase_function/chat";
import ChatList from "./chatList";
import styles from "./chatApp.module.css";
import {
  ChatWithAvatar,
  Group,
  MemberProfile,
} from "@/app/types/groupchat-types";
import { redirect } from "next/navigation";
import Image from "next/image";

type Props = {
  groupId: Group["id"];
  userId: string | null;
};

const ChatApp = (props: Props) => {
  const { groupId, userId } = props;
  const [chatList, setChatList] = useState<ChatWithAvatar[]>([]);
  const [text, setText] = useState<string>("");
  const [messages, setMessages] = useState<string>("");
  const [groupMembers, setGroupMembers] = useState<MemberProfile[]>([]);
  const [isShowMembers, setIsShowMembers] = useState<boolean>(false);
  const [isShowLeaveGroup, setIsShowLeaveGroup] = useState<boolean>(false);
  const [isUserInGroup, setIsUserInGroup] = useState<boolean>(false);
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
  }, [groupId, isUserInGroup]);
  const redirectToGropuList = () => {
    redirect("/");
  };
  useEffect(() => {
    if (userId && groupMembers) {
      setIsUserInGroup(groupMembers.some((user) => user.user_id === userId));
    }
  }, [groupMembers, userId]);

  const joinChatGroup = async () => {
    if (!userId) {
      redirect("/");
    }
    await joinGroup(groupId, userId);
    setIsUserInGroup(true);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!text) return;
      if (!userId) {
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
      <div className={styles.main_space}>
        <div
          className={
            isShowMembers ? styles.member_list : styles.member_list_hide
          }
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
        <ChatList chatList={chatList} userId={userId} />
      </div>
      <div
        className={
          isShowLeaveGroup
            ? styles.leave_group_confirm
            : styles.leave_group_confirm_hide
        }
      >
        <p>グループから離脱しますか？</p>
        <div className={styles.leave_group_btns}>
          <button className={styles.leave_confirm_btn} onClick={leaveChatGroup}>
            はい
          </button>
          <button
            className={styles.leave_confirm_btn}
            onClick={() => setIsShowLeaveGroup(false)}
          >
            いいえ
          </button>
        </div>
      </div>
      <div className={styles.chat_form}>
        <button
          className={styles.member_list_btn}
          onClick={() => setIsShowMembers((prevState) => !prevState)}
        >
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
          <button
            className={styles.leave_group_btn}
            onClick={() => setIsShowLeaveGroup((prevState) => !prevState)}
          >
            グループ離脱
          </button>
        )}
      </div>

      {messages && <div>{messages}</div>}
    </div>
  );
};

export default ChatApp;

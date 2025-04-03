"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect, useCallback } from "react";
import {
  getGroupMember,
  breakGroup,
  leaveGroup,
} from "@/app/utils/supabase_function/group";
import {
  fetchProfile,
  formatAvatarUrl,
} from "@/app/utils/supabase_function/profile";
import { getChatList, addChat } from "@/app/utils/supabase_function/chat";
import ChatList from "../list/chatList";
import MemberList from "./memberList";
import JoinCheck from "./joinCheck";
import styles from "./chatApp.module.css";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import {
  ChatWithAvatar,
  Group,
  Chat,
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
  const [messages, setMessages] = useState<string>("");
  const [groupMembers, setGroupMembers] = useState<MemberProfile[]>([]);
  const [isShowMembers, setIsShowMembers] = useState<boolean>(false);
  const [isShowLeaveGroup, setIsShowLeaveGroup] = useState<boolean>(false);
  const [isUserInGroup, setIsUserInGroup] = useState<boolean>(false);
  const isUserAdmin = groupMembers.some(
    (member) => member.user_id === userId && member.role === "admin"
  );
  const supabase = createClient();

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

  useEffect(() => {
    if (userId && groupMembers) {
      setIsUserInGroup(groupMembers.some((user) => user.user_id === userId));
    }
  }, [groupMembers, userId]);

  useEffect(() => {
    const channel = supabase
      .channel("chats")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chats" },
        async (payload: RealtimePostgresInsertPayload<Chat>) => {
          const newChat = payload.new;
          const profile = await fetchProfile(newChat.user_id);
          const avatarUrl = formatAvatarUrl(profile.data?.avatar_url);
          const updatedChat: ChatWithAvatar = {
            ...newChat,
            avatar_url: avatarUrl,
          };
          setChatList((prevChatList) => [...prevChatList, updatedChat]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!text) return;
      if (!userId) {
        setMessages("ログインしてください");
        return;
      }
      const { error } = await addChat(groupId, userId, text);

      if (error) {
        setMessages("エラーが発生しました" + error.message);
        return;
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
      {!isUserInGroup && <JoinCheck userId={userId} groupId={groupId} />}
      <div className={styles.main_space}>
        <MemberList groupMembers={groupMembers} isShowMembers={isShowMembers} />
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

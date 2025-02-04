"use client";

import { useState,useEffect,useCallback } from "react";
import { AddChat, GetChatList } from "@/app/utils/supabase_function";
import type { Database } from "@/lib/database.types";
import ChatList from "./chatList";
import styles from "./chat.module.css";

    type Props = {
        groupId: number;
        userId: string |  null;
        avatar_url: Database["public"]["Tables"]["profiles"]["Row"]["avatar_url"];
    }

    type Chat = Database["public"]["Tables"]["chats"]["Row"];

    type ChatWithAvatar ={
        create_at: Chat["create_at"];
        group_id: Chat["group_id"];
        id: Chat["id"];
        profiles:{avatar_url: Database["public"]["Tables"]["profiles"]["Row"]["avatar_url"]};
        text : Chat["text"];
        user_id: Chat["user_id"];
        update_at: Chat["update_at"];
    }

const ChatApp = ({groupId,userId,avatar_url}:Props) => {

    const [chatList, setChatList] = useState<ChatWithAvatar[]>([]);
    const [text, setText]= useState<string>("");
    const [messages, setMessages] = useState(""); 

    useEffect (() => {
            const chatList = async () => {
                const {data, error} = await GetChatList(groupId);
                if(error){
                    setMessages("エラーが発生しました"+error.message);
                    return;
                }
                setChatList(data || []);
                console.log(data);
            }
            chatList();
        },[groupId])
        
    const handleSubmit = useCallback(
            async(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if(text === "")return;
                if(userId === null){
                    setMessages("ログインしてください");
                    return;
                }
                const {data:updatedChat, error } = await AddChat(groupId,userId,text);
    
                if(error){
                    setMessages("エラーが発生しました"+error.message);
                    return;
                }
                if(updatedChat){
                    const newMessage = { ...updatedChat, profiles: {avatar_url: avatar_url}};
                    setChatList((prevChatList)=>[...prevChatList,newMessage]);
                }
                setText("");
                setMessages("");
            },[text,groupId,userId,avatar_url],
        );

    return (
        <div className={styles.chat_container}>
            <ChatList chatList={chatList} userId={userId}/>
            <div className={styles.chat_form}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                        className={styles.chat_input}
                        type="text"
                        placeholder="チャット…"
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    />
                    <button
                        className={styles.chat_input_btn}
                    >
                        送信
                    </button>
            </form>
            </div>
            {messages && <div>{messages}</div>}
            
        </div>
    )
}

export default ChatApp;
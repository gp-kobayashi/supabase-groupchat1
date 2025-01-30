"use client";

import { useState,useEffect,useCallback } from "react";
import { AddChat, GetChatList,fetchAvatarPath, fetchProfile } from "@/app/utils/supabase_function";
import type { Database } from "@/lib/database.types";
import ChatList from "./chatList";
import styles from "./chat.module.css";

 type Props = {
        groupId: number;
        userId: string |  null;
    }

const ChatApp = ({groupId,userId}:Props) => {

    const [chatList, setChatList] = useState<Database["public"]["Tables"]["chats"]["Row"][]>([]);
    const [text, setText]= useState<string>("");
    const [messages, setMessages] = useState(""); 
    const [avatarPath, setAvatarPath] = useState<string>("");

    useEffect (() => {
            const chatList = async () => {
                const {data, error} = await GetChatList(groupId);
                if(error){
                    setMessages("エラーが発生しました"+error.message);
                    return;
                }
                setChatList(data || []);
            }
            chatList();
        },[])
        
    const handleSubmit = useCallback(
            async(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if(text === "")return;
                const {data:updatedChatList, error } = await AddChat(groupId,userId,text);
    
                if(error){
                    setMessages("エラーが発生しました"+error.message);
                    return;
                }
                if(updatedChatList){
                    setChatList((prevChatList)=>[...prevChatList,updatedChatList]);
                }
                setText("");
                setMessages("");
            },[text,groupId,userId],
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
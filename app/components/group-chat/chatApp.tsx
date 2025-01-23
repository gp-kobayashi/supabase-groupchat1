"use client";

import { useState,useEffect,useCallback } from "react";
import { AddChat, GetChatList } from "@/app/utils/supabase_function";
import type { Database } from "@/lib/database.types";
import ChatList from "./chatList";
 type Props = {
        groupId: number;
        userId: string;
    }

const ChatApp = ({groupId,userId}:Props) => {
    
   
    const [chatList, setChatList] = useState<Database["public"]["Tables"]["chats"]["Row"][]>([]);
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
        <div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="text"
                    placeholder="チャット…"
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                />
                <button>
                    送信
                </button>
            </form>
            {messages && <div>{messages}</div>}
            <ChatList chatList={chatList} setChatList={setChatList}  />
        </div>
    )
}

export default ChatApp;
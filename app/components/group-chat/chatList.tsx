"use client";

import { useCallback,useState, SetStateAction } from "react"
import type { Database } from "@/lib/database.types";
import styles from "./chat.module.css";

type Props = {
    chatList: Database["public"]["Tables"]["chats"]["Row"][];
    setChatList: React.Dispatch<SetStateAction<Database["public"]["Tables"]["chats"]["Row"]>>;
    userId: string;
}

const ChatList= (props:Props) =>{
    
    const {chatList, setChatList,userId} = props;

    return (
        <div>
            <ul>
                {chatList.map((chat) => (
                    <li
                        className={styles.chat_list}
                        key={chat.id}
                    >
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
        </div>
    );
}

export default ChatList;
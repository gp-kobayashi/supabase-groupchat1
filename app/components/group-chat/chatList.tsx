"use client";

import { useEffect } from "react"
import { fetchAvatarPath, fetchProfile } from "@/app/utils/supabase_function";
import type { Database } from "@/lib/database.types";
import styles from "./chat.module.css";
import Image from "next/image";
type Props = {
    chatList: Database["public"]["Tables"]["chats"]["Row"][];
    userId: string | null;
}


const ChatList= (props:Props) =>{
    const {chatList,userId} = props;

    return (
        <div>
            <ul>
                {chatList.map((chat) => (
                    <li
                        className={styles.chat_list_container}
                        key={chat.id}
                    >  
                        {chat.user_id !== userId && (
                            <Image
                            className={styles.chat_list_avatar}
                            src="/default.png"
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
        </div>
    );
}

export default ChatList;
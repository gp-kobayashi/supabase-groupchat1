"use client";

import type { Database } from "@/lib/database.types";
import styles from "./chat.module.css";
import Image from "next/image";

type message ={
    Chat: Database["public"]["Tables"]["chats"]["Row"],
    avatar_url: Database["public"]["Tables"]["profiles"]["Row"]["avatar_url"];
}
type Props = {
    chatList: message[];
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
                            src={chat.profiles.avatar_url ==null ? "/default.png" : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${chat.profiles.avatar_url}`}
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
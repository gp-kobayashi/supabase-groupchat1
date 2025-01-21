"use client";

import { useCallback,useState, SetStateAction } from "react"
import type { Database } from "@/lib/database.types";


type Props = {
    chatList: Database["public"]["Tables"]["chats"]["Row"];
    setGroupList: React.Dispatch<SetStateAction<Database["public"]["Tables"]["chats"]["Row"][]>>;
}

const ChatList = ({props:Props}) => {
    const [chatList, setChatList] = useState<Database["public"]["Tables"]["chats"]["Row"][]>([]);


    return (
        <div>
            <ul>
                {chatList.map((chat) => (
                    <li key={chat.id}>
                        <div>{chat.text}</div>
                    </li>
                ))} 
            </ul>
        </div>
    );
}

export default ChatList;
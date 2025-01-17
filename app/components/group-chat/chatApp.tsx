"use client";

import { useState } from "react";
import type { Database } from "@/lib/database.types";
import ChatList from "./chatList";



const ChatApp = () => {

    const [chatList, setChatList] = useState<Database["public"]["Tables"]["chats"]["Row"][]>([]);

    return (
        <div>
            <form >
                <input
                    type="text"
                    placeholder="メッセージ……"
                />
                <button>
                    送信
                </button>
            </form>
            <ChatList />
        </div>
    )
}

export default ChatApp;
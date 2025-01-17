"use client";

import { useCallback,useState, SetStateAction } from "react"
import style from "./groupchat.module.css";
import { Database } from "@/lib/database.types";
import { GetChatList } from "@/app/utils/supabase_function";
import ChatApp from "./chatApp";

type Props = {
    groupList: Database["public"]["Tables"]["groups"]["Row"][];
    setGroupList: React.Dispatch<SetStateAction<Database["public"]["Tables"]["groups"]["Row"][]>>;
}

const GroupList = (props:Props) => {
    const {groupList, setGroupList} = props;
    return(
        <div>
            <ul>
                {groupList.map((group) => (
                    <li key={group.id}>
                        <div>{group.title}</div>
                        <button onClick={() => GetChatList(group.id)}>
                        参加
                        </button>
                    </li>
                ))
                }
            </ul>
            <div>
                <ChatApp />
            </div>
        </div>
        
    )
}

export default GroupList;
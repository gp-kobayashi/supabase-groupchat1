"use client";

import { useCallback,useState, SetStateAction } from "react";
import { Database } from "@/lib/database.types";
import { GetChatList } from "@/app/utils/supabase_function";

type Props = {
    groupList: Database["public"]["Tables"]["groups"]["Row"][];
    setGroupList: React.Dispatch<SetStateAction<Database["public"]["Tables"]["groups"]["Row"][]>>;
}

const GroupList = ({ Props:Props }) => {

    const {groupList, setGroupList} = Props;

    return(
        <div>
            <ul>
                {groupList.map((group) => (
                    <li key={groupList.id}>
                        <div>{groupList.title}</div>
                        <button onClick={() => GetChatList(groupList.id)}>
                        参加
                        </button>
                    </li>
                ))
                }
            </ul>
        </div>
    )
}

export default GroupList;
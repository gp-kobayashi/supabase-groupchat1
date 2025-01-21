"use client";

import { useCallback,useState, SetStateAction } from "react"
import style from "./groupchat.module.css";
import { Database } from "@/lib/database.types";
import { useRouter } from "next/navigation";


type Props = {
    groupList: Database["public"]["Tables"]["groups"]["Row"][];
    setGroupList: React.Dispatch<SetStateAction<Database["public"]["Tables"]["groups"]["Row"][]>>;
}

const GroupList = (props:Props) => {
    const router = useRouter();

    const {groupList, setGroupList} = props;
    
    const handleClick = (id:number) =>{
        router.push(`/group/${id}`);
    }
    return(
        <div>
            <ul>
                {groupList.map((group) => (
                    <li key={group.id}>
                        <div>{group.title}</div>
                        <button onClick={() => handleClick(group.id)}>
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
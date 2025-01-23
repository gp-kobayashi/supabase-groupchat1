"use client";

import { useState,useEffect,useCallback } from 'react';
import { Database } from '@/lib/database.types';
import GroupList  from './groupList';
import { GetGroupList,CreateGroup } from '@/app/utils/supabase_function';
import styles from './group.module.css';

const GroupApp = () => {
    const [groupList, setGroupList] = useState<Database["public"]["Tables"]["groups"]["Row"][]>([]);
    const [title, setTitle]= useState<string>("");
    const [message, setMessages] = useState("");

    useEffect (() => {
        const groupList = async () => {
            const {data, error} = await GetGroupList();
            if(error){
                setMessages("エラーが発生しました"+error.message);
                return;
            }
            setGroupList(data || []);
        }
        groupList();
    },[groupList])

    const handleSubmit = useCallback(
        async(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if(title === "")return;
            const {data:updatedGroupList, error } = await CreateGroup(title);

            if(error){
                setMessages("エラーが発生しました"+error.message);
                return;
            }
            if(updatedGroupList){
                setGroupList((prevGroupList)=>[...prevGroupList, updatedGroupList]);
            }
            setTitle("");
            setMessages("");
        },[title, groupList],
    );

    return(
        <div className={styles.group_container}>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    className={styles.group_input}
                    type="text"
                    placeholder="グループ名"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <button className={styles.group_input_btn}>
                    グループ作成
                </button>
            </form>
            <GroupList groupList={groupList} setGroupList={setGroupList}/>
        </div>
    );
}

export default GroupApp;
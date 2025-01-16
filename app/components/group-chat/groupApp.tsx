import { useState,useEffect } from 'react';
import { Database } from '@/lib/database.types';
import GroupList  from './groupList';
import { GetGroupList } from '@/app/utils/supabase_function';


const GroupApp = () => {
    const [groupList, setGroupList] = useState<Database["public"]["Tables"]["groups"]["Row"][]>([]);
    const [title, setTitle]= useState("");
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
    },[])

    return(
        <div>
            <form >
                <input
                    type="text"
                    placeholder="グループ名"
                />
                <button>
                    グループ作成
                </button>
            </form>
            <GroupList groupList={groupList} setGroupList={setGroupList}/>
        </div>
    );
}

export default GroupApp;
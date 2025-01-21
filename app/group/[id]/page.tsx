import ChatApp from '@/app/components/group-chat/chatApp';
import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/lib/database.types';

const group = async() => {
  type UserId = Database["public"]["Tables"]["profiles"]["Row"]["id"];
  
  const supabase = await createClient()
  
  const {
    data: { user },
} = await supabase.auth.getUser()

let userId = null;

if(user){
    const fetchUserId = await supabase
        .from('profiles')
        .select("id")
        .eq('id', user.id)
        .single()
    userId = fetchUserId;
}

    return (
      <div>
        <ChatApp groupId={groupId} userId={userId}/>
      </div>
    );
}

export default group;
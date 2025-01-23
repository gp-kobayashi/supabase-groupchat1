import ChatApp from '@/app/components/group-chat/chatApp';
import { createClient } from '@/utils/supabase/server';
import type { Database } from '@/lib/database.types';

const group = async({params}) => {
  type UserId = Database["public"]["Tables"]["profiles"]["Row"]["id"];
  
  const { id } = await params;

  const supabase = await createClient()
  
  const {
    data: { user },
} = await supabase.auth.getUser()

let userId = null;

if(user){
    const fetchUserId = await supabase
        .from('profiles')
        .select("*")
        .eq('id', user.id)
        .single()
    userId = fetchUserId.data.id;
}

    return (
      <div>
        <ChatApp groupId={id} userId={userId}/>
      </div>
    );
}

export default group;
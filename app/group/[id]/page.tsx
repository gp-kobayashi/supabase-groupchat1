import ChatApp from '@/app/components/group-chat/chatApp';
import { createClient } from '@/utils/supabase/server';
import { fetchProfile } from '@/app/utils/supabase_function';

interface Params{
  id:number
}

const group = async({params}:{params : Params}) => {

  const { id } = params;

  const supabase = await createClient()
  
  const {
    data: { user },
} = await supabase.auth.getUser()

if (!user) return;
const user_Id =user.id

let userId = null;

let avatar_url = null;

if(user){
    const fetchUserProfile =await fetchProfile(user_Id);
   if(fetchUserProfile.data){
    userId = fetchUserProfile.data.id;
    avatar_url = fetchUserProfile.data.avatar_url;
  }
}

    return (
      <div>
        <ChatApp groupId={id} userId={userId} avatar_url={avatar_url}/>
      </div>
    );
}

export default group;
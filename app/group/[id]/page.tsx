import ChatApp from "@/app/components/group-chat/chatApp";
import { createClient } from "@/utils/supabase/server";
import { fetchProfile } from "@/app/utils/supabase_function";
import { redirect } from "next/navigation";

interface Params {
  id: number;
}

const group = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  const Id = user.id;

  let userId = null;

  let avatarUrl = null;

  if (user) {
    const fetchUserProfile = await fetchProfile(Id);
    if (fetchUserProfile.data) {
      userId = fetchUserProfile.data.id;
      avatarUrl = fetchUserProfile.data.avatar_url;
    }
  }

  return (
    <div>
      <ChatApp groupId={id} userId={userId} avatarUrl={avatarUrl} />
    </div>
  );
};

export default group;

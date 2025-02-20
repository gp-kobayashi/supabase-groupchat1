import ChatApp from "@/app/components/group-chat/chatApp";
import { createClient } from "@/utils/supabase/server";
import { fetchProfile } from "@/app/utils/supabase_function";
import { redirect } from "next/navigation";

interface Params {
  id: number;
}

const group = async ({ params: { id } }: { params: Params }) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const UserProfile = await fetchProfile(user.id);

  return (
    <div>
      <ChatApp groupId={id} userId={UserProfile.data?.id || null} />
    </div>
  );
};

export default group;

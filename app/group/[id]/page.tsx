import ChatApp from "@/app/components/group-chat/chat/app/chatApp";
import { createClient } from "@/utils/supabase/server";
import { fetchProfile } from "@/app/utils/supabase_function/profile";
import { redirect } from "next/navigation";

interface Params {
  id: number;
}

const group = async ({ params }: { params: Promise<Params> }) => {
  const { id } = await params;
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

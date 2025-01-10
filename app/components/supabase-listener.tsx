"use server"

import { createClient } from "@/utils/supabase/server"
import Navigation from "./navigation";
import { Database } from "@/lib/database.types"

const SupabaseListener = async () => {
    const supabase = await createClient()

    const {
        data: {session},
    } = await supabase.auth.getSession()

    let profile = null;

  if (session) {
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    profile = currentProfile;

    if (currentProfile && currentProfile.email !== session.user.email) {
      const { data: updatedProfile } = await supabase
        .from("profiles")
        .update({ email: session.user.email })
        .match({ id: session.user.id })
        .select("*")
        .single();
      profile = updatedProfile;
    }
  }

  return <Navigation session={session} profile={profile} />;
};
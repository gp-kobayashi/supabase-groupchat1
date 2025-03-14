import { supabase } from "../supabase";
import type { Profile, SupabaseResponse } from "../../types/groupchat-types";

export const defaultAvatarUrl = "/default.png";

export const getAvatarUrl = (avatarUrl: string) => {
  const { data } = supabase.storage.from("avatars").getPublicUrl(avatarUrl);
  return data.publicUrl;
};

export const insertAavatarUrl = (avatarUrl: string | null) => {
  return avatarUrl ? getAvatarUrl(avatarUrl) : defaultAvatarUrl;
};

export const fetchProfile = async (
  userId: string
): Promise<SupabaseResponse<Profile>> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
};

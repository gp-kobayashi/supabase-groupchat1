import { supabase } from "../supabase";
import type { Profile, SupabaseResponse } from "../../types/groupchat-types";

export const DEFAULT_AVATAR_URL = "/default.png";

export const getAvatarUrl = (avatarUrl: string) => {
  const { data } = supabase.storage.from("avatars").getPublicUrl(avatarUrl);
  return data.publicUrl;
};

export const formatAvatarUrl = (avatarUrl: string | null) => {
  return avatarUrl ? getAvatarUrl(avatarUrl) : DEFAULT_AVATAR_URL;
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

import { supabase } from "./supabase";
import type {
  Chat,
  Profile,
  Group,
  ChatWithAvatar,
} from "../type/groupchat-types";

type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

export const getGroupList = async (): Promise<SupabaseResponse<Group[]>> => {
  const { data, error } = await supabase.from("groups").select("*");
  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
};

export const createGroup = async (
  title: string
): Promise<SupabaseResponse<Group>> => {
  const { data, error } = await supabase
    .from("groups")
    .insert({ title })
    .select()
    .single();
  return { data, error };
};

export const getChatList = async (
  groupId: number
): Promise<SupabaseResponse<ChatWithAvatar[]>> => {
  const { data, error } = await supabase
    .from("chats")
    .select("*,profiles(avatar_url)")
    .eq("group_id", groupId);
  if (error) {
    return { data: null, error };
  }
  if (data) {
    const messageData = await Promise.all(
      data.map(async (chat) => {
        const userAvatar = await fetchAvatarPath(chat.profiles.avatar_url);
        return {
          ...chat,
          avatarUrl: userAvatar.data.publicUrl,
        };
      })
    );
    return { data: messageData, error: null };
  }
  return { data, error: null };
};

export const addChat = async (
  groupId: number,
  userId: string,
  text: string
): Promise<SupabaseResponse<Chat>> => {
  const { data, error } = await supabase
    .from("chats")
    .insert({
      group_id: groupId,
      user_id: userId,
      text: text,
    })
    .select()
    .single();
  return { data, error };
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

export const fetchAvatarPath = (avatarUrl: string) => {
  const { data } = supabase.storage.from("avatars").getPublicUrl(avatarUrl);
  return { data };
};

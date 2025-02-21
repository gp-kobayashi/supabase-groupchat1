import { supabase } from "./supabase";
import type { Profile, Group, ChatWithAvatar } from "../types/groupchat-types";

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
    const messageData = data.map((chat) => {
      const avatarUrl = insertAavatarUrl(chat.profiles.avatar_url);
      return {
        ...chat,
        avatar_url: avatarUrl,
      };
    });
    return { data: messageData, error: null };
  }
  return { data, error: null };
};

export const addChat = async (
  groupId: number,
  userId: string,
  text: string
): Promise<SupabaseResponse<ChatWithAvatar>> => {
  const { data: chat, error } = await supabase
    .from("chats")
    .insert({
      group_id: groupId,
      user_id: userId,
      text: text,
    })
    .select("*,profiles(avatar_url)")
    .single();
  if (error) {
    return { data: null, error };
  }
  const avatarUrl = insertAavatarUrl(chat.profiles.avatar_url);
  const chatWithAvatar = {
    ...chat,
    avatar_url: avatarUrl,
  };

  return { data: chatWithAvatar, error };
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

export const getAvatarUrl = (avatarUrl: string) => {
  const { data } = supabase.storage.from("avatars").getPublicUrl(avatarUrl);
  return data.publicUrl;
};

export const insertAavatarUrl = (avatarUrl: string | null) => {
  const data = avatarUrl ? getAvatarUrl(avatarUrl) : "/default.png";
  return data;
};

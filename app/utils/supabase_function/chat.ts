import { supabase } from "../supabase";
import { insertAavatarUrl } from "./profile";
import type {
  ChatWithAvatar,
  SupabaseResponse,
} from "../../types/groupchat-types";

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
  const messageData = data.map((chat) => {
    const avatarUrl = insertAavatarUrl(chat.profiles.avatar_url);
    return {
      ...chat,
      avatar_url: avatarUrl,
    };
  });
  return { data: messageData, error: null };
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

  return { data: chatWithAvatar, error: null };
};

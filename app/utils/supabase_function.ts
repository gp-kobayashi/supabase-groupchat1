import { supabase } from "./supabase";
import type {
  Profile,
  Group,
  ChatWithAvatar,
  GroupMember,
  MemberProfile,
} from "../types/groupchat-types";

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
  title: string,
  userId: string
): Promise<SupabaseResponse<Group>> => {
  const { data: groupData, error } = await supabase
    .from("groups")
    .insert({ title })
    .select()
    .single();
  if (error) {
    return { data: null, error };
  }
  const groupId = groupData.id;
  const { error: memberError } = await supabase
    .from("group_members")
    .insert({
      user_id: userId,
      group_id: groupId,
      role: "admin",
      status: "active",
    })
    .select()
    .single();
  if (memberError) {
    return { data: null, error: memberError };
  }
  return { data: groupData, error: null };
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
  return avatarUrl ? getAvatarUrl(avatarUrl) : "/default.png";
};

export const getGroupMember = async (
  groupId: number
): Promise<SupabaseResponse<MemberProfile[]>> => {
  const { data: members, error } = await supabase
    .from("group_members")
    .select("*,user_id(avatar_url,username,id)")
    .eq("group_id", groupId);
  if (error) {
    return { data: null, error };
  }
  const memberProfiles = members.map((member) => {
    const avatarUrl = insertAavatarUrl(member.user_id.avatar_url);
    return {
      ...member,
      avatar_url: avatarUrl,
      username: member.user_id.username,
      user_id: member.user_id.id,
    };
  });
  return { data: memberProfiles, error: null };
};

export const joinGroup = async (
  groupId: number,
  userId: string
): Promise<SupabaseResponse<GroupMember>> => {
  const { data, error } = await supabase
    .from("group_members")
    .insert({
      group_id: groupId,
      user_id: userId,
      role: "member",
      status: "active",
    })
    .select()
    .single();
  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
};

export const breakGroup = async (
  groupId: number
): Promise<SupabaseResponse<Group>> => {
  const { data, error } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId)
    .single();
  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
};

export const leaveGroup = async (
  groupId: number,
  userId: string
): Promise<SupabaseResponse<GroupMember>> => {
  const { data, error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .single();
  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
};

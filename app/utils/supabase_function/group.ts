import { supabase } from "../supabase";
import { insertAavatarUrl } from "./profile";
import type {
  Group,
  GroupMember,
  MemberProfile,
  SupabaseResponse,
} from "../../types/groupchat-types";

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

export const getGroupMember = async (
  groupId: number
): Promise<SupabaseResponse<MemberProfile[]>> => {
  const { data: members, error } = await supabase
    .from("group_members")
    .select("*,profiles!user_id(avatar_url,username,id)")
    .eq("group_id", groupId);
  if (error) {
    return { data: null, error };
  }
  const memberProfiles = members.map((member) => {
    const avatarUrl = insertAavatarUrl(member.profiles.avatar_url);
    return {
      ...member,
      avatar_url: avatarUrl,
      username: member.profiles.username,
      user_id: member.profiles.id,
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

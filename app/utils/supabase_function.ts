import { supabase } from "./supabase";
import type { Database } from "@/lib/database.types";

type Group = Database["public"]["Tables"]["groups"]["Row"];
type Chat = Database["public"]["Tables"]["chats"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type SupabaseResponse<T> = {
    data: T | null;
    error: Error | null;
  };

export const GetGroupList = async ():Promise<SupabaseResponse<Group[]>> => {
    const { data, error } = await supabase
        .from('groups')
        .select('*');
    if (error) {
        return {data: null, error};
    }
    return {data, error: null};
}

export const CreateGroup = async (
        title: string
    ):Promise<SupabaseResponse<Group>> => {
        const { data, error } = await supabase
            .from('groups')
            .insert({ title })
            .select()
            .single();
        return {data, error};
}; 

export const GetChatList = async (
    groupId: number
    ) :Promise<SupabaseResponse<Chat[]>>=> {
        const { data, error } = await supabase
            .from('chats')
            .select('*')
            .eq("group_id",groupId);
        if(error){
            return {data: null, error};
        }
    return {data, error: null};
}

export const AddChat = async (
        groupId: number,
        userId: string,
        text: string
    ):Promise<SupabaseResponse<Chat>> => {
        const { data, error } = await supabase
            .from('chats')
            .insert({
                group_id: groupId,
                user_id: userId,
                text: text
            })
            .select()
            .single();
        return {data, error};
};

export const fetchProfile =async (
        userId: string
    ) :Promise<SupabaseResponse<Profile>>=> {
        const { data, error } = await supabase
        .from('profiles')
        .select("*")
        .eq('id', userId)
        .single();
    if (error) {
    return { data: null, error };
  }
  return { data, error: null };
};

    

export const fetchAvatarPath = async (
    avatarUrl: string
    ) => {
    const { data } = supabase
    .storage
    .from('avatars')
    .getPublicUrl(avatarUrl)
    return{ data };
}
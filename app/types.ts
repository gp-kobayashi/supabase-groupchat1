import type { Database } from "@/lib/database.types";

export type Chat = Database["public"]["Tables"]["chats"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Group = Database["public"]["Tables"]["groups"]["Row"];

export type Avatar_url = Profile["avatar_url"];

export type ChatWithAvatar = {
  create_at: Chat["create_at"];
  group_id: Chat["group_id"];
  id: Chat["id"];
  profiles: { avatar_url: Profile["avatar_url"] };
  text: Chat["text"];
  user_id: Chat["user_id"];
  update_at: Chat["update_at"];
};
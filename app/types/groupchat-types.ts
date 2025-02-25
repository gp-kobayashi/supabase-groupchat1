import type { Database } from "@/lib/database.types";

export type Chat = Database["public"]["Tables"]["chats"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Group = Database["public"]["Tables"]["groups"]["Row"];

export type ChatWithAvatar = Chat & { avatar_url: string };

export type JoinGroups = Database["public"]["Tables"]["join_groups"]["Row"] & {
  avatar_url: string;
} & { username: string };

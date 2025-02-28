import type { Database } from "@/lib/database.types";

export type Chat = Database["public"]["Tables"]["chats"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Group = Database["public"]["Tables"]["groups"]["Row"];

export type ChatWithAvatar = Chat & { avatar_url: string };

export type GroupMember = Database["public"]["Tables"]["group_members"]["Row"];

export type MemberProfile = GroupMember & { avatar_url: string } & {
  username: string;
};

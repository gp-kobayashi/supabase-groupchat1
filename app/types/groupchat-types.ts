import type { Database } from "@/lib/database.types";

export type Chat = Database["public"]["Tables"]["chats"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Group = Database["public"]["Tables"]["groups"]["Row"];

export type Avatar_url = Profile["avatar_url"];

export type ChatWithAvatar = Chat & { avatar_url: string } & {
  profiles: { avatar_url: Profile["avatar_url"] };
};

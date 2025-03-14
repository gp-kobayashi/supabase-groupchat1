import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import styles from "./navigation.module.css";
import {
  getAvatarUrl,
  defaultAvatarUrl,
} from "@/app/utils/supabase_function/profile";
import type { Profile } from "@/app/types/groupchat-types";

const Navigation = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;

  if (user) {
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = userProfile;
  }

  let avatarUrl = defaultAvatarUrl;

  if (profile?.avatar_url) {
    avatarUrl = getAvatarUrl(profile.avatar_url);
  }

  return (
    <header className={styles.header}>
      <div className={styles.navi_container}>
        <div>
          <Link className={styles.logo} href="/">
            GropuChat
          </Link>
        </div>
        <div className={styles.navi_links}>
          {user ? (
            <div>
              <Link href="/account">
                <Image src={avatarUrl} alt="avatar" width={50} height={50} />
              </Link>
            </div>
          ) : (
            <div>
              <Link className={styles.navi_Login} href="/login">
                ログイン
              </Link>
              <Link className={styles.navi_signup} href="/login">
                サインアップ
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;

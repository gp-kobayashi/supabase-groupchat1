import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/lib/database.types';
import styles from './navigation.module.css';
import { fetchAvatarPath } from '@/app/utils/supabase_function';

const Navigation = async () => {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    
    type Profile = Database["public"]["Tables"]["profiles"]["Row"];


    let profile: Profile | null = null;

    if(user){
        const{ data: userProfile } = await supabase
            .from('profiles')
            .select("*")
            .eq('id', user.id)
            .single()
        profile = userProfile;
    }
    
    let avatarUrl = "/default.png";

    if(profile?.avatar_url){
    const url = await fetchAvatarPath(profile.avatar_url);
    avatarUrl = url.data.publicUrl;
    }

    console.log(avatarUrl);
    return(
        <header className={styles.header}>
            <div className={styles.navi_container}>
                <div >
                    <Link
                        className={styles.logo}
                        href="/"
                    >
                        GropuChat
                    </Link>
                </div>
                <div className={styles.navi_links}>
                    {user ? (
                        <div>
                            <Link href="/account">
                                <Image
                                    
                                    src={avatarUrl}
                                    alt="avatar"
                                    width={50}
                                    height={50}
                                    
                                />
                            </Link>
                        </div>
                    ) : (
                        <div>
                           <Link href="/login">ログイン</Link>
                           <Link href="/login">サインアップ</Link> 
                        </div>
                            )}
                </div>
            </div>
        </header>
    )
}

export default Navigation;
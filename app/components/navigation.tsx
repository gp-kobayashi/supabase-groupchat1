import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/lib/database.types';
import styles from './navigation.module.css';

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

    return(
        <header>
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
                                    
                                    src={
                                        profile && profile.avatar_url
                                        ? "/" + profile.avatar_url
                                        : "/default.png"
                                    }
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
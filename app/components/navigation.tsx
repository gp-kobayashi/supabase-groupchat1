"use client";

import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers';

const navigation = async () => {
    const supabase = await createClient()
    
    const {
        data: { user },
    } = await supabase.auth.getUser()
    
    let profile = null;

    if(user){
        const{ data: profile } = await supabase
        .from('profiles')
        .select("*")
        .eq('id', user.id)
        .single()
    }


    return(
        <header>
            <div>
                <Link href="/">
                GropuChat
                </Link>
                <div>
                    {user ? (
                        <div>
                            <Link href="/account">
                                <Image
                                    src={
                                        profile && profile.avatar_url
                                        ? profile.avatar_url
                                        : "/default.png"
                                    }
                                    alt="avatar"
                                    fill
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
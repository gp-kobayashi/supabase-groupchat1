"use client"

import Link from "next/link";
import { Session } from "@supabase/supabase-js";
import useStore from "store";
import Image from "next/image";
import { useEffect } from "react";
import type { Database } from "@/lib/database.types";
type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

const Navigation = ({
    session,
    profile,
}: {
    session: Session | null;
    profile: ProfileType | null;
}) => {
    const {setUser} = useStore();

    useEffect(() => {
        if (session) {
            setUser(session.user);
        }
    }, [session]);

    return (
        <header>
            <div>
                <Link href="/">
                group_chat
                </Link>

                <div>
                    {session ? (
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
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
export default Navigation;
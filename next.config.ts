import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error("env.NEXT_PUBLIC_SUPABASE_URLが設定されていません");
}
const url = new URL(supabaseUrl);
const domain = url.hostname;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [domain], 
  },
};

export default nextConfig;

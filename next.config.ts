import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['qdwzilkzjmmecqlfvtbq.supabase.co'], // ここに外部ホストを追加
  },
};

export default nextConfig;

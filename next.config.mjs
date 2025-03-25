/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "snbvbtsglrsipcdjqdqu.supabase.co",
      },
    ],
  },
};

export default nextConfig;

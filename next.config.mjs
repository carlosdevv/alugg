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
      {
        protocol: "https",
        hostname: "assets.dub.co",
      }, // remove this later
    ],
  },
};

export default nextConfig;

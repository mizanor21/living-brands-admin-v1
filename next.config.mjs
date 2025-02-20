/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all hostnames
        pathname: "/**", // Allow all paths
      },
    ],
  },
};

export default nextConfig;

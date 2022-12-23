/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_MAP_API_KEY: process.env.GOOGLE_API_KEY || "",
  },
  reactStrictMode: true,
  // images: {
  //   formats: ["image/avif", "image/webp"],
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "firebasestorage.googleapis.com",
  //       port: "",
  //       pathname: "/image/upload/**",
  //     },
  //   ],
  // },
};

module.exports = nextConfig;

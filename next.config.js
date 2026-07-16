/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/adapter-better-sqlite3", "better-sqlite3", "@prisma/adapter-pg"],
  },
};

module.exports = nextConfig;

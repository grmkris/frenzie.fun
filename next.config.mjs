import './env.mjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'images.unsplash.com'],
  },
  env: {
    mode: process.env.NODE_ENV,
  },
}

export default nextConfig

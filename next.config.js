/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // เพิ่มตัวนี้เพื่อปิด Static Generation อัตโนมัติ
  staticPageGenerationTimeout: 0,
  
  images: {
    domains: ['qyswbwojyhcvecqdotom.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig

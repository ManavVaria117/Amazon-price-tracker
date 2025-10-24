/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: 'https://amazon-price-tracker-api-lmu1.onrender.com'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://amazon-price-tracker-api-lmu1.onrender.com/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.39:8082/api/:path*'
      }
    ]
  }
}

export default nextConfig

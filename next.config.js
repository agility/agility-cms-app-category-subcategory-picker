/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'autoplay=*, encrypted-media=*, fullscreen=*, clipboard-write=*, web-share=*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;


/** @type {import('next').NextConfig} */
// Where the Express API runs. In Docker/Render both run in one container
// (127.0.0.1:4000). On Hostinger the API is a separate Node.js app, so set
// BACKEND_URL (e.g. https://api.inkerrobotics.com) before building.
const BACKEND_URL = (process.env.BACKEND_URL || 'http://127.0.0.1:4000').replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Docker needs the standalone server; Hostinger runs `next start`.
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,

  // gzip/brotli the HTML and JS responses
  compress: true,

  // Tree-shake the barrel files of the animation and 3D packages so a
  // single named import doesn't drag the whole module graph in.
  experimental: {
    optimizePackageImports: ['gsap', '@react-three/drei', 'lucide-react']
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    deviceSizes: [640, 828, 1080, 1200, 1440, 1920],
  },

  compiler: {
    // strip console.* from production bundles, keeping errors
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: '/health',
        destination: `${BACKEND_URL}/health`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/llms.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }]
      },
      // The frame sequence is content-addressed by filename and never
      // changes. Without this every visit re-downloads it; with it, the
      // second visit costs nothing.
      {
        source: '/robot-sequence/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      // Editable artwork — logos, photography, anything replaced in place.
      // `immutable` was wrong here: it tells the browser never to
      // revalidate, so an updated file under the same name is invisible
      // for a year. Revalidate instead; unchanged files still cost only
      // a 304.
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }
        ]
      },
      // Media and fonts that ship with a build and are never edited in
      // place. Deliberately excludes the raster image extensions: this
      // rule is evaluated after the /images one above, so listing png or
      // webp here would re-apply `immutable` to exactly the artwork we
      // just made revalidate.
      {
        source: '/:file*.(mp4|webm|glb|woff2|woff|ttf|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ]
      }
    ];
  }
};

export default nextConfig;

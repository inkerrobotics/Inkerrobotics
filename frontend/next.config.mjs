/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',

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
        destination: 'http://127.0.0.1:4000/api/:path*',
      },
      {
        source: '/health',
        destination: 'http://127.0.0.1:4000/health',
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

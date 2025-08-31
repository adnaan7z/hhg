 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Required for Netlify static export
  output: 'export',

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // ✅ Needed for static export
  },
};

export default nextConfig;

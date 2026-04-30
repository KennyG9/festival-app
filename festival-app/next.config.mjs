/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // This forces Next.js to use unique hashes for all JS/CSS files
  trailingSlash: true,
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Adding this empty object is a specific fix suggested by the error log

};

export default nextConfig;
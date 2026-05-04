/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar TypeScript estricto en build
  typescript: {
    ignoreBuildErrors: false,
  },
  // Habilitar comprobación de ESLint en build
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
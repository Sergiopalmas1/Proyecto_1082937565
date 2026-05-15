/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar TypeScript estricto en build
  typescript: {
    ignoreBuildErrors: false,
  },
  // Excluir paquetes con APIs de Node.js del bundle edge
  serverExternalPackages: ['bcryptjs', 'postgres'],
};

export default nextConfig;
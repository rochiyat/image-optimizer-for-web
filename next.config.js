/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Format yang akan digenerate otomatis oleh Next.js
    formats: ['image/avif', 'image/webp'],
    
    // Device sizes untuk responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    
    // Image sizes untuk different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Minimum cache time (in seconds)
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    
    // Disable static imports for better control
    // Uncomment jika mau lebih strict
    // disableStaticImages: false,
    
    // Domains yang diizinkan (untuk external images)
    domains: [
      'res.cloudinary.com', // Cloudinary untuk user uploads
    ],
    
    // Remote patterns (Next.js 13+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/iqrolife/**',
      },
    ],
  },
  
  // Compression untuk static files
  compress: true,
  
  // Optimization
  swcMinify: true,
  
  // Output configuration
  // output: 'standalone', // Uncomment untuk Docker deployment
}

module.exports = nextConfig

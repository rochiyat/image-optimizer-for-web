/**
 * Centralized Configuration Management
 */
require('dotenv').config();

class ImageConfig {
  static get defaults() {
    return {
      // Directories
      sourceDir: process.env.SOURCE_DIR || './temp-uploads',
      outputDir: process.env.OUTPUT_DIR || './public/images/gallery',
      
      // Optimization settings
      maxSizeKB: parseInt(process.env.MAX_SIZE_KB) || 400,
      quality: parseInt(process.env.QUALITY) || 85,
      maxDimension: parseInt(process.env.MAX_DIMENSION) || 2000,
      
      // Naming strategy: 'original' | 'folder' | 'timestamp'
      namingStrategy: process.env.IMAGE_NAMING_STRATEGY || 'original',
      
      // Processor: 'sharp' | 'cloudinary'
      processor: process.env.IMAGE_PROCESSOR || 'sharp',
      
      // Cloudinary config (if using cloudinary processor)
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        folder: process.env.CLOUDINARY_FOLDER || 'gallery'
      },
      
      // Logging
      logLevel: process.env.LOG_LEVEL || 'info',
      logFile: process.env.LOG_FILE || null,
      
      // Performance
      concurrency: parseInt(process.env.CONCURRENCY) || 3,
      
      // Validation
      allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB) || 50,
      
      // Next.js Image Config
      nextjs: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 7 // 7 days
      }
    };
  }

  static validate(config) {
    const errors = [];

    if (config.maxSizeKB <= 0) {
      errors.push('maxSizeKB must be greater than 0');
    }

    if (config.quality < 1 || config.quality > 100) {
      errors.push('quality must be between 1 and 100');
    }

    if (config.maxDimension <= 0) {
      errors.push('maxDimension must be greater than 0');
    }

    if (!['original', 'folder', 'timestamp'].includes(config.namingStrategy)) {
      errors.push('namingStrategy must be one of: original, folder, timestamp');
    }

    if (!['sharp', 'cloudinary'].includes(config.processor)) {
      errors.push('processor must be one of: sharp, cloudinary');
    }

    if (config.processor === 'cloudinary') {
      if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
        errors.push('Cloudinary credentials are required when using cloudinary processor');
      }
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
    }

    return true;
  }

  static merge(customConfig = {}) {
    const config = {
      ...this.defaults,
      ...customConfig
    };

    this.validate(config);
    return config;
  }
}

module.exports = ImageConfig;

/**
 * Cloudinary Implementation for Image Processing
 * Alternative processor using Cloudinary API
 */
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

class CloudinaryProcessor {
  constructor(config = {}) {
    if (config.cloudName && config.apiKey && config.apiSecret) {
      cloudinary.config({
        cloud_name: config.cloudName,
        api_key: config.apiKey,
        api_secret: config.apiSecret
      });
    }
    
    this.config = config;
  }

  async optimize(inputPath, outputPath, options = {}) {
    try {
      const uploadResult = await cloudinary.uploader.upload(inputPath, {
        folder: options.folder || 'gallery',
        quality: options.quality || 'auto:good',
        fetch_format: 'auto',
        transformation: [
          {
            width: options.maxDimension || 2000,
            height: options.maxDimension || 2000,
            crop: 'limit'
          }
        ]
      });

      // Download optimized image
      const response = await fetch(uploadResult.secure_url);
      const buffer = await response.arrayBuffer();
      await fs.writeFile(outputPath, Buffer.from(buffer));

      const stats = await fs.stat(outputPath);

      return {
        success: true,
        outputPath,
        cloudinaryUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        size: stats.size,
        sizeKB: stats.size / 1024,
        sizeMB: stats.size / 1024 / 1024
      };
    } catch (error) {
      throw new Error(`Cloudinary optimization failed: ${error.message}`);
    }
  }

  async getMetadata(imagePath) {
    try {
      const uploadResult = await cloudinary.uploader.upload(inputPath, {
        resource_type: 'image'
      });

      return {
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes,
        sizeKB: uploadResult.bytes / 1024,
        sizeMB: uploadResult.bytes / 1024 / 1024,
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url
      };
    } catch (error) {
      throw new Error(`Failed to get metadata: ${error.message}`);
    }
  }

  async resize(imagePath, dimensions) {
    throw new Error('Resize not implemented for Cloudinary processor. Use optimize with dimensions.');
  }

  async convert(imagePath, format) {
    throw new Error('Convert not implemented for Cloudinary processor. Use optimize with format option.');
  }

  async compress(imagePath, quality) {
    throw new Error('Compress not implemented for Cloudinary processor. Use optimize with quality option.');
  }
}

module.exports = CloudinaryProcessor;

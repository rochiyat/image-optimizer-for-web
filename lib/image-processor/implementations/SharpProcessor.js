/**
 * Sharp Implementation for Image Processing
 */
const sharp = require('sharp');
const fs = require('fs').promises;

class SharpProcessor {
  constructor(config = {}) {
    this.config = {
      quality: 85,
      progressive: true,
      mozjpeg: true,
      ...config
    };
  }

  async optimize(inputPath, outputPath, options = {}) {
    const mergedOptions = { ...this.config, ...options };
    
    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Apply resize if needed
      if (mergedOptions.maxDimension) {
        const { width, height } = this._calculateResize(
          metadata.width,
          metadata.height,
          mergedOptions.maxDimension
        );
        image.resize(width, height, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      // Apply format conversion
      const format = mergedOptions.format || 'jpeg';
      if (format === 'jpeg' || format === 'jpg') {
        image.jpeg({
          quality: mergedOptions.quality,
          progressive: mergedOptions.progressive,
          mozjpeg: mergedOptions.mozjpeg
        });
      } else if (format === 'png') {
        image.png({
          quality: mergedOptions.quality,
          compressionLevel: 9
        });
      } else if (format === 'webp') {
        image.webp({
          quality: mergedOptions.quality
        });
      }

      await image.toFile(outputPath);

      const stats = await fs.stat(outputPath);
      return {
        success: true,
        outputPath,
        size: stats.size,
        sizeKB: stats.size / 1024,
        sizeMB: stats.size / 1024 / 1024
      };
    } catch (error) {
      throw new Error(`Sharp optimization failed: ${error.message}`);
    }
  }

  async getMetadata(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      const stats = await fs.stat(imagePath);
      
      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: stats.size,
        sizeKB: stats.size / 1024,
        sizeMB: stats.size / 1024 / 1024,
        hasAlpha: metadata.hasAlpha,
        orientation: metadata.orientation
      };
    } catch (error) {
      throw new Error(`Failed to get metadata: ${error.message}`);
    }
  }

  async resize(imagePath, dimensions) {
    const { width, height, fit = 'inside' } = dimensions;
    
    try {
      const buffer = await sharp(imagePath)
        .resize(width, height, {
          fit,
          withoutEnlargement: true
        })
        .toBuffer();
      
      return buffer;
    } catch (error) {
      throw new Error(`Resize failed: ${error.message}`);
    }
  }

  async convert(imagePath, format) {
    try {
      const buffer = await sharp(imagePath)
        .toFormat(format)
        .toBuffer();
      
      return buffer;
    } catch (error) {
      throw new Error(`Format conversion failed: ${error.message}`);
    }
  }

  async compress(imagePath, quality) {
    try {
      const metadata = await sharp(imagePath).metadata();
      const format = metadata.format;

      let image = sharp(imagePath);

      if (format === 'jpeg' || format === 'jpg') {
        image = image.jpeg({ quality, progressive: true, mozjpeg: true });
      } else if (format === 'png') {
        image = image.png({ quality, compressionLevel: 9 });
      } else if (format === 'webp') {
        image = image.webp({ quality });
      }

      const buffer = await image.toBuffer();
      return buffer;
    } catch (error) {
      throw new Error(`Compression failed: ${error.message}`);
    }
  }

  _calculateResize(originalWidth, originalHeight, maxDimension) {
    if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
      return { width: originalWidth, height: originalHeight };
    }

    if (originalWidth > originalHeight) {
      return {
        width: maxDimension,
        height: Math.round((originalHeight / originalWidth) * maxDimension)
      };
    } else {
      return {
        width: Math.round((originalWidth / originalHeight) * maxDimension),
        height: maxDimension
      };
    }
  }
}

module.exports = SharpProcessor;

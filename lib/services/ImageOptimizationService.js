/**
 * Image Optimization Service
 * High-level service for image optimization operations
 */
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const Logger = require('../utils/Logger');
const ImageProcessorBridge = require('../image-processor/ImageProcessorBridge');

class ImageOptimizationService {
  constructor(processor, config = {}) {
    this.bridge = new ImageProcessorBridge(processor);
    this.config = config;
    this.logger = new Logger('ImageOptimizationService');
  }

  async optimizeBatch(sourceDir, outputDir, options = {}) {
    this.logger.info(`Starting batch optimization from ${sourceDir}`);
    
    try {
      await this._ensureDirectories(sourceDir, outputDir);
      
      const images = await this._findImages(sourceDir);
      
      if (images.length === 0) {
        this.logger.warn(`No images found in ${sourceDir}`);
        return { success: false, message: 'No images found', results: [] };
      }

      this.logger.info(`Found ${images.length} image(s) to process`);

      const results = [];
      const folderCounters = {};

      for (const imagePath of images) {
        try {
          const result = await this._optimizeSingleImage(
            imagePath,
            sourceDir,
            outputDir,
            options,
            folderCounters
          );
          results.push(result);
        } catch (error) {
          this.logger.error(`Failed to optimize ${imagePath}: ${error.message}`);
          results.push({
            success: false,
            inputPath: imagePath,
            error: error.message
          });
        }
      }

      const summary = this._generateSummary(results);
      this.logger.info('Batch optimization completed', summary);

      return {
        success: true,
        results,
        summary
      };
    } catch (error) {
      this.logger.error(`Batch optimization failed: ${error.message}`);
      throw error;
    }
  }

  async optimizeSingle(inputPath, outputPath, options = {}) {
    this.logger.info(`Optimizing single image: ${inputPath}`);
    
    try {
      const metadata = await this.bridge.getMetadata(inputPath);
      this.logger.debug('Image metadata', metadata);

      const quality = await this._findOptimalQuality(
        inputPath,
        options.targetSizeKB || this.config.maxSizeKB || 400
      );

      const optimizeOptions = {
        quality,
        maxDimension: options.maxDimension || this.config.maxDimension || 2000,
        format: options.format || 'jpeg',
        ...options
      };

      const result = await this.bridge.optimize(inputPath, outputPath, optimizeOptions);

      const savedPercent = ((1 - result.sizeMB / metadata.sizeMB) * 100).toFixed(0);

      this.logger.info(`Optimization complete: ${savedPercent}% saved`);

      return {
        success: true,
        inputPath,
        outputPath,
        originalSize: metadata,
        optimizedSize: result,
        quality,
        savedPercent: parseFloat(savedPercent)
      };
    } catch (error) {
      this.logger.error(`Single optimization failed: ${error.message}`);
      throw error;
    }
  }

  async _optimizeSingleImage(imagePath, sourceDir, outputDir, options, folderCounters) {
    const relativePath = path.relative(sourceDir, imagePath);
    const outputPath = this._generateOutputPath(
      relativePath,
      sourceDir,
      outputDir,
      options.namingStrategy || 'original',
      folderCounters
    );

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    return this.optimizeSingle(imagePath, outputPath, options);
  }

  async _findOptimalQuality(inputPath, targetSizeKB) {
    let quality = 90;
    let lowQuality = 60;
    let highQuality = 95;
    let attempts = 0;
    const maxAttempts = 8;

    while (attempts < maxAttempts && (highQuality - lowQuality) > 5) {
      quality = Math.floor((lowQuality + highQuality) / 2);

      const buffer = await this.bridge.compress(inputPath, quality);
      const outputSizeKB = buffer.length / 1024;

      if (outputSizeKB > targetSizeKB) {
        highQuality = quality;
      } else {
        lowQuality = quality;
      }

      attempts++;
    }

    return Math.max(lowQuality, 70); // Minimum quality 70
  }

  async _findImages(sourceDir) {
    const patterns = [
      `${sourceDir}/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}`
    ];

    let allImages = [];
    for (const pattern of patterns) {
      const images = await glob(pattern);
      allImages = allImages.concat(images);
    }

    return allImages;
  }

  async _ensureDirectories(...dirs) {
    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  _generateOutputPath(relativePath, sourceDir, outputDir, namingStrategy, folderCounters) {
    if (namingStrategy === 'folder') {
      const folderName = path.dirname(relativePath);
      const baseFolderName = folderName === '.' ? 'image' : path.basename(folderName);

      if (!folderCounters[folderName]) {
        folderCounters[folderName] = 1;
      }

      const counter = String(folderCounters[folderName]).padStart(3, '0');
      const newFileName = `${baseFolderName}-${counter}.jpg`;
      folderCounters[folderName]++;

      return path.join(outputDir, folderName, newFileName);
    } else {
      return path.join(outputDir, relativePath).replace(/\.(png|PNG)$/i, '.jpg');
    }
  }

  _generateSummary(results) {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (successful.length === 0) {
      return {
        total: results.length,
        successful: 0,
        failed: failed.length,
        totalSaved: 0
      };
    }

    const totalOriginalKB = successful.reduce((sum, r) => sum + r.originalSize.sizeKB, 0);
    const totalOptimizedKB = successful.reduce((sum, r) => sum + r.optimizedSize.sizeKB, 0);
    const totalSavedPercent = ((1 - totalOptimizedKB / totalOriginalKB) * 100).toFixed(0);

    return {
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      totalOriginalMB: (totalOriginalKB / 1024).toFixed(2),
      totalOptimizedMB: (totalOptimizedKB / 1024).toFixed(2),
      totalSavedPercent: parseFloat(totalSavedPercent)
    };
  }
}

module.exports = ImageOptimizationService;

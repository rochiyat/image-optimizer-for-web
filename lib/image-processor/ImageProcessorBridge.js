/**
 * Bridge Pattern Implementation for Image Processing
 * Allows switching between different image processing implementations
 */

class ImageProcessorBridge {
  constructor(implementation) {
    this.implementation = implementation;
  }

  async optimize(inputPath, outputPath, options) {
    return this.implementation.optimize(inputPath, outputPath, options);
  }

  async getMetadata(imagePath) {
    return this.implementation.getMetadata(imagePath);
  }

  async resize(imagePath, dimensions) {
    return this.implementation.resize(imagePath, dimensions);
  }

  async convert(imagePath, format) {
    return this.implementation.convert(imagePath, format);
  }

  async compress(imagePath, quality) {
    return this.implementation.compress(imagePath, quality);
  }
}

module.exports = ImageProcessorBridge;

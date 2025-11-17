/**
 * Factory Pattern for Image Processor Creation
 */
const SharpProcessor = require('../image-processor/implementations/SharpProcessor');
const CloudinaryProcessor = require('../image-processor/implementations/CloudinaryProcessor');

class ProcessorFactory {
  static create(type, config = {}) {
    switch (type.toLowerCase()) {
      case 'sharp':
        return new SharpProcessor(config);
      
      case 'cloudinary':
        return new CloudinaryProcessor(config);
      
      default:
        throw new Error(`Unknown processor type: ${type}. Available: sharp, cloudinary`);
    }
  }

  static createFromConfig(config) {
    const processorType = config.processor || 'sharp';
    const processorConfig = processorType === 'cloudinary' 
      ? config.cloudinary 
      : config;
    
    return this.create(processorType, processorConfig);
  }
}

module.exports = ProcessorFactory;

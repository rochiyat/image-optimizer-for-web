/**
 * Unit Tests for SharpProcessor
 */
const SharpProcessor = require('../../lib/image-processor/implementations/SharpProcessor');
const fs = require('fs').promises;
const path = require('path');

describe('SharpProcessor', () => {
  let processor;
  const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');
  const outputPath = path.join(__dirname, '../output/optimized.jpg');

  beforeEach(() => {
    processor = new SharpProcessor({
      quality: 85,
      progressive: true,
      mozjpeg: true
    });
  });

  afterEach(async () => {
    // Cleanup
    try {
      await fs.unlink(outputPath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  describe('optimize', () => {
    it('should optimize an image successfully', async () => {
      const result = await processor.optimize(testImagePath, outputPath, {
        quality: 80,
        maxDimension: 1000
      });

      expect(result.success).toBe(true);
      expect(result.outputPath).toBe(outputPath);
      expect(result.sizeKB).toBeGreaterThan(0);
    });

    it('should throw error for invalid input path', async () => {
      await expect(
        processor.optimize('invalid-path.jpg', outputPath)
      ).rejects.toThrow();
    });
  });

  describe('getMetadata', () => {
    it('should return image metadata', async () => {
      const metadata = await processor.getMetadata(testImagePath);

      expect(metadata).toHaveProperty('width');
      expect(metadata).toHaveProperty('height');
      expect(metadata).toHaveProperty('format');
      expect(metadata).toHaveProperty('sizeKB');
    });
  });

  describe('_calculateResize', () => {
    it('should calculate resize dimensions correctly', () => {
      const result = processor._calculateResize(4000, 3000, 2000);
      
      expect(result.width).toBe(2000);
      expect(result.height).toBe(1500);
    });

    it('should not resize if image is smaller than max', () => {
      const result = processor._calculateResize(1000, 800, 2000);
      
      expect(result.width).toBe(1000);
      expect(result.height).toBe(800);
    });
  });
});

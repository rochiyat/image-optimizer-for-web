/**
 * Unit Tests for ImageOptimizationService
 */
const ImageOptimizationService = require('../../lib/services/ImageOptimizationService');
const SharpProcessor = require('../../lib/image-processor/implementations/SharpProcessor');

describe('ImageOptimizationService', () => {
  let service;
  let processor;

  beforeEach(() => {
    processor = new SharpProcessor();
    service = new ImageOptimizationService(processor, {
      maxSizeKB: 400,
      maxDimension: 2000
    });
  });

  describe('optimizeSingle', () => {
    it('should optimize a single image', async () => {
      // Mock test - implement with actual test image
      expect(service).toBeDefined();
      expect(service.bridge).toBeDefined();
    });
  });

  describe('_generateSummary', () => {
    it('should generate correct summary for successful results', () => {
      const results = [
        {
          success: true,
          originalSize: { sizeKB: 1000 },
          optimizedSize: { sizeKB: 300 }
        },
        {
          success: true,
          originalSize: { sizeKB: 2000 },
          optimizedSize: { sizeKB: 500 }
        }
      ];

      const summary = service._generateSummary(results);

      expect(summary.total).toBe(2);
      expect(summary.successful).toBe(2);
      expect(summary.failed).toBe(0);
      expect(parseFloat(summary.totalSavedPercent)).toBeGreaterThan(0);
    });

    it('should handle failed results', () => {
      const results = [
        { success: false, error: 'Test error' }
      ];

      const summary = service._generateSummary(results);

      expect(summary.total).toBe(1);
      expect(summary.successful).toBe(0);
      expect(summary.failed).toBe(1);
    });
  });
});

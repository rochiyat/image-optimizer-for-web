/**
 * Integration Tests for Complete Optimization Workflow
 */
const ImageConfig = require('../../lib/config/ImageConfig');
const ProcessorFactory = require('../../lib/factories/ProcessorFactory');
const ImageOptimizationService = require('../../lib/services/ImageOptimizationService');
const fs = require('fs').promises;
const path = require('path');

describe('Optimization Workflow Integration', () => {
  const testSourceDir = path.join(__dirname, '../fixtures/source');
  const testOutputDir = path.join(__dirname, '../fixtures/output');

  beforeAll(async () => {
    // Setup test directories
    await fs.mkdir(testSourceDir, { recursive: true });
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterAll(async () => {
    // Cleanup test directories
    await fs.rm(testOutputDir, { recursive: true, force: true });
  });

  it('should complete full optimization workflow', async () => {
    // Load configuration
    const config = ImageConfig.merge({
      sourceDir: testSourceDir,
      outputDir: testOutputDir,
      maxSizeKB: 400,
      processor: 'sharp'
    });

    // Create processor
    const processor = ProcessorFactory.createFromConfig(config);
    expect(processor).toBeDefined();

    // Create service
    const service = new ImageOptimizationService(processor, config);
    expect(service).toBeDefined();

    // Note: Actual optimization test requires test images
    // This is a structure test
  });

  it('should validate configuration correctly', () => {
    expect(() => {
      ImageConfig.merge({
        maxSizeKB: -1
      });
    }).toThrow();

    expect(() => {
      ImageConfig.merge({
        quality: 150
      });
    }).toThrow();
  });
});

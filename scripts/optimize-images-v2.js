#!/usr/bin/env node

/**
 * Professional Image Optimization Script v2
 * Using Bridge Pattern and Service Layer Architecture
 */

const ImageConfig = require('../lib/config/ImageConfig');
const ProcessorFactory = require('../lib/factories/ProcessorFactory');
const ImageOptimizationService = require('../lib/services/ImageOptimizationService');
const Logger = require('../lib/utils/Logger');

async function main() {
  const logger = new Logger('OptimizeScript');
  
  try {
    // Load and validate configuration
    const config = ImageConfig.merge();
    logger.debug('Configuration loaded', config);

    // Display banner
    logger.banner('Image Optimizer v2.0 - Professional Edition');

    // Create processor using factory
    const processor = ProcessorFactory.createFromConfig(config);
    logger.info(`Using processor: ${config.processor}`);

    // Create optimization service
    const service = new ImageOptimizationService(processor, config);

    // Run batch optimization
    const result = await service.optimizeBatch(
      config.sourceDir,
      config.outputDir,
      {
        targetSizeKB: config.maxSizeKB,
        maxDimension: config.maxDimension,
        namingStrategy: config.namingStrategy,
        format: 'jpeg'
      }
    );

    if (!result.success) {
      logger.warn(result.message);
      process.exit(0);
    }

    // Display results
    displayResults(result, logger, config);

    logger.success('Optimization completed successfully!');
    process.exit(0);

  } catch (error) {
    logger.error('Optimization failed', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

function displayResults(result, logger, config) {
  const { summary, results } = result;

  console.log('\n' + '═'.repeat(50));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('═'.repeat(50));
  console.log(`Total images processed: ${summary.total}`);
  console.log(`✅ Successful: ${summary.successful}`);
  console.log(`❌ Failed: ${summary.failed}`);
  
  if (summary.successful > 0) {
    console.log(`\n📦 Size Reduction:`);
    console.log(`   Original: ${summary.totalOriginalMB} MB`);
    console.log(`   Optimized: ${summary.totalOptimizedMB} MB`);
    console.log(`   Saved: ${summary.totalSavedPercent}%`);
  }

  console.log(`\n📁 Output directory: ${config.outputDir}`);
  
  console.log('\n💡 Next Steps:');
  console.log('   1. Review optimized images');
  console.log(`   2. git add ${config.outputDir}`);
  console.log('   3. git commit -m "Add optimized gallery images"');
  console.log('   4. npm run images:clean-temp');
  console.log('═'.repeat(50) + '\n');

  // Show warnings for large files
  const largeFiles = results.filter(r => r.success && r.optimizedSize.sizeKB > 500);
  if (largeFiles.length > 0) {
    logger.warn(`${largeFiles.length} file(s) are still larger than 500 KB`);
    largeFiles.forEach(file => {
      logger.warn(`  - ${file.outputPath}: ${file.optimizedSize.sizeKB.toFixed(0)} KB`);
    });
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };

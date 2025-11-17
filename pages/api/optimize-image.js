/**
 * Next.js API Route for On-Demand Image Optimization
 */
import ImageConfig from '../../lib/config/ImageConfig';
import ProcessorFactory from '../../lib/factories/ProcessorFactory';
import ImageOptimizationService from '../../lib/services/ImageOptimizationService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { inputPath, outputPath, options = {} } = req.body;

    if (!inputPath || !outputPath) {
      return res.status(400).json({ 
        error: 'Missing required fields: inputPath, outputPath' 
      });
    }

    // Load configuration
    const config = ImageConfig.merge(options);

    // Create processor and service
    const processor = ProcessorFactory.createFromConfig(config);
    const service = new ImageOptimizationService(processor, config);

    // Optimize single image
    const result = await service.optimizeSingle(inputPath, outputPath, options);

    return res.status(200).json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Optimization error:', error);
    return res.status(500).json({ 
      error: 'Optimization failed',
      message: error.message 
    });
  }
}

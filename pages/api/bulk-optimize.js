/**
 * Next.js API Route for Bulk Image Upload & Optimization
 * Handles up to 10 images at once
 */
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = './temp-uploads';
const OUTPUT_DIR = './public/images/optimized';
const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Optimization function using Sharp
async function optimizeImage(inputPath, outputPath, options = {}) {
  const targetSizeKB = options.targetSizeKB || 400;
  const maxDimension = options.maxDimension || 2000;
  
  // Get original metadata
  const metadata = await sharp(inputPath).metadata();
  
  // Resize if needed
  let pipeline = sharp(inputPath);
  
  if (metadata.width > maxDimension || metadata.height > maxDimension) {
    pipeline = pipeline.resize(maxDimension, maxDimension, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }
  
  // Find optimal quality using binary search
  let quality = 85;
  let lowQuality = 60;
  let highQuality = 95;
  let attempts = 0;
  const maxAttempts = 8;
  
  while (attempts < maxAttempts && (highQuality - lowQuality) > 5) {
    quality = Math.floor((lowQuality + highQuality) / 2);
    
    const testBuffer = await sharp(inputPath)
      .resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    
    const outputSizeKB = testBuffer.length / 1024;
    
    if (outputSizeKB > targetSizeKB) {
      highQuality = quality;
    } else {
      lowQuality = quality;
    }
    
    attempts++;
  }
  
  quality = Math.max(lowQuality, 70); // Minimum quality 70
  
  // Final optimization
  await pipeline
    .jpeg({ quality, mozjpeg: true })
    .toFile(outputPath);
  
  return { quality };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure directories exist
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Parse form data
    const form = formidable({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
      maxFiles: MAX_FILES,
      filter: function ({ mimetype }) {
        return ALLOWED_TYPES.includes(mimetype);
      },
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const uploadedFiles = files.images || [];
    
    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (uploadedFiles.length > MAX_FILES) {
      return res.status(400).json({ 
        error: `Maximum ${MAX_FILES} files allowed`,
        received: uploadedFiles.length 
      });
    }

    // Process each image
    const results = [];
    
    for (const file of uploadedFiles) {
      try {
        // Validate file type
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
          await fs.unlink(file.filepath);
          results.push({
            success: false,
            originalName: file.originalFilename,
            error: 'Invalid file type'
          });
          continue;
        }

        // Generate safe filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const safeName = `${timestamp}-${randomStr}.jpg`;
        const inputPath = file.filepath;
        const outputPath = path.join(OUTPUT_DIR, safeName);

        // Get original file stats
        const originalStats = await fs.stat(inputPath);

        // Optimize image
        await optimizeImage(inputPath, outputPath, {
          targetSizeKB: 400,
          maxDimension: 2000
        });

        // Get optimized file stats
        const optimizedStats = await fs.stat(outputPath);

        // Clean up temp file
        await fs.unlink(inputPath);

        results.push({
          success: true,
          originalName: file.originalFilename,
          fileName: safeName,
          downloadUrl: `/images/optimized/${safeName}`,
          originalSize: originalStats.size,
          optimizedSize: optimizedStats.size,
          savedBytes: originalStats.size - optimizedStats.size,
          savedPercent: Math.round(((originalStats.size - optimizedStats.size) / originalStats.size) * 100)
        });

      } catch (error) {
        console.error(`Error processing ${file.originalFilename}:`, error);
        
        // Clean up temp file if exists
        try {
          await fs.unlink(file.filepath);
        } catch (e) {
          // Ignore cleanup errors
        }
        
        results.push({
          success: false,
          originalName: file.originalFilename,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return res.status(200).json({
      success: true,
      message: `Processed ${successCount} of ${uploadedFiles.length} images`,
      summary: {
        total: uploadedFiles.length,
        success: successCount,
        failed: failCount
      },
      results
    });

  } catch (error) {
    console.error('Bulk optimization error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        error: 'File too large',
        maxSize: `${MAX_FILE_SIZE / 1024 / 1024} MB` 
      });
    }

    return res.status(500).json({ 
      error: 'Bulk optimization failed',
      message: error.message 
    });
  }
}

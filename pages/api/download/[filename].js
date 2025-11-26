/**
 * Download endpoint for optimized images (Vercel serverless)
 * Serves files from /tmp directory
 */
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  // Sanitize filename to prevent directory traversal
  const safeName = path.basename(filename);
  
  // Use /tmp for Vercel, public for local
  const OUTPUT_DIR = process.env.VERCEL ? '/tmp/optimized' : './public/images/optimized';
  const filePath = path.join(OUTPUT_DIR, safeName);

  try {
    // Check if file exists
    await fs.access(filePath);

    // Read file
    const fileBuffer = await fs.readFile(filePath);

    // Set headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    // Send file
    return res.status(200).send(fileBuffer);

  } catch (error) {
    console.error('Download error:', error);
    
    if (error.code === 'ENOENT') {
      return res.status(404).json({ 
        error: 'File not found',
        message: 'The requested file does not exist or has expired'
      });
    }

    return res.status(500).json({ 
      error: 'Download failed',
      message: error.message 
    });
  }
}

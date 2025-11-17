/**
 * Next.js API Route for Image Upload
 * Professional image upload handler with validation
 */
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = './temp-uploads';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Parse form data
    const form = formidable({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
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

    const uploadedFile = files.image?.[0];
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(uploadedFile.mimetype)) {
      await fs.unlink(uploadedFile.filepath);
      return res.status(400).json({ 
        error: 'Invalid file type',
        allowed: ALLOWED_TYPES 
      });
    }

    // Generate safe filename
    const timestamp = Date.now();
    const originalName = uploadedFile.originalFilename || 'image';
    const ext = path.extname(originalName);
    const safeName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const newPath = path.join(UPLOAD_DIR, safeName);

    // Move file to final location
    await fs.rename(uploadedFile.filepath, newPath);

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: safeName,
        originalName: originalName,
        size: uploadedFile.size,
        type: uploadedFile.mimetype,
        path: newPath,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        error: 'File too large',
        maxSize: `${MAX_FILE_SIZE / 1024 / 1024} MB` 
      });
    }

    return res.status(500).json({ 
      error: 'Upload failed',
      message: error.message 
    });
  }
}

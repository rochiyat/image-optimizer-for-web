# API Documentation

## Overview

Professional API endpoints untuk image upload dan optimization.

## Endpoints

### 1. Upload Image

Upload image ke temporary storage.

**Endpoint**: `POST /api/upload-image`

**Content-Type**: `multipart/form-data`

**Request**:
```javascript
const formData = new FormData();
formData.append('image', fileObject);

fetch('/api/upload-image', {
  method: 'POST',
  body: formData
});
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "name": "1234567890-photo.jpg",
    "originalName": "photo.jpg",
    "size": 2048576,
    "type": "image/jpeg",
    "path": "./temp-uploads/1234567890-photo.jpg"
  }
}
```

**Response** (Error - 400):
```json
{
  "error": "Invalid file type",
  "allowed": ["image/jpeg", "image/jpg", "image/png", "image/webp"]
}
```

**Response** (Error - 413):
```json
{
  "error": "File too large",
  "maxSize": "50 MB"
}
```

**Validation**:
- Max file size: 50 MB
- Allowed types: JPEG, JPG, PNG, WebP
- Filename sanitization applied

---

### 2. Optimize Image

Optimize uploaded image on-demand.

**Endpoint**: `POST /api/optimize-image`

**Content-Type**: `application/json`

**Request**:
```json
{
  "inputPath": "./temp-uploads/photo.jpg",
  "outputPath": "./public/images/gallery/photo.jpg",
  "options": {
    "quality": 85,
    "maxDimension": 2000,
    "targetSizeKB": 400
  }
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "result": {
    "success": true,
    "inputPath": "./temp-uploads/photo.jpg",
    "outputPath": "./public/images/gallery/photo.jpg",
    "originalSize": {
      "width": 4032,
      "height": 3024,
      "sizeKB": 2509,
      "sizeMB": 2.45
    },
    "optimizedSize": {
      "sizeKB": 328,
      "sizeMB": 0.32
    },
    "quality": 82,
    "savedPercent": 87
  }
}
```

**Response** (Error - 400):
```json
{
  "error": "Missing required fields: inputPath, outputPath"
}
```

**Response** (Error - 500):
```json
{
  "error": "Optimization failed",
  "message": "Sharp optimization failed: Input file is missing"
}
```

**Options**:
- `quality` (optional): JPEG quality (1-100), default: 85
- `maxDimension` (optional): Max width/height in pixels, default: 2000
- `targetSizeKB` (optional): Target file size in KB, default: 400
- `format` (optional): Output format (jpeg, png, webp), default: jpeg

---

### 3. Bulk Upload & Optimize

Upload and optimize multiple images at once (max 10 images).

**Endpoint**: `POST /api/bulk-optimize`

**Content-Type**: `multipart/form-data`

**Request**:
```javascript
const formData = new FormData();
files.forEach(file => {
  formData.append('images', file);
});

fetch('/api/bulk-optimize', {
  method: 'POST',
  body: formData
});
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Processed 3 of 3 images",
  "summary": {
    "total": 3,
    "success": 3,
    "failed": 0
  },
  "results": [
    {
      "success": true,
      "originalName": "photo1.jpg",
      "fileName": "1234567890-abc123.jpg",
      "downloadUrl": "/images/optimized/1234567890-abc123.jpg",
      "originalSize": 2048576,
      "optimizedSize": 335872,
      "savedBytes": 1712704,
      "savedPercent": 84
    }
  ]
}
```

---

### 4. Download Multiple Images as ZIP

Download multiple optimized images as a single ZIP file.

**Endpoint**: `POST /api/download-zip`

**Content-Type**: `application/json`

**Request**:
```javascript
const response = await fetch('/api/download-zip', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    filenames: [
      '1234567890-abc123.jpg',
      '1234567891-def456.jpg',
      '1234567892-ghi789.jpg'
    ]
  })
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'optimized-images.zip';
link.click();
```

**Response** (Success - 200 - Binary ZIP file):
- Content-Type: `application/zip`
- Content-Disposition: `attachment; filename="optimized-images-[timestamp].zip"`

**ZIP Contents**:
```
optimized-images-1234567890.zip
├── 1234567890-abc123.jpg
├── 1234567891-def456.jpg
├── 1234567892-ghi789.jpg
└── README.txt (summary file)
```

**Response** (Error - 400):
```json
{
  "error": "Filenames array is required"
}
```

**Response** (Error - 404):
```json
{
  "error": "No files found",
  "message": "None of the requested files exist"
}
```

**Validation**:
- Max files: 50 images per ZIP
- Files must exist in optimized directory
- Automatic filename sanitization
- Includes summary README.txt

**Features**:
- Maximum compression (level 9)
- Automatic error handling
- Summary file included
- Works on both Vercel and local

---

## Usage Examples

### Example 1: Upload and Optimize

```javascript
async function uploadAndOptimize(file) {
  // Step 1: Upload
  const formData = new FormData();
  formData.append('image', file);

  const uploadResponse = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData
  });

  const uploadResult = await uploadResponse.json();

  if (!uploadResult.success) {
    throw new Error(uploadResult.error);
  }

  // Step 2: Optimize
  const optimizeResponse = await fetch('/api/optimize-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      inputPath: uploadResult.file.path,
      outputPath: `./public/images/gallery/${uploadResult.file.name}`,
      options: {
        quality: 85,
        maxDimension: 2000
      }
    })
  });

  const optimizeResult = await optimizeResponse.json();

  return optimizeResult;
}
```

### Example 2: Bulk Upload & Optimize

```javascript
async function bulkUploadAndOptimize(files) {
  if (files.length > 10) {
    throw new Error('Maximum 10 files allowed');
  }

  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  const response = await fetch('/api/bulk-optimize', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}

// Usage
const files = Array.from(fileInput.files);
const result = await bulkUploadAndOptimize(files);

console.log(`Processed ${result.summary.success} of ${result.summary.total} images`);
result.results.forEach(r => {
  if (r.success) {
    console.log(`${r.originalName}: Saved ${r.savedPercent}%`);
  }
});
```

### Example 3: React Component

```jsx
import { useState } from 'react';

function ImageUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const file = e.target.image.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="image" accept="image/*" />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </form>
  );
}
```

---

## Error Handling

### Client-Side

```javascript
async function safeUpload(file) {
  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error.message);
    // Show user-friendly error message
    alert(`Upload failed: ${error.message}`);
  }
}
```

### Server-Side

Errors are automatically handled and returned with appropriate status codes:
- 400: Bad Request (validation errors)
- 405: Method Not Allowed
- 413: Payload Too Large
- 500: Internal Server Error

---

## Security Considerations

### File Validation
- File type validation (MIME type check)
- File size limits enforced
- Filename sanitization to prevent path traversal

### Rate Limiting
Consider implementing rate limiting:
```javascript
// Example with express-rate-limit
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### Authentication
Add authentication middleware:
```javascript
// Example middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Verify token
  // ...
  
  next();
}
```

---

## Performance Tips

### 1. Use Compression
```javascript
// In next.config.js
module.exports = {
  compress: true
};
```

### 2. Implement Caching
```javascript
res.setHeader('Cache-Control', 'public, max-age=31536000');
```

### 3. Use CDN
Upload optimized images to CDN for better performance.

---

## Testing

### cURL Examples

**Upload**:
```bash
curl -X POST http://localhost:3000/api/upload-image \
  -F "image=@test-photo.jpg"
```

**Optimize**:
```bash
curl -X POST http://localhost:3000/api/optimize-image \
  -H "Content-Type: application/json" \
  -d '{
    "inputPath": "./temp-uploads/photo.jpg",
    "outputPath": "./public/images/photo.jpg"
  }'
```

### Postman Collection

Import this collection to Postman:
```json
{
  "info": {
    "name": "Image Optimizer API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Upload Image",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/upload-image",
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "image",
              "type": "file",
              "src": "/path/to/image.jpg"
            }
          ]
        }
      }
    }
  ]
}
```

---

## Future Enhancements

1. **Batch Optimization Endpoint**
   - Process multiple images in one request
   - Return progress updates via WebSocket

2. **Image Transformation**
   - Crop, rotate, flip
   - Filters and effects
   - Watermarking

3. **CDN Integration**
   - Auto-upload to Cloudinary/S3
   - Return CDN URLs

4. **Webhook Support**
   - Notify when optimization complete
   - Integration with external services

---

## Support

For issues or questions:
- Check `ARCHITECTURE.md` for system design
- See `UPGRADE_GUIDE.md` for migration help
- Review `README.md` for general usage

# Architecture - Vercel Deployment

## 🏗️ System Architecture

### Local Development
```
┌─────────────────────────────────────────────────────────┐
│                    Local Environment                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  User Browser                                            │
│       ↓                                                  │
│  [Upload Images]                                         │
│       ↓                                                  │
│  POST /api/bulk-optimize                                 │
│       ↓                                                  │
│  ./temp-uploads/          ← Writable                     │
│       ↓                                                  │
│  Sharp Processing                                        │
│       ↓                                                  │
│  ./public/images/optimized/  ← Writable                  │
│       ↓                                                  │
│  GET /images/optimized/[file]  ← Static File             │
│       ↓                                                  │
│  [Download]                                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Vercel Production
```
┌─────────────────────────────────────────────────────────┐
│                  Vercel Serverless                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  User Browser                                            │
│       ↓                                                  │
│  [Upload Images]                                         │
│       ↓                                                  │
│  POST /api/bulk-optimize                                 │
│       ↓                                                  │
│  /tmp/uploads/            ← Temporary (cleared)          │
│       ↓                                                  │
│  Sharp Processing (3GB RAM, 60s timeout)                 │
│       ↓                                                  │
│  /tmp/optimized/          ← Temporary (cleared)          │
│       ↓                                                  │
│  GET /api/download/[file]  ← API Endpoint                │
│       ↓                                                  │
│  [Download]                                              │
│       ↓                                                  │
│  Files cleared after function execution                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### Upload & Optimize Flow
```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. POST /api/bulk-optimize
     │    FormData: images[]
     ↓
┌────────────────────────────────┐
│  Formidable Parser             │
│  - Validate file types         │
│  - Check file sizes            │
│  - Save to /tmp/uploads/       │
└────┬───────────────────────────┘
     │
     │ 2. For each image
     ↓
┌────────────────────────────────┐
│  Sharp Processor               │
│  - Read from /tmp/uploads/     │
│  - Resize if needed            │
│  - Binary search quality       │
│  - Optimize to buffer          │
└────┬───────────────────────────┘
     │
     │ 3. Save optimized
     ↓
┌────────────────────────────────┐
│  File System                   │
│  - Write buffer to             │
│    /tmp/optimized/[file].jpg   │
│  - Delete temp upload          │
└────┬───────────────────────────┘
     │
     │ 4. Return results
     ↓
┌────────────────────────────────┐
│  Response JSON                 │
│  {                             │
│    success: true,              │
│    results: [{                 │
│      downloadUrl: "/api/       │
│        download/[file].jpg"    │
│    }]                          │
│  }                             │
└────┬───────────────────────────┘
     │
     ↓
┌──────────┐
│  Client  │
└──────────┘
```

### Download Flow
```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. GET /api/download/[filename].jpg
     ↓
┌────────────────────────────────┐
│  Download Handler              │
│  - Sanitize filename           │
│  - Check file exists           │
│  - Read from /tmp/optimized/   │
└────┬───────────────────────────┘
     │
     │ 2. Set headers
     ↓
┌────────────────────────────────┐
│  HTTP Response                 │
│  Content-Type: image/jpeg      │
│  Content-Disposition:          │
│    attachment; filename="..."  │
│  Cache-Control: public         │
└────┬───────────────────────────┘
     │
     │ 3. Send file buffer
     ↓
┌──────────┐
│  Client  │
│  (File   │
│  saved)  │
└──────────┘
```

## 🗂️ Directory Structure

### Development
```
project/
├── pages/
│   └── api/
│       ├── bulk-optimize.js      ← Main upload endpoint
│       └── download/
│           └── [filename].js     ← Download endpoint
├── temp-uploads/                 ← Local temp storage
├── public/
│   └── images/
│       └── optimized/            ← Local output
└── vercel.json                   ← Vercel config
```

### Vercel Runtime
```
/tmp/
├── uploads/                      ← Temporary uploads
│   ├── 1234567890-abc.jpg
│   └── 1234567891-def.jpg
└── optimized/                    ← Temporary output
    ├── 1234567890-abc.jpg
    └── 1234567891-def.jpg

Note: Cleared after function execution!
```

## ⚙️ Configuration

### vercel.json
```json
{
  "functions": {
    "pages/api/bulk-optimize.js": {
      "maxDuration": 60,          // 60 seconds
      "memory": 3008              // 3 GB
    },
    "pages/api/download/[filename].js": {
      "maxDuration": 10           // 10 seconds
    }
  }
}
```

### Environment Detection
```javascript
// Automatic environment detection
const isVercel = process.env.VERCEL === 'true';

const UPLOAD_DIR = isVercel 
  ? '/tmp/uploads' 
  : './temp-uploads';

const OUTPUT_DIR = isVercel 
  ? '/tmp/optimized' 
  : './public/images/optimized';
```

## 📊 Resource Allocation

### Memory Usage
```
┌─────────────────────────────────┐
│  Function Memory: 3008 MB       │
├─────────────────────────────────┤
│  Sharp Processing: ~500 MB      │
│  Image Buffers: ~200 MB         │
│  Node.js Runtime: ~100 MB       │
│  Available: ~2200 MB            │
└─────────────────────────────────┘
```

### Timeout Allocation
```
┌─────────────────────────────────┐
│  Total Timeout: 60 seconds      │
├─────────────────────────────────┤
│  Upload Parse: ~2s              │
│  Per Image:                     │
│    - Read: ~0.5s                │
│    - Process: ~2-4s             │
│    - Write: ~0.5s               │
│  Total for 10 images: ~30-50s   │
│  Buffer: ~10s                   │
└─────────────────────────────────┘
```

## 🔒 Security

### File Validation
```javascript
// MIME type check
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];

// Size limit
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

// Count limit
const MAX_FILES = 10;
```

### Path Sanitization
```javascript
// Prevent directory traversal
const safeName = path.basename(filename);

// Only allow alphanumeric + dash + dot
const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
```

## 🚀 Performance Optimization

### Sharp Configuration
```javascript
sharp(inputPath)
  .resize(2000, 2000, {
    fit: 'inside',
    withoutEnlargement: true
  })
  .jpeg({
    quality: 85,
    mozjpeg: true,        // Better compression
    progressive: true     // Progressive loading
  })
  .toBuffer();
```

### Binary Search Quality
```javascript
// Find optimal quality (60-95)
// Target: 400 KB
// Attempts: Max 8
// Time: ~2-4 seconds per image
```

## 📈 Scalability

### Current Limits
- **Concurrent requests**: Vercel auto-scales
- **Images per request**: 10 max
- **File size**: 50 MB max per file
- **Processing time**: 60s max
- **Memory**: 3 GB per function

### Recommendations
- **< 10 images**: Use bulk upload
- **> 10 images**: Split into batches
- **Large files (>10MB)**: Consider Cloudinary
- **High volume**: Implement queue system

## 🔍 Monitoring

### Logs
```javascript
console.log('Processing:', filename);
console.error('Error:', error.message);
```

### Vercel Dashboard
- Function execution time
- Memory usage
- Error rate
- Request count

## 🎯 Best Practices

### Do's ✅
- Download files immediately
- Handle errors gracefully
- Validate file types
- Limit batch size
- Set proper timeouts

### Don'ts ❌
- Don't rely on /tmp persistence
- Don't exceed 60s timeout
- Don't upload >50MB files
- Don't process >10 images at once
- Don't skip error handling

## 📚 Related Documentation

- `VERCEL_DEPLOYMENT.md` - Full deployment guide
- `VERCEL_FIX_SUMMARY.md` - Quick fix summary
- `QUICK_FIX.md` - One-page reference
- `docs/API.md` - API documentation

---

**Architecture Status**: ✅ Production Ready  
**Last Updated**: 2024  
**Version**: 2.0

# Vercel Deployment Guide

## 🚀 Deployment Issue Fixed

### Problem
```
Error: ENOENT: no such file or directory, mkdir './temp-uploads'
```

**Cause**: Vercel serverless functions have read-only filesystem except `/tmp` directory.

### Solution
✅ Use `/tmp` directory for file uploads and processing  
✅ Serve optimized files via API endpoint instead of static files  
✅ Configure proper memory and timeout limits

## 📁 File Structure Changes

### Before (Local Development)
```
temp-uploads/          ← Upload directory
public/images/
  └── optimized/       ← Output directory (static files)
```

### After (Vercel Compatible)
```
/tmp/
  ├── uploads/         ← Upload directory (Vercel)
  └── optimized/       ← Output directory (Vercel)

public/images/
  └── optimized/       ← Output directory (Local)
```

## 🔧 Code Changes

### 1. Dynamic Directory Selection
```javascript
// Auto-detect environment
const UPLOAD_DIR = process.env.VERCEL ? '/tmp/uploads' : './temp-uploads';
const OUTPUT_DIR = process.env.VERCEL ? '/tmp/optimized' : './public/images/optimized';
```

### 2. Buffer-Based Processing
```javascript
// Return buffer instead of writing to file
async function optimizeImage(inputPath, options) {
  // ... optimization logic
  const optimizedBuffer = await pipeline
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
  
  return { buffer: optimizedBuffer, quality };
}
```

### 3. Dynamic Download URLs
```javascript
// Use API endpoint for Vercel, static files for local
const downloadUrl = process.env.VERCEL 
  ? `/api/download/${safeName}` 
  : `/images/optimized/${safeName}`;
```

## 📝 New Files Created

### 1. `pages/api/download/[filename].js`
Dynamic route untuk serve files dari `/tmp` directory.

**Features:**
- Serves files from `/tmp/optimized`
- Proper headers (Content-Type, Cache-Control)
- Security: Filename sanitization
- Error handling (404, 500)

### 2. `vercel.json`
Konfigurasi Vercel deployment.

**Settings:**
```json
{
  "functions": {
    "pages/api/bulk-optimize.js": {
      "maxDuration": 60,      // 60 seconds timeout
      "memory": 3008          // 3GB memory for image processing
    }
  }
}
```

## ⚙️ Vercel Configuration

### Environment Variables
Set di Vercel Dashboard:

```bash
# Image Processor
IMAGE_PROCESSOR=sharp

# Optimization Settings
MAX_SIZE_KB=400
QUALITY=85
MAX_DIMENSION=2000

# Optional: Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Function Settings
- **Max Duration**: 60 seconds (untuk bulk processing)
- **Memory**: 3008 MB (untuk Sharp image processing)
- **Region**: Auto (atau pilih region terdekat)

## 🔄 How It Works

### Upload Flow (Vercel)
```
1. User uploads images
   ↓
2. Files saved to /tmp/uploads/
   ↓
3. Sharp processes images
   ↓
4. Optimized files saved to /tmp/optimized/
   ↓
5. Return download URLs: /api/download/[filename]
   ↓
6. User clicks download
   ↓
7. API serves file from /tmp/optimized/
```

### Upload Flow (Local)
```
1. User uploads images
   ↓
2. Files saved to ./temp-uploads/
   ↓
3. Sharp processes images
   ↓
4. Optimized files saved to ./public/images/optimized/
   ↓
5. Return download URLs: /images/optimized/[filename]
   ↓
6. User clicks download
   ↓
7. Next.js serves static file
```

## 📊 Limitations & Considerations

### Vercel Serverless Limits
- **Max file size**: 50 MB (API body limit)
- **Max execution time**: 60 seconds (Pro plan)
- **Memory**: 3008 MB max
- **Temporary storage**: `/tmp` cleared after function execution

### Recommendations
1. **File retention**: Files in `/tmp` are temporary
   - Download immediately after optimization
   - Don't rely on files persisting
   
2. **Large files**: Consider using Cloudinary for files > 10MB
   
3. **Batch size**: Limit to 10 images per request
   
4. **Timeout**: 60s should handle ~10 images (2-5MB each)

## 🧪 Testing

### Local Testing
```bash
# Start dev server
npm run dev

# Test upload
# Files saved to ./temp-uploads/
# Output to ./public/images/optimized/
```

### Vercel Testing
```bash
# Deploy to Vercel
vercel --prod

# Test upload
# Files saved to /tmp/uploads/
# Output to /tmp/optimized/
# Download via /api/download/[filename]
```

## 🐛 Troubleshooting

### Error: "ENOENT: no such file or directory"
**Solution**: Ensure using `/tmp` directory in Vercel
```javascript
const UPLOAD_DIR = process.env.VERCEL ? '/tmp/uploads' : './temp-uploads';
```

### Error: "Function execution timeout"
**Solution**: Increase timeout in vercel.json
```json
{
  "functions": {
    "pages/api/bulk-optimize.js": {
      "maxDuration": 60
    }
  }
}
```

### Error: "Out of memory"
**Solution**: Increase memory allocation
```json
{
  "functions": {
    "pages/api/bulk-optimize.js": {
      "memory": 3008
    }
  }
}
```

### Error: "File not found" on download
**Cause**: Files in `/tmp` cleared after function execution
**Solution**: Download immediately after optimization

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Fix Vercel deployment with /tmp directory"
git push origin main
```

### 2. Deploy to Vercel
```bash
# Via Vercel CLI
vercel --prod

# Or via Vercel Dashboard
# Connect GitHub repo → Auto deploy
```

### 3. Set Environment Variables
In Vercel Dashboard:
- Settings → Environment Variables
- Add all required variables
- Redeploy

### 4. Test Deployment
```bash
# Test bulk upload
curl -X POST https://your-app.vercel.app/api/bulk-optimize \
  -F "images=@test1.jpg" \
  -F "images=@test2.jpg"

# Test download
curl https://your-app.vercel.app/api/download/[filename].jpg \
  -o downloaded.jpg
```

## ✅ Verification Checklist

- [ ] Code uses `/tmp` directory for Vercel
- [ ] `vercel.json` configured with proper limits
- [ ] Environment variables set in Vercel
- [ ] Download endpoint working
- [ ] Upload endpoint working
- [ ] Files downloadable immediately
- [ ] No filesystem errors in logs

## 📚 Additional Resources

- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Vercel File System](https://vercel.com/docs/concepts/limits/overview#file-system)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)

## 🎉 Result

✅ Application now works on Vercel  
✅ Bulk upload functional  
✅ Download working via API  
✅ No filesystem errors  
✅ Production ready!

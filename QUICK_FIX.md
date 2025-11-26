# Quick Fix - Vercel Deployment Error

## Error
```
{"error": "Bulk optimization failed","message": "ENOENT: no such file or directory, mkdir './temp-uploads'"}
```

## Solution
✅ **Fixed!** Code now uses `/tmp` directory for Vercel.

## What Changed

### 1. File: `pages/api/bulk-optimize.js`
```javascript
// Auto-detect environment
const UPLOAD_DIR = process.env.VERCEL ? '/tmp/uploads' : './temp-uploads';
const OUTPUT_DIR = process.env.VERCEL ? '/tmp/optimized' : './public/images/optimized';
```

### 2. New File: `pages/api/download/[filename].js`
Serves files from `/tmp` directory via API endpoint.

### 3. New File: `vercel.json`
```json
{
  "functions": {
    "pages/api/bulk-optimize.js": {
      "maxDuration": 60,
      "memory": 3008
    }
  }
}
```

## Deploy Now

```bash
git add .
git commit -m "Fix Vercel deployment"
git push origin main
```

Vercel will auto-deploy! ✅

## Test

```bash
# Upload test
curl -X POST https://image-optimizer.rochiyat.my.id/api/bulk-optimize \
  -F "images=@test.jpg"

# Should return success with download URL
```

## Important

⚠️ Files in `/tmp` are temporary - download immediately after optimization!

---

**Status**: ✅ Ready to deploy  
**Docs**: See `VERCEL_DEPLOYMENT.md` for details

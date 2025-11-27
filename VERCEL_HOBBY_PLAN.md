# Vercel Hobby Plan Configuration

## 🎯 Overview

Aplikasi ini sudah dikonfigurasi untuk **Vercel Hobby Plan** dengan limits yang sesuai.

## 📊 Hobby Plan Limits

### Function Limits
| Resource | Hobby Plan | Pro Plan |
|----------|------------|----------|
| Memory | **2048 MB max** | 3008 MB max |
| Duration | **10 seconds** | 60 seconds |
| Deployments | Unlimited | Unlimited |
| Bandwidth | 100 GB/month | 1 TB/month |

### Our Configuration
```json
{
  "functions": {
    "pages/api/bulk-optimize.js": {
      "maxDuration": 60,    // ⚠️ Requires Pro for >10s
      "memory": 1024        // ✅ Within Hobby limit
    },
    "pages/api/download-zip.js": {
      "maxDuration": 30,    // ⚠️ Requires Pro for >10s
      "memory": 512         // ✅ Within Hobby limit
    }
  }
}
```

## ⚠️ Important Notes

### 1. Duration Limit
**Hobby Plan**: 10 seconds max  
**Our Config**: 60 seconds (requires Pro plan)

**Options:**
- **Option A**: Upgrade to Pro plan ($20/month)
- **Option B**: Reduce processing (max 3-5 images instead of 10)
- **Option C**: Use Cloudinary for heavy processing

### 2. Memory Limit
**Hobby Plan**: 2048 MB max per function  
**Our Config**: 1024 MB ✅

**Why 1024 MB?**
- Leaves headroom for spikes
- Sufficient for Sharp processing
- Processes 5-10 images comfortably

## 🔧 Optimization for Hobby Plan

### Reduce Processing Time

#### Option 1: Limit Images
```javascript
// In pages/api/bulk-optimize.js
const MAX_FILES = 5; // Reduced from 10
```

#### Option 2: Reduce Quality Iterations
```javascript
// In optimizeImage function
const maxAttempts = 4; // Reduced from 8
```

#### Option 3: Skip Binary Search
```javascript
// Use fixed quality instead of binary search
const quality = 80; // Fixed quality
```

### Reduce Memory Usage

#### Option 1: Lower Max Dimension
```javascript
const maxDimension = 1500; // Reduced from 2000
```

#### Option 2: Process Sequentially
```javascript
// Process one at a time instead of parallel
for (const file of uploadedFiles) {
  await processImage(file);
}
```

## 📈 Performance Expectations

### With Hobby Plan (1024 MB)
- **1-3 images**: ~5-8 seconds ✅
- **4-6 images**: ~10-15 seconds ⚠️ (may timeout)
- **7-10 images**: ~20-30 seconds ❌ (will timeout)

### Recommendations
1. **Limit to 5 images** for reliable processing
2. **Use lower quality** (75-80) for faster processing
3. **Consider Pro plan** for production use

## 🚀 Upgrade to Pro Plan

### Benefits
- ✅ 60 second timeout (vs 10s)
- ✅ 3008 MB memory (vs 2048 MB)
- ✅ Process 10+ images reliably
- ✅ Better performance
- ✅ Priority support

### Cost
- **$20/month** per member
- **$40/month** for team (2+ members)

### How to Upgrade
1. Go to Vercel Dashboard
2. Settings → Billing
3. Click "Upgrade to Pro"
4. Update `vercel.json` memory to 3008 MB

## 🔄 Alternative Solutions

### 1. Use Cloudinary (Recommended)
```javascript
// Set in .env
IMAGE_PROCESSOR=cloudinary
```

**Benefits:**
- Processing happens on Cloudinary servers
- No timeout issues
- No memory issues
- Free tier: 25 credits/month

### 2. Split into Batches
```javascript
// Frontend splits into batches of 3
const batches = chunkArray(files, 3);
for (const batch of batches) {
  await uploadBatch(batch);
}
```

### 3. Use Queue System
- Upload to queue (Redis/SQS)
- Process asynchronously
- Notify when complete

## 📝 Current Configuration

### vercel.json
```json
{
  "functions": {
    "pages/api/bulk-optimize.js": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

### Recommended for Hobby Plan
```json
{
  "functions": {
    "pages/api/bulk-optimize.js": {
      "maxDuration": 10,    // Changed to 10s
      "memory": 1024
    }
  }
}
```

## ⚡ Quick Fix for Hobby Plan

### Step 1: Update vercel.json
```json
{
  "functions": {
    "pages/api/bulk-optimize.js": {
      "maxDuration": 10,
      "memory": 1024
    }
  }
}
```

### Step 2: Reduce MAX_FILES
```javascript
// pages/api/bulk-optimize.js
const MAX_FILES = 3; // Reduced from 10
```

### Step 3: Add Frontend Warning
```javascript
// pages/index.jsx
if (selectedFiles.length > 3) {
  setError('Maximum 3 gambar (Hobby plan limit)');
  return;
}
```

## 🎯 Decision Matrix

### Stay on Hobby Plan
**Choose if:**
- ✅ Processing < 5 images at a time
- ✅ Budget conscious
- ✅ Low traffic
- ✅ Personal project

**Limitations:**
- ⚠️ 10 second timeout
- ⚠️ May need to reduce features

### Upgrade to Pro Plan
**Choose if:**
- ✅ Processing 10+ images
- ✅ Production application
- ✅ High traffic
- ✅ Need reliability

**Benefits:**
- ✅ 60 second timeout
- ✅ More memory
- ✅ Better performance

## 📊 Cost Comparison

### Hobby Plan (Free)
- **Cost**: $0/month
- **Memory**: 1024 MB (configured)
- **Duration**: 10 seconds
- **Images**: 3-5 per batch

### Pro Plan ($20/month)
- **Cost**: $20/month
- **Memory**: 3008 MB (can configure)
- **Duration**: 60 seconds
- **Images**: 10+ per batch

### Cloudinary (Free Tier)
- **Cost**: $0/month (25 credits)
- **Memory**: N/A (cloud processing)
- **Duration**: N/A (async)
- **Images**: Unlimited (within credits)

## 🔍 Monitoring

### Check Function Usage
1. Vercel Dashboard → Analytics
2. View function execution time
3. Check memory usage
4. Monitor timeout errors

### Warning Signs
- ⚠️ Frequent timeouts
- ⚠️ Memory errors
- ⚠️ Slow processing
- ⚠️ User complaints

## ✅ Recommended Setup

### For Hobby Plan
```javascript
// Configuration
MAX_FILES = 3
MAX_DIMENSION = 1500
QUALITY = 80
TIMEOUT = 10 seconds
MEMORY = 1024 MB
```

### For Pro Plan
```javascript
// Configuration
MAX_FILES = 10
MAX_DIMENSION = 2000
QUALITY = 85
TIMEOUT = 60 seconds
MEMORY = 3008 MB
```

## 🎉 Summary

**Current Status:**
- ✅ Memory: 1024 MB (within Hobby limit)
- ⚠️ Duration: 60s (requires Pro plan)
- ✅ Works for 3-5 images
- ⚠️ May timeout for 10 images

**Recommendation:**
1. **Short term**: Reduce MAX_FILES to 5
2. **Long term**: Upgrade to Pro plan or use Cloudinary

---

**Plan**: Hobby (Free)  
**Memory**: 1024 MB ✅  
**Duration**: 60s ⚠️ (requires Pro)  
**Status**: Functional with limitations

# Upgrade Guide - Professional Edition

## Overview

Proyek ini telah di-upgrade dengan arsitektur profesional menggunakan Bridge Pattern dan Service Layer. Berikut panduan untuk migrasi dari versi lama ke versi baru.

## What's New

### 1. Bridge Pattern Architecture
- Abstraksi untuk berbagai image processors
- Mudah menambah processor baru (Sharp, Cloudinary, dll)
- Testable dan maintainable

### 2. Service Layer
- Business logic terpisah dari implementation
- Reusable services
- Better error handling

### 3. Professional Logging
- Structured logging dengan level (debug, info, warn, error)
- Colored console output
- File logging support

### 4. Centralized Configuration
- Environment variables support
- Configuration validation
- Easy to customize

### 5. API Routes
- Next.js API untuk upload images
- On-demand optimization endpoint
- RESTful design

### 6. Testing Infrastructure
- Unit tests
- Integration tests
- Jest configuration

## Migration Steps

### Step 1: Install New Dependencies

```bash
npm install cloudinary formidable jest @types/jest --save-dev
```

### Step 2: Update Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```bash
IMAGE_PROCESSOR=sharp
MAX_SIZE_KB=400
QUALITY=85
MAX_DIMENSION=2000
IMAGE_NAMING_STRATEGY=original
LOG_LEVEL=info
```

### Step 3: Choose Your Migration Path

#### Option A: Keep Using Old Script (Recommended for Gradual Migration)

```bash
# Continue using old script
npm run images:optimize

# Try new script when ready
npm run images:optimize:v2
```

#### Option B: Switch to New Script Immediately

Update `package.json`:
```json
"scripts": {
  "images:optimize": "node scripts/optimize-images-v2.js"
}
```

### Step 4: Test New Features

#### Test Professional Script
```bash
npm run images:optimize:v2
```

#### Test API Endpoints (if using Next.js)

1. Start dev server:
```bash
npm run dev
```

2. Test upload endpoint:
```bash
curl -X POST http://localhost:3000/api/upload-image \
  -F "image=@test-photo.jpg"
```

3. Test optimization endpoint:
```bash
curl -X POST http://localhost:3000/api/optimize-image \
  -H "Content-Type: application/json" \
  -d '{
    "inputPath": "./temp-uploads/photo.jpg",
    "outputPath": "./public/images/photo.jpg"
  }'
```

## Feature Comparison

| Feature | Old Version | New Version |
|---------|-------------|-------------|
| Architecture | Monolithic script | Service Layer + Bridge Pattern |
| Processors | Sharp only | Sharp + Cloudinary (extensible) |
| Configuration | Hardcoded | Environment variables + validation |
| Logging | Console.log | Professional Logger with levels |
| Error Handling | Basic try-catch | Centralized ErrorHandler |
| Testing | None | Unit + Integration tests |
| API Support | None | Next.js API routes |
| Extensibility | Limited | Easy to extend |

## Using New Features

### 1. Programmatic Usage

```javascript
const ImageConfig = require('./lib/config/ImageConfig');
const ProcessorFactory = require('./lib/factories/ProcessorFactory');
const ImageOptimizationService = require('./lib/services/ImageOptimizationService');

// Load configuration
const config = ImageConfig.merge({
  processor: 'sharp',
  maxSizeKB: 400
});

// Create processor
const processor = ProcessorFactory.createFromConfig(config);

// Create service
const service = new ImageOptimizationService(processor, config);

// Optimize batch
const result = await service.optimizeBatch(
  './temp-uploads',
  './public/images/gallery'
);

console.log(result.summary);
```

### 2. Using Cloudinary Processor

Update `.env`:
```bash
IMAGE_PROCESSOR=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

Run optimization:
```bash
npm run images:optimize:v2
```

### 3. Custom Configuration

```javascript
const config = ImageConfig.merge({
  processor: 'sharp',
  maxSizeKB: 300,        // More aggressive compression
  quality: 80,           // Lower quality
  maxDimension: 1600,    // Smaller max size
  namingStrategy: 'folder'
});
```

## Breaking Changes

### None!

Versi baru fully backward compatible. Script lama (`optimize-images.js`) tetap berfungsi.

## Recommended Workflow

### For New Projects
1. Use new script: `npm run images:optimize:v2`
2. Configure via `.env` file
3. Use API routes for dynamic uploads

### For Existing Projects
1. Keep using old script initially
2. Test new script in parallel
3. Gradually migrate when comfortable
4. Update to new script when ready

## Testing

### Run Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Add Your Own Tests

Create test file in `tests/unit/`:
```javascript
const ImageOptimizationService = require('../../lib/services/ImageOptimizationService');

describe('My Custom Tests', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

## Troubleshooting

### Issue: "Cannot find module"
```bash
# Reinstall dependencies
npm install
```

### Issue: "Cloudinary credentials missing"
```bash
# Make sure .env is configured
cat .env

# Or use sharp processor instead
IMAGE_PROCESSOR=sharp
```

### Issue: Tests failing
```bash
# Make sure test fixtures exist
mkdir -p tests/fixtures/source
mkdir -p tests/fixtures/output
```

## Performance Tips

### 1. Use Concurrency
```bash
CONCURRENCY=5  # Process 5 images in parallel
```

### 2. Adjust Quality Settings
```bash
# For faster processing
QUALITY=75
MAX_SIZE_KB=300
```

### 3. Use Cloudinary for Large Scale
```bash
IMAGE_PROCESSOR=cloudinary
```

## Next Steps

1. ✅ Read `ARCHITECTURE.md` untuk memahami design patterns
2. ✅ Explore API routes di `pages/api/`
3. ✅ Customize configuration di `.env`
4. ✅ Add custom processors jika diperlukan
5. ✅ Write tests untuk custom logic

## Support

- Architecture docs: `ARCHITECTURE.md`
- API documentation: `pages/api/README.md` (create if needed)
- Original guide: `README.md`
- Quick reference: `QUICKREF.md`

## Feedback

Jika ada masalah atau saran improvement, silakan buat issue atau pull request.

---

**Happy optimizing with professional architecture! 🚀**

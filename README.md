# Image Optimizer - Professional Edition

> Enterprise-grade image optimization system dengan Bridge Pattern architecture untuk web komunitas Next.js

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/your-repo)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)

## 🎯 Overview

Professional image optimization system yang dibangun dengan clean architecture principles, featuring **Bridge Pattern** untuk flexible processor abstraction dan **Service Layer** untuk separation of concerns.

## ✨ Key Features

### Core Architecture
- 🌉 **Bridge Pattern** - Flexible abstraction untuk berbagai image processors
- 🏗️ **Service Layer** - Clean separation of business logic
- 🏭 **Factory Pattern** - Dynamic processor creation
- 💉 **Dependency Injection** - Loosely coupled components

### Optimization Features
- ✅ **Smart Quality Adjustment** - Binary search algorithm untuk optimal quality
- ✅ **Multi-Processor Support** - Sharp (local) & Cloudinary (cloud)
- ✅ **Batch Processing** - Process multiple images efficiently
- ✅ **Bulk Upload** - Upload hingga 10 gambar sekaligus dengan download hasil
- ✅ **Auto Resize** - Intelligent dimension optimization (max 2000px)
- ✅ **Format Conversion** - PNG → JPG, WebP, AVIF
- ✅ **Progressive JPEG** - MozJPEG compression
- ✅ **Statistics & Monitoring** - Comprehensive analytics

### Professional Features
- 📊 **Professional Logging** - Structured logging dengan multiple levels
- 🔧 **Centralized Config** - Environment-based configuration
- 🧪 **Testing Ready** - Unit & integration tests included
- 🔌 **RESTful API** - Upload & optimization endpoints
- 🎨 **Modern UI** - Drag-and-drop upload interface dengan dark theme
- ⚡ **Custom Branding** - Professional logo & favicon dengan gradient design
- 📱 **PWA Ready** - Installable sebagai Progressive Web App
- 📚 **Comprehensive Docs** - Architecture & API documentation

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone <your-repo>
cd image-optimizer

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

### Web Interface

1. Open browser → **http://localhost:3000**
2. Upload images → `/admin/upload`
3. View gallery → `/gallery`
4. Read docs → `/docs`

### CLI Usage

```bash
# Add images to temp-uploads/
cp ~/Downloads/*.jpg temp-uploads/

# Run professional optimization
npm run images:optimize:v2

# Check statistics
npm run images:stats
```

## 🏗️ Architecture

### Bridge Pattern Implementation

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  (CLI Scripts, Next.js API Routes, React Components)    │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                     Service Layer                        │
│         (ImageOptimizationService, Business Logic)       │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                      Bridge Layer                        │
│              (ImageProcessorBridge - Abstraction)        │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────────────────┐                 ┌────────────────────┐
│  SharpProcessor   │                 │ CloudinaryProcessor│
│  (Local)          │                 │   (Cloud + CDN)    │
└───────────────────┘                 └────────────────────┘
```

### Project Structure

```
project/
├── lib/                                    # Core library
│   ├── config/
│   │   └── ImageConfig.js                 # Configuration management
│   ├── factories/
│   │   └── ProcessorFactory.js            # Factory pattern
│   ├── image-processor/
│   │   ├── ImageProcessorBridge.js        # Bridge abstraction
│   │   └── implementations/
│   │       ├── SharpProcessor.js          # Sharp implementation
│   │       └── CloudinaryProcessor.js     # Cloudinary implementation
│   ├── services/
│   │   └── ImageOptimizationService.js    # Business logic
│   └── utils/
│       ├── Logger.js                      # Professional logger
│       └── ErrorHandler.js                # Error handling
│
├── scripts/
│   ├── optimize-images.js                 # Legacy script
│   └── optimize-images-v2.js              # Professional script
│
├── pages/
│   ├── index.jsx                          # Homepage
│   ├── gallery.jsx                        # Gallery page
│   ├── docs.jsx                           # Documentation
│   └── api/
│       ├── upload-image.js                # Upload endpoint
│       └── optimize-image.js              # Optimization endpoint
│
├── components/
│   ├── Gallery.jsx                        # Gallery components
│   └── admin/
│       └── ImageUploader.jsx              # Upload UI
│
├── tests/
│   ├── unit/                              # Unit tests
│   └── integration/                       # Integration tests
│
├── temp-uploads/                          # Original images (gitignored)
├── public/images/gallery/                 # Optimized images
│
├── ARCHITECTURE.md                        # Architecture documentation
├── UPGRADE_GUIDE.md                       # Migration guide
└── README_PROFESSIONAL.md                 # Professional edition docs
```

## 🎯 Usage

### Option 1: Web Interface (Recommended)

#### A. Bulk Upload di Landing Page (NEW! ✨)

```bash
# Start server
npm run dev

# Open browser
http://localhost:3000

# Drag & drop hingga 10 gambar atau klik "Choose Files"
# Klik "Start Optimization"
# Download hasil individual atau semua sekaligus
# Done! ✨
```

**Fitur:**
- 🎨 **Modern dark theme** dengan animated gradients
- 🖱️ **Drag & drop** upload area
- 📤 Upload hingga 10 gambar sekaligus
- 📊 Preview ukuran original vs optimized
- 💾 Persentase penghematan per gambar
- 📥 Download individual atau **bulk download as ZIP**
- 📦 ZIP includes summary file (README.txt)
- ✨ Smooth animations dan transitions
- 🎯 Glass morphism design
- Support: JPG, PNG, WebP (auto-convert ke JPEG)

Lihat panduan lengkap: [`BULK_UPLOAD_GUIDE.md`](BULK_UPLOAD_GUIDE.md)  
Design details: [`DESIGN_UPDATES.md`](DESIGN_UPDATES.md)

#### B. Admin Upload (Single Image)

```bash
# Open browser
http://localhost:3000/admin/upload

# Drag & drop single image
# Click "Upload" button
# Done! ✨
```

### Option 2: CLI - Professional Script

```bash
# Add images
cp ~/Downloads/*.jpg temp-uploads/

# Run optimization with Bridge Pattern
npm run images:optimize:v2

# Output:
# ╔═══════════════════════════════════════╗
# ║   Image Optimizer v2.0 - Professional ║
# ╚═══════════════════════════════════════╝
#
# Using processor: sharp
# Found 5 image(s) to optimize
#
# 📸 Processing: event-photo-1.jpg
#    Original: 2.45 MB (2509 KB)
#    Dimensions: 4032x3024
#    Resizing to: 2000x1500
#    Finding optimal quality...
#    ✓ Optimized: 0.32 MB (328 KB)
#    Quality: 82%
#    Saved: 87%
#    ✅ Perfect for repo!
```

### Option 3: Programmatic Usage

```javascript
const ImageConfig = require('./lib/config/ImageConfig');
const ProcessorFactory = require('./lib/factories/ProcessorFactory');
const ImageOptimizationService = require('./lib/services/ImageOptimizationService');

// Configure
const config = ImageConfig.merge({
  processor: 'sharp',  // or 'cloudinary'
  maxSizeKB: 400,
  quality: 85
});

// Create service with Bridge Pattern
const processor = ProcessorFactory.createFromConfig(config);
const service = new ImageOptimizationService(processor, config);

// Optimize batch
const result = await service.optimizeBatch(
  './temp-uploads',
  './public/images/gallery'
);

console.log(`Processed: ${result.summary.successful} images`);
console.log(`Saved: ${result.summary.totalSavedPercent}%`);
```

### Option 4: API Endpoints

```javascript
// Upload image
const formData = new FormData();
formData.append('image', fileObject);

const uploadResponse = await fetch('/api/upload-image', {
  method: 'POST',
  body: formData
});

// Optimize image
const optimizeResponse = await fetch('/api/optimize-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    inputPath: './temp-uploads/photo.jpg',
    outputPath: './public/images/photo.jpg',
    options: { quality: 85, maxDimension: 2000 }
  })
});
```

### 3. Check Results

```bash
# Check statistics
npm run images:stats

# Check files > 500 KB
npm run images:check-large

# Check largest 20 files
npm run images:check
```

### 4. Commit ke Repo

```bash
# Add optimized images
git add public/images/gallery/

# Commit
git commit -m "Add event photos for Nov 2024 (optimized)"

# Push
git push
```

### 5. Clean Temp Files

```bash
# Clean temp-uploads setelah commit
npm run images:clean-temp
```

## 🖼️ Usage di Component

### Basic Usage

```jsx
import Image from 'next/image';

export default function Gallery() {
  return (
    <div>
      <Image
        src="/images/gallery/2024-11-event/photo-01.jpg"
        alt="Event talkshow parenting"
        width={800}
        height={600}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQ..." // Optional
      />
    </div>
  );
}
```

### Gallery Grid Component

```jsx
import Image from 'next/image';

const photos = [
  { src: '/images/gallery/2024-11-event/photo-01.jpg', alt: 'Talkshow parenting' },
  { src: '/images/gallery/2024-11-event/photo-02.jpg', alt: 'Diskusi ayah' },
  { src: '/images/gallery/2024-11-event/photo-03.jpg', alt: 'Workshop FBE' },
];

export default function PhotoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}
```

### Responsive Images

```jsx
<Image
  src="/images/gallery/2024-11-event/photo-01.jpg"
  alt="Event photo"
  width={1200}
  height={800}
  sizes="(max-width: 640px) 100vw, 
         (max-width: 1024px) 50vw, 
         33vw"
  priority // Untuk above-the-fold images
/>
```

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# Processor Selection: 'sharp' or 'cloudinary'
IMAGE_PROCESSOR=sharp

# Optimization Settings
MAX_SIZE_KB=400
QUALITY=85
MAX_DIMENSION=2000

# Naming Strategy: 'original', 'folder', or 'timestamp'
IMAGE_NAMING_STRATEGY=original

# Cloudinary (if using cloudinary processor)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Logging
LOG_LEVEL=info                    # debug, info, warn, error
LOG_FILE=./logs/optimization.log

# Performance
CONCURRENCY=3                     # Parallel processing
```

### Processor Selection

#### Sharp (Local Processing)
```bash
IMAGE_PROCESSOR=sharp
```
- ✅ Fast local processing
- ✅ No API calls
- ✅ Full control
- ✅ Free

#### Cloudinary (Cloud + CDN)
```bash
IMAGE_PROCESSOR=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```
- ✅ Cloud processing
- ✅ CDN delivery
- ✅ Advanced transformations
- ✅ Automatic format selection

### Programmatic Configuration

```javascript
const config = ImageConfig.merge({
  processor: 'sharp',
  maxSizeKB: 400,
  quality: 85,
  maxDimension: 2000,
  namingStrategy: 'original',
  sourceDir: './temp-uploads',
  outputDir: './public/images/gallery'
});
```

### Next.js Image Settings

Edit `next.config.js`:

```javascript
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
}
```

## 📊 Size Guidelines

| Size | Status | Recommendation |
|------|--------|----------------|
| < 200 KB | ✅ Excellent | Perfect! |
| 200-400 KB | ✅ Good | Acceptable |
| 400-500 KB | ⚠️ OK | Monitor closely |
| > 500 KB | ❌ Too Large | Re-optimize with lower quality |

## 🎨 Naming Convention

### Format

```
{YYYY-MM}-{event-name}/photo-{number}.jpg
```

### Examples

```
✅ Good:
- 2024-11-talkshow-parenting/photo-01.jpg
- 2024-11-talkshow-parenting/photo-02.jpg
- 2024-10-workshop-fbe/hero.jpg
- 2024-10-workshop-fbe/thumbnail.jpg

❌ Bad:
- IMG_1234.jpg
- photo.jpg
- new-image-final-v2.jpg
- DSC_0001.jpg
```

## 🔍 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run images:optimize` | Legacy optimization script |
| `npm run images:optimize:v2` | **Professional script with Bridge Pattern** |
| `npm run images:stats` | Show detailed statistics |
| `npm run images:check` | List 20 largest files |
| `npm run images:check-large` | Find files > 500 KB |
| `npm run images:clean-temp` | Delete temp-uploads content |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |

## 🚀 Deployment

### Vercel (Recommended)

Application sudah dikonfigurasi untuk Vercel deployment dengan serverless functions.

**Quick Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Features:**
- ✅ Automatic `/tmp` directory handling
- ✅ Optimized memory (1GB) for Hobby plan compatibility
- ✅ 60s timeout for bulk uploads (requires Pro plan)
- ✅ Dynamic download endpoint
- ✅ Environment variables support

**Important Notes:**
- Files in `/tmp` are temporary (download immediately)
- Set environment variables in Vercel Dashboard
- **Hobby Plan**: Max 3-5 images recommended (10s timeout)
- **Pro Plan**: Max 10 images (60s timeout)
- See `VERCEL_HOBBY_PLAN.md` for optimization tips

Lihat panduan lengkap: [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md)

### Other Platforms

For other platforms (AWS, Google Cloud, etc.), ensure:
- Writable `/tmp` directory
- Sufficient memory (3GB+) for Sharp
- Timeout > 60 seconds for bulk processing

## 💡 Tips & Best Practices

### 1. Organize by Event

```bash
temp-uploads/
├── 2024-11-talkshow-parenting/
│   ├── photo-01.jpg
│   └── photo-02.jpg
└── 2024-12-workshop-ayah/
    └── photo-01.jpg
```

### 2. Check Before Commit

```bash
# Always check stats before committing
npm run images:stats

# Make sure no files > 500 KB
npm run images:check-large
```

### 3. Batch Processing

```bash
# Process multiple events at once
cp -r ~/Downloads/event-nov-2024/* temp-uploads/2024-11-event/
cp -r ~/Downloads/event-dec-2024/* temp-uploads/2024-12-event/
npm run images:optimize
```

### 4. Quality vs Size

Jika gambar masih terlalu besar setelah optimize, edit CONFIG:

```javascript
// Untuk compression lebih aggressive
maxSizeKB: 300,  // Reduce from 400
quality: 80,     // Reduce from 85
```

### 5. Monitor Repo Size

```bash
# Check total repo size
du -sh .git/

# If > 500 MB, consider:
# 1. Move old events to Cloudinary
# 2. Git LFS for large files
# 3. Separate image repo
```

## 🚨 Troubleshooting

### Error: "No images found"

```bash
# Make sure images are in temp-uploads/
ls -la temp-uploads/

# Check file extensions (case-sensitive on Linux)
```

### Error: "sharp not installed"

```bash
# Reinstall sharp
npm install sharp --save-dev

# On some systems, may need:
npm rebuild sharp
```

### Images still too large

```javascript
// Adjust config for more aggressive compression
const CONFIG = {
  maxSizeKB: 250,     // Lower target
  quality: 75,        // Lower quality
  maxDimension: 1600, // Smaller dimension
};
```

### Git repo too large

```bash
# Check current size
du -sh .git/

# If needed, use git LFS
git lfs install
git lfs track "*.jpg"
git lfs track "*.png"
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/
│   ├── SharpProcessor.test.js
│   ├── ImageOptimizationService.test.js
│   └── ImageConfig.test.js
└── integration/
    └── optimization-workflow.test.js
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README_PROFESSIONAL.md](README_PROFESSIONAL.md) | Complete professional edition guide |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture & design patterns |
| [API.md](docs/API.md) | API endpoints documentation |
| [UPGRADE_GUIDE.md](UPGRADE_GUIDE.md) | Migration guide from v1 to v2 |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [QUICKREF.md](QUICKREF.md) | Quick reference cheat sheet |

## 🎨 Design Patterns

### 1. Bridge Pattern
Decouples abstraction (ImageProcessorBridge) from implementation (SharpProcessor, CloudinaryProcessor), allowing them to vary independently.

### 2. Factory Pattern
ProcessorFactory creates appropriate processor based on configuration without exposing creation logic.

### 3. Service Layer
ImageOptimizationService encapsulates business logic, providing high-level operations.

### 4. Dependency Injection
Components receive dependencies through constructor, enabling loose coupling and easy testing.

## 🚀 Extending

### Add Custom Processor

```javascript
// lib/image-processor/implementations/CustomProcessor.js
class CustomProcessor {
  async optimize(inputPath, outputPath, options) {
    // Your implementation
  }
  
  async getMetadata(imagePath) {
    // Your implementation
  }
  
  // ... other methods
}

// Register in ProcessorFactory
case 'custom':
  return new CustomProcessor(config);
```

### Add Custom Service

```javascript
// lib/services/ImageAnalysisService.js
class ImageAnalysisService {
  constructor(bridge, config) {
    this.bridge = bridge;
    this.config = config;
  }
  
  async analyzeQuality(imagePath) {
    const metadata = await this.bridge.getMetadata(imagePath);
    // Analysis logic
    return analysis;
  }
}
```

## 🔒 Security

- ✅ Input validation for file paths
- ✅ File type validation (MIME type check)
- ✅ Size limits enforced
- ✅ Filename sanitization
- ✅ API authentication ready

## 📊 Performance

- **Concurrency**: Process multiple images in parallel
- **Binary Search**: Optimal quality finding algorithm
- **Streaming**: Memory-efficient processing
- **Caching**: Metadata caching (future enhancement)

## 🆚 Version Comparison

| Feature | v1.0 | v2.0 Professional |
|---------|------|-------------------|
| Architecture | Monolithic | Service Layer + Bridge |
| Processors | Sharp only | Sharp + Cloudinary |
| Configuration | Hardcoded | Environment-based |
| Logging | Basic | Professional |
| Error Handling | Basic | Centralized |
| API Support | ❌ | ✅ |
| Testing | ❌ | ✅ |
| Web UI | ❌ | ✅ |
| Documentation | Basic | Comprehensive |
| Extensibility | Limited | High |

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Add tests for new features
4. Update documentation
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Credits

Built with:
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [Cloudinary](https://cloudinary.com/) - Cloud image management
- [Next.js](https://nextjs.org/) - React framework
- [Jest](https://jestjs.io/) - Testing framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## 📞 Support

- 📖 Read [ARCHITECTURE.md](ARCHITECTURE.md) for design details
- 🔌 Check [API.md](docs/API.md) for API usage
- ⬆️ See [UPGRADE_GUIDE.md](UPGRADE_GUIDE.md) for migration
- 💬 Open an issue for questions or bugs

---

**Professional Edition v2.0 - Built with ❤️ for production use**

[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-black)](https://nextjs.org/)
[![Powered by Sharp](https://img.shields.io/badge/Powered%20by-Sharp-green)](https://sharp.pixelplumbing.com/)
[![Bridge Pattern](https://img.shields.io/badge/Pattern-Bridge-blue)](ARCHITECTURE.md)

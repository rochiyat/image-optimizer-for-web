# Image Optimizer - Professional Edition

> Enterprise-grade image optimization system with Bridge Pattern architecture, service layer design, and comprehensive API support.

## 🎯 Features

### Core Features
- ✅ **Bridge Pattern Architecture** - Flexible processor abstraction
- ✅ **Multiple Processors** - Sharp (local) & Cloudinary (cloud)
- ✅ **Service Layer** - Clean separation of concerns
- ✅ **Professional Logging** - Structured logging with levels
- ✅ **Centralized Config** - Environment-based configuration
- ✅ **Error Handling** - Robust error management
- ✅ **API Routes** - RESTful endpoints for upload & optimization
- ✅ **Testing Suite** - Unit & integration tests
- ✅ **TypeScript Ready** - Easy migration path

### Optimization Features
- ✅ Smart quality adjustment (binary search algorithm)
- ✅ Auto-resize large images
- ✅ Format conversion (PNG → JPG, WebP, AVIF)
- ✅ Progressive JPEG with MozJPEG
- ✅ Batch processing
- ✅ Statistics & monitoring

## 📦 Installation

```bash
# Clone repository
git clone <your-repo>
cd image-optimizer

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env with your configuration
nano .env
```

## 🚀 Quick Start

### 1. Basic Usage (CLI)

```bash
# Add images to temp-uploads/
cp ~/Downloads/*.jpg temp-uploads/

# Run optimization
npm run images:optimize:v2

# Check results
npm run images:stats
```

### 2. Programmatic Usage

```javascript
const ImageConfig = require('./lib/config/ImageConfig');
const ProcessorFactory = require('./lib/factories/ProcessorFactory');
const ImageOptimizationService = require('./lib/services/ImageOptimizationService');

// Configure
const config = ImageConfig.merge({
  processor: 'sharp',
  maxSizeKB: 400
});

// Create service
const processor = ProcessorFactory.createFromConfig(config);
const service = new ImageOptimizationService(processor, config);

// Optimize
const result = await service.optimizeBatch(
  './temp-uploads',
  './public/images/gallery'
);

console.log(result.summary);
```

### 3. API Usage

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
    outputPath: './public/images/photo.jpg'
  })
});
```

## 📁 Project Structure

```
project/
├── lib/                              # Core library
│   ├── config/
│   │   └── ImageConfig.js           # Configuration management
│   ├── factories/
│   │   └── ProcessorFactory.js      # Processor factory
│   ├── image-processor/
│   │   ├── ImageProcessorBridge.js  # Bridge abstraction
│   │   └── implementations/
│   │       ├── SharpProcessor.js    # Sharp implementation
│   │       └── CloudinaryProcessor.js
│   ├── services/
│   │   └── ImageOptimizationService.js
│   └── utils/
│       ├── Logger.js                # Professional logger
│       └── ErrorHandler.js          # Error handling
├── scripts/
│   ├── optimize-images.js           # Legacy script
│   └── optimize-images-v2.js        # New professional script
├── pages/api/
│   ├── upload-image.js              # Upload endpoint
│   └── optimize-image.js            # Optimization endpoint
├── components/
│   ├── Gallery.jsx                  # Gallery components
│   └── admin/
│       └── ImageUploader.jsx        # Upload UI
├── tests/
│   ├── unit/                        # Unit tests
│   └── integration/                 # Integration tests
└── docs/
    ├── ARCHITECTURE.md              # Architecture guide
    ├── API.md                       # API documentation
    └── UPGRADE_GUIDE.md             # Migration guide
```

## ⚙️ Configuration

### Environment Variables

```bash
# Processor: 'sharp' or 'cloudinary'
IMAGE_PROCESSOR=sharp

# Optimization
MAX_SIZE_KB=400
QUALITY=85
MAX_DIMENSION=2000

# Naming: 'original', 'folder', 'timestamp'
IMAGE_NAMING_STRATEGY=original

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/optimization.log
```

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

## 🎨 Usage Examples

### Example 1: Batch Optimization

```javascript
const service = new ImageOptimizationService(processor, config);

const result = await service.optimizeBatch(
  './temp-uploads',
  './public/images/gallery',
  {
    targetSizeKB: 400,
    maxDimension: 2000,
    namingStrategy: 'folder'
  }
);

console.log(`Processed: ${result.summary.successful} images`);
console.log(`Saved: ${result.summary.totalSavedPercent}%`);
```

### Example 2: Single Image

```javascript
const result = await service.optimizeSingle(
  './temp-uploads/photo.jpg',
  './public/images/photo.jpg',
  { quality: 85, maxDimension: 2000 }
);

console.log(`Optimized: ${result.savedPercent}% saved`);
```

### Example 3: Using Cloudinary

```javascript
const config = ImageConfig.merge({
  processor: 'cloudinary',
  cloudinary: {
    cloudName: 'your-cloud',
    apiKey: 'your-key',
    apiSecret: 'your-secret'
  }
});

const processor = ProcessorFactory.createFromConfig(config);
const service = new ImageOptimizationService(processor, config);

const result = await service.optimizeSingle(
  './temp-uploads/photo.jpg',
  './public/images/photo.jpg'
);

console.log(`Cloudinary URL: ${result.cloudinaryUrl}`);
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

### Writing Tests

```javascript
// tests/unit/MyService.test.js
const MyService = require('../../lib/services/MyService');

describe('MyService', () => {
  it('should do something', () => {
    const service = new MyService();
    expect(service).toBeDefined();
  });
});
```

## 📊 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run images:optimize` | Legacy optimization script |
| `npm run images:optimize:v2` | New professional script |
| `npm run images:stats` | Show statistics |
| `npm run images:check-large` | Find files > 500 KB |
| `npm run images:clean-temp` | Clean temp directory |
| `npm test` | Run tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |

## 🏗️ Architecture

### Design Patterns

1. **Bridge Pattern**: Abstraction for image processors
2. **Factory Pattern**: Create processors dynamically
3. **Service Layer**: Business logic separation
4. **Dependency Injection**: Flexible component composition

### Key Components

- **ImageProcessorBridge**: Abstract interface
- **SharpProcessor**: Local processing implementation
- **CloudinaryProcessor**: Cloud processing implementation
- **ImageOptimizationService**: High-level business logic
- **ProcessorFactory**: Dynamic processor creation
- **ImageConfig**: Configuration management
- **Logger**: Professional logging system

See `ARCHITECTURE.md` for detailed documentation.

## 📚 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture & design patterns
- **[API.md](docs/API.md)** - API endpoints documentation
- **[UPGRADE_GUIDE.md](UPGRADE_GUIDE.md)** - Migration from old version
- **[README.md](README.md)** - Original documentation
- **[QUICKREF.md](QUICKREF.md)** - Quick reference guide

## 🔧 Extending

### Add New Processor

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

module.exports = CustomProcessor;
```

Register in factory:
```javascript
// lib/factories/ProcessorFactory.js
case 'custom':
  return new CustomProcessor(config);
```

### Add New Service

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

## 🚨 Troubleshooting

### Issue: Module not found
```bash
npm install
```

### Issue: Sharp installation failed
```bash
npm rebuild sharp
```

### Issue: Cloudinary credentials error
```bash
# Check .env file
cat .env

# Or switch to sharp
IMAGE_PROCESSOR=sharp
```

## 📈 Performance

- **Concurrency**: Process multiple images in parallel
- **Binary Search**: Optimal quality finding algorithm
- **Streaming**: Memory-efficient processing
- **Caching**: Metadata caching (future enhancement)

## 🔒 Security

- Input validation
- File type checking
- Size limits
- Path sanitization
- API authentication ready

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Add tests
4. Update documentation
5. Submit pull request

## 📄 License

MIT

## 🙏 Credits

Built with:
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [Cloudinary](https://cloudinary.com/) - Cloud image management
- [Next.js](https://nextjs.org/) - React framework
- [Jest](https://jestjs.io/) - Testing framework

---

**Professional Edition - Built with ❤️ for production use**

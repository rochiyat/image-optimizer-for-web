# Architecture Documentation

## Overview

Professional image optimization system built with clean architecture principles, featuring the Bridge pattern for flexible image processing implementations.

## Architecture Layers

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
│  (Implementation) │                 │   (Implementation) │
└───────────────────┘                 └────────────────────┘
```

## Design Patterns

### 1. Bridge Pattern

**Purpose**: Decouple abstraction from implementation, allowing them to vary independently.

**Implementation**:
- `ImageProcessorBridge`: Abstract interface
- `SharpProcessor`: Concrete implementation using Sharp library
- `CloudinaryProcessor`: Concrete implementation using Cloudinary API

**Benefits**:
- Easy to add new image processors
- Switch between processors without changing client code
- Test with mock processors

### 2. Factory Pattern

**Purpose**: Create objects without specifying exact class.

**Implementation**:
- `ProcessorFactory`: Creates appropriate processor based on configuration

**Benefits**:
- Centralized object creation
- Easy configuration management
- Dependency injection ready

### 3. Service Layer Pattern

**Purpose**: Encapsulate business logic in reusable services.

**Implementation**:
- `ImageOptimizationService`: High-level optimization operations
- Coordinates between bridge and utilities

**Benefits**:
- Separation of concerns
- Reusable business logic
- Easy to test

## Directory Structure

```
project/
├── lib/
│   ├── config/
│   │   └── ImageConfig.js              # Centralized configuration
│   ├── factories/
│   │   └── ProcessorFactory.js         # Factory for processors
│   ├── image-processor/
│   │   ├── ImageProcessorBridge.js     # Bridge abstraction
│   │   └── implementations/
│   │       ├── SharpProcessor.js       # Sharp implementation
│   │       └── CloudinaryProcessor.js  # Cloudinary implementation
│   ├── services/
│   │   └── ImageOptimizationService.js # Business logic service
│   └── utils/
│       ├── Logger.js                   # Professional logging
│       └── ErrorHandler.js             # Error handling
├── scripts/
│   ├── optimize-images.js              # Legacy script
│   └── optimize-images-v2.js           # New professional script
├── pages/api/
│   ├── optimize-image.js               # API endpoint for optimization
│   └── upload-image.js                 # API endpoint for uploads
├── tests/
│   ├── unit/                           # Unit tests
│   └── integration/                    # Integration tests
└── components/
    └── Gallery.jsx                     # React components
```

## Core Components

### ImageProcessorBridge

Abstract interface for image processing operations:
- `optimize()`: Optimize image with given options
- `getMetadata()`: Get image information
- `resize()`: Resize image
- `convert()`: Convert format
- `compress()`: Compress with quality

### SharpProcessor

Implementation using Sharp library:
- High-performance image processing
- Local processing (no API calls)
- Supports JPEG, PNG, WebP, AVIF
- Progressive JPEG with MozJPEG

### CloudinaryProcessor

Implementation using Cloudinary API:
- Cloud-based processing
- CDN delivery
- Advanced transformations
- Automatic format selection

### ImageOptimizationService

High-level service providing:
- Batch optimization
- Single image optimization
- Quality optimization algorithm
- Statistics generation
- Error handling

### ImageConfig

Centralized configuration management:
- Environment variables
- Default values
- Validation
- Merge strategies

### Logger

Professional logging system:
- Multiple log levels (debug, info, warn, error)
- Colored console output
- File logging support
- Context-aware logging

## Usage Examples

### Basic Usage (CLI)

```bash
# Using new professional script
node scripts/optimize-images-v2.js
```

### Programmatic Usage

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
```

### API Usage

```javascript
// POST /api/optimize-image
fetch('/api/optimize-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    inputPath: './temp-uploads/photo.jpg',
    outputPath: './public/images/photo.jpg',
    options: {
      quality: 85,
      maxDimension: 2000
    }
  })
});
```

## Configuration

### Environment Variables

```bash
# Processor selection
IMAGE_PROCESSOR=sharp              # or 'cloudinary'

# Optimization settings
MAX_SIZE_KB=400
QUALITY=85
MAX_DIMENSION=2000

# Naming strategy
IMAGE_NAMING_STRATEGY=original     # or 'folder', 'timestamp'

# Cloudinary (if using cloudinary processor)
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Logging
LOG_LEVEL=info                     # debug, info, warn, error
LOG_FILE=./logs/optimization.log
```

### Configuration File

```javascript
// Custom configuration
const config = {
  processor: 'sharp',
  maxSizeKB: 400,
  quality: 85,
  maxDimension: 2000,
  namingStrategy: 'original',
  sourceDir: './temp-uploads',
  outputDir: './public/images/gallery'
};
```

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### Test Structure

```
tests/
├── unit/
│   ├── SharpProcessor.test.js
│   ├── ImageOptimizationService.test.js
│   └── ImageConfig.test.js
├── integration/
│   └── optimization-workflow.test.js
└── fixtures/
    ├── source/
    └── output/
```

## Extension Points

### Adding New Processor

1. Create new processor class implementing the interface:

```javascript
class CustomProcessor {
  async optimize(inputPath, outputPath, options) { }
  async getMetadata(imagePath) { }
  async resize(imagePath, dimensions) { }
  async convert(imagePath, format) { }
  async compress(imagePath, quality) { }
}
```

2. Register in ProcessorFactory:

```javascript
case 'custom':
  return new CustomProcessor(config);
```

### Adding New Service

```javascript
class ImageAnalysisService {
  constructor(bridge, config) {
    this.bridge = bridge;
    this.config = config;
  }
  
  async analyzeQuality(imagePath) {
    // Implementation
  }
}
```

## Performance Considerations

- **Concurrency**: Process multiple images in parallel
- **Memory**: Stream processing for large files
- **Caching**: Cache metadata to avoid reprocessing
- **Quality Algorithm**: Binary search for optimal quality

## Security

- Input validation for file paths
- File type validation
- Size limits
- Sanitized filenames
- API authentication (implement as needed)

## Monitoring

- Structured logging
- Error tracking
- Performance metrics
- Success/failure rates

## Future Enhancements

1. **Additional Processors**:
   - ImageMagick implementation
   - AWS S3 + Lambda implementation
   - Google Cloud Storage implementation

2. **Advanced Features**:
   - Watermarking
   - Face detection
   - Smart cropping
   - AI-based optimization

3. **Performance**:
   - Worker threads
   - Queue system
   - Distributed processing

4. **Monitoring**:
   - Prometheus metrics
   - Grafana dashboards
   - Alert system

## Contributing

When adding new features:
1. Follow existing patterns
2. Add tests
3. Update documentation
4. Maintain backward compatibility
5. Use TypeScript types (if migrating to TS)

## License

MIT

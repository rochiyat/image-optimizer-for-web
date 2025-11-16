# Image Optimization Setup untuk Web Komunitas

Setup lengkap untuk optimize dan manage gambar gallery di web komunitas dengan Next.js.

## 📦 Fitur

- ✅ Auto-optimize gambar ke target size (default: 400 KB)
- ✅ Smart quality adjustment (binary search algorithm)
- ✅ Resize gambar besar (max 2000px)
- ✅ Convert PNG ke JPG otomatis
- ✅ Progressive JPEG dengan MozJPEG
- ✅ Next.js auto-generate WebP & AVIF
- ✅ Statistics & monitoring tools
- ✅ Gitignore temp files

## 🚀 Installation

```bash
# Install dependencies
npm install

# Atau dengan yarn
yarn install
```

## 📁 Folder Structure

```
project/
├── temp-uploads/              # Taruh original images disini (gitignored)
│   ├── event-photo-1.jpg      # Original dari kamera (2.5 MB)
│   └── event-photo-2.jpg
│
├── public/images/gallery/     # Optimized images (committed to repo)
│   ├── 2024-11-event/
│   │   ├── photo-01.jpg       # Optimized (300 KB) ✅
│   │   └── photo-02.jpg
│   └── 2024-12-event/
│       └── photo-01.jpg
│
├── scripts/
│   ├── optimize-images.js     # Main optimization script
│   └── check-image-stats.js   # Statistics checker
│
├── next.config.js             # Next.js image config
├── .gitignore                 # Ignore temp-uploads
└── package.json
```

## 🎯 Workflow

### 1. Tambah Gambar Baru

```bash
# Copy original photos ke temp-uploads/
cp ~/Downloads/event-photos/* ./temp-uploads/

# Atau organize by event
mkdir -p temp-uploads/2024-11-talkshow-parenting
cp ~/Downloads/*.jpg temp-uploads/2024-11-talkshow-parenting/
```

### 2. Optimize Gambar

```bash
# Run optimization script
npm run images:optimize

# Output:
# ╔═══════════════════════════════════════╗
# ║   Image Optimizer for Web Komunitas   ║
# ╚═══════════════════════════════════════╝
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

### Customize Optimization Settings

Edit `scripts/optimize-images.js`:

```javascript
const CONFIG = {
  sourceDir: './temp-uploads',
  outputDir: './public/images/gallery',
  maxSizeKB: 400,      // Target max size (adjust as needed)
  quality: 85,         // Starting quality
  maxDimension: 2000,  // Max width/height
};
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
| `npm run images:optimize` | Optimize semua gambar dari temp-uploads |
| `npm run images:stats` | Show detailed statistics |
| `npm run images:check` | List 20 largest files |
| `npm run images:check-large` | Find files > 500 KB |
| `npm run images:clean-temp` | Delete temp-uploads content |

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

## 📚 Resources

- [Next.js Image Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/images)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP vs AVIF](https://www.industrialempathy.com/posts/avif-webp-quality-settings/)

## 🤝 Support

Jika ada masalah atau pertanyaan, contact: [Your Contact]

---

**Happy optimizing! 🚀**

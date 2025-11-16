# Quick Reference - Image Optimizer

## 🚀 Common Commands

```bash
# 1. Add images
cp ~/Downloads/*.jpg temp-uploads/

# 2. Optimize
npm run images:optimize

# 3. Check stats
npm run images:stats

# 4. Check large files
npm run images:check-large

# 5. Commit
git add public/images/
git commit -m "Add optimized images"

# 6. Clean temp
npm run images:clean-temp
```

## 📁 File Locations

| Location | Purpose | Git |
|----------|---------|-----|
| `temp-uploads/` | Original images (2.5 MB) | ❌ Ignored |
| `public/images/gallery/` | Optimized images (300 KB) | ✅ Committed |

## 🏷️ Naming Convention

```
✅ Good: 2024-11-event-name/photo-01.jpg
❌ Bad: IMG_1234.jpg
```

## ⚙️ Config Quick Edit

File: `scripts/optimize-images.js`

```javascript
const CONFIG = {
  maxSizeKB: 400,      // Lower = smaller file
  quality: 85,         // Lower = more compression
  maxDimension: 2000,  // Lower = smaller size
};
```

## 🎨 Component Usage

```jsx
import Image from 'next/image';

<Image 
  src="/images/gallery/2024-11-event/photo-01.jpg"
  width={800}
  height={600}
  alt="Event description"
  quality={85}
/>
```

## 📊 Size Guidelines

| Size | Status |
|------|--------|
| < 200 KB | ✅ Perfect |
| 200-400 KB | ✅ Good |
| 400-500 KB | ⚠️ OK |
| > 500 KB | ❌ Re-optimize |

## 🔧 Troubleshooting

### Images too large?
```javascript
// Edit CONFIG in optimize-images.js
maxSizeKB: 250,  // Lower from 400
quality: 75,     // Lower from 85
```

### Repo too big?
```bash
# Check size
du -sh .git/

# Consider moving old images to Cloudinary
```

### Sharp errors?
```bash
npm rebuild sharp
```

## 💡 Pro Tips

1. **Organize by event**
   ```
   temp-uploads/2024-11-event/
   temp-uploads/2024-12-event/
   ```

2. **Always check before commit**
   ```bash
   npm run images:stats
   npm run images:check-large
   ```

3. **Batch process multiple events**
   ```bash
   cp -r ~/Downloads/event-*/ temp-uploads/
   npm run images:optimize
   ```

4. **Monitor total gallery size**
   - Keep under 100 MB total
   - Move old events to Cloudinary if needed

## 📞 Need Help?

Read: `README.md` for full documentation

# 🎉 Image Optimizer Setup - SIAP PAKAI!

Complete setup untuk optimize gambar gallery di web komunitas kamu dengan Next.js.

## 📦 Apa yang Ada di Folder Ini?

Semua file yang kamu butuhkan untuk:
- ✅ Optimize gambar dari 2.5 MB → 300-400 KB
- ✅ Auto-generate WebP & AVIF
- ✅ Next.js Image Component ready
- ✅ Git-friendly workflow
- ✅ Complete monitoring tools

## 🚀 Quick Start (3 Langkah)

### 1️⃣ Copy Files ke Project Kamu

```bash
# Di folder project Next.js kamu
cp -r image-optimizer-setup/scripts ./
cp image-optimizer-setup/next.config.js ./
cp image-optimizer-setup/package.json ./package-scripts-addon.json

# Merge .gitignore
cat image-optimizer-setup/.gitignore >> .gitignore
```

### 2️⃣ Install Dependencies

```bash
npm install sharp glob --save-dev
```

### 3️⃣ Setup Directories

```bash
mkdir -p temp-uploads
mkdir -p public/images/gallery
```

**DONE! Siap dipakai!** 🎉

## 📖 Cara Pakai (Daily Workflow)

```bash
# 1. Taruh foto original di temp-uploads/
cp ~/Downloads/event-photos/* temp-uploads/

# 2. Optimize!
npm run images:optimize

# 3. Check hasilnya
npm run images:stats

# 4. Commit (gambar sudah optimized)
git add public/images/
git commit -m "Add gallery photos (optimized)"

# 5. Clean temp
npm run images:clean-temp
```

## 📂 File Structure Overview

```
✅ Core Files (MUST HAVE):
├── scripts/
│   ├── optimize-images.js          ⭐ Main optimizer
│   └── check-image-stats.js        ⭐ Statistics
├── package.json                    ⭐ NPM scripts
├── next.config.js                  ⭐ Next.js config
└── .gitignore                      ⭐ Ignore rules

📚 Documentation:
├── README.md                       Complete guide
├── QUICKREF.md                     Cheat sheet
└── FILE_STRUCTURE.md               File overview

🎨 Examples:
├── components/Gallery.jsx          React components
├── .env.example                    Environment vars
└── setup.sh                        Auto setup script
```

## 🎯 Integration Steps (Detailed)

### Option A: New Project (Paling Mudah)

```bash
# 1. Copy everything
cp -r image-optimizer-setup/* your-project/

# 2. Install
cd your-project
npm install

# 3. Test
cp ~/test-photo.jpg temp-uploads/
npm run images:optimize
```

### Option B: Existing Project (Merge Carefully)

```bash
# 1. Copy scripts
cp -r image-optimizer-setup/scripts your-project/

# 2. Merge package.json
# Tambahkan scripts dari package.json ke package.json kamu:
"scripts": {
  "images:optimize": "node scripts/optimize-images.js",
  "images:stats": "node scripts/check-image-stats.js",
  "images:check-large": "find public/images -type f -size +500k",
  "images:clean-temp": "rm -rf temp-uploads/*"
}

# 3. Merge next.config.js
# Copy section "images" ke next.config.js kamu

# 4. Update .gitignore
echo "temp-uploads/" >> .gitignore
echo "**/*-original.jpg" >> .gitignore

# 5. Install dependencies
npm install sharp glob --save-dev
```

## 📊 Expected Results

**Before Optimization:**
```
photo-original.jpg: 2.5 MB ❌
```

**After Optimization:**
```
photo-01.jpg: 328 KB ✅
- Saved: 87%
- Quality: Still excellent
- Format: Progressive JPEG
- Next.js will generate: WebP, AVIF
```

## 🎨 Using in Components

```jsx
import Image from 'next/image';

function Gallery() {
  return (
    <Image
      src="/images/gallery/2024-11-event/photo-01.jpg"
      width={800}
      height={600}
      alt="Event komunitas"
      quality={85}
    />
  );
}
```

## ⚙️ Configuration

Edit `scripts/optimize-images.js`:

```javascript
const CONFIG = {
  maxSizeKB: 400,      // Target max size (default: 400 KB)
  quality: 85,         // JPEG quality (default: 85)
  maxDimension: 2000,  // Max width/height (default: 2000px)
};
```

## 🔍 Available Commands

| Command | Description |
|---------|-------------|
| `npm run images:optimize` | Optimize all images |
| `npm run images:stats` | Show statistics |
| `npm run images:check-large` | Find files > 500 KB |
| `npm run images:clean-temp` | Clean temp-uploads |

## 📚 Documentation Files

- **README.md** - Complete documentation (BACA INI!)
- **QUICKREF.md** - Quick reference cheat sheet
- **FILE_STRUCTURE.md** - File structure overview
- **components/Gallery.jsx** - Example components

## ✅ Verification Checklist

Setelah setup, pastikan:

- [ ] `scripts/` folder ada dengan 2 files
- [ ] `package.json` punya scripts untuk images
- [ ] `next.config.js` configured untuk images
- [ ] `temp-uploads/` directory exists
- [ ] `public/images/gallery/` directory exists
- [ ] Dependencies installed (sharp, glob)
- [ ] `.gitignore` includes temp-uploads

## 🚨 Common Issues

### "sharp not found"
```bash
npm install sharp --save-dev
# Atau kalau error:
npm rebuild sharp
```

### "No images found"
```bash
# Pastikan images di temp-uploads/
ls -la temp-uploads/
```

### Images masih terlalu besar
```javascript
// Edit CONFIG di optimize-images.js
maxSizeKB: 250,  // Lower
quality: 75,     // Lower
```

## 💡 Pro Tips

1. **Organize by event**
   ```
   temp-uploads/
   ├── 2024-11-event/
   └── 2024-12-event/
   ```

2. **Always check before commit**
   ```bash
   npm run images:stats
   npm run images:check-large
   ```

3. **Batch processing**
   ```bash
   cp -r ~/Downloads/event-*/ temp-uploads/
   npm run images:optimize
   ```

## 🎯 Next Steps

1. ✅ Copy files ke project
2. ✅ Install dependencies
3. ✅ Read: `README.md` (comprehensive guide)
4. ✅ Quick ref: `QUICKREF.md` (cheat sheet)
5. ✅ Test: Add test image & optimize
6. ✅ Integrate: Use Gallery components

## 📞 Support

- Read: `README.md` untuk detailed documentation
- Check: `QUICKREF.md` untuk quick commands
- Example: `components/Gallery.jsx` untuk component examples

---

## 🎉 You're Ready!

Semua file siap pakai. Tinggal copy ke project, install dependencies, dan mulai optimize!

**Happy optimizing! 🚀**

---

Created with ❤️ for Web Komunitas Indonesia

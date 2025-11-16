const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
require('dotenv').config();

const CONFIG = {
  sourceDir: './temp-uploads',
  outputDir: './public/images/gallery',
  maxSizeKB: 400,  // Target max 400 KB per image
  quality: 85,
  maxDimension: 2000, // Max width or height
  namingStrategy: process.env.IMAGE_NAMING_STRATEGY || 'original', // 'original' or 'folder'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

async function getOptimalQuality(inputPath, targetSizeKB) {
  let quality = 90;
  let lowQuality = 60;
  let highQuality = 95;
  let attempts = 0;
  const maxAttempts = 8;
  
  while (attempts < maxAttempts && (highQuality - lowQuality) > 5) {
    quality = Math.floor((lowQuality + highQuality) / 2);
    
    const tempBuffer = await sharp(inputPath)
      .jpeg({ quality, progressive: true, mozjpeg: true })
      .toBuffer();
    
    const outputSizeKB = tempBuffer.length / 1024;
    
    if (outputSizeKB > targetSizeKB) {
      highQuality = quality;
    } else {
      lowQuality = quality;
    }
    
    attempts++;
  }
  
  return Math.max(lowQuality, 70); // Minimum quality 70
}

async function optimizeImage(inputPath, outputPath) {
  try {
    const filename = path.basename(inputPath);
    const stats = await fs.stat(inputPath);
    const originalSizeMB = stats.size / 1024 / 1024;
    const originalSizeKB = stats.size / 1024;
    
    console.log(`\n${colors.cyan}📸 Processing: ${filename}${colors.reset}`);
    console.log(`${colors.gray}   Original: ${originalSizeMB.toFixed(2)} MB (${originalSizeKB.toFixed(0)} KB)${colors.reset}`);
    
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`${colors.gray}   Dimensions: ${metadata.width}x${metadata.height}${colors.reset}`);
    
    // Calculate resize if needed
    let resizeWidth = metadata.width;
    let resizeHeight = metadata.height;
    
    if (metadata.width > CONFIG.maxDimension || metadata.height > CONFIG.maxDimension) {
      if (metadata.width > metadata.height) {
        resizeWidth = CONFIG.maxDimension;
        resizeHeight = Math.round((metadata.height / metadata.width) * CONFIG.maxDimension);
      } else {
        resizeHeight = CONFIG.maxDimension;
        resizeWidth = Math.round((metadata.width / metadata.height) * CONFIG.maxDimension);
      }
      console.log(`${colors.gray}   Resizing to: ${resizeWidth}x${resizeHeight}${colors.reset}`);
    }
    
    // Find optimal quality
    console.log(`${colors.gray}   Finding optimal quality...${colors.reset}`);
    const quality = await getOptimalQuality(inputPath, CONFIG.maxSizeKB);
    
    // Process image
    await sharp(inputPath)
      .resize(resizeWidth, resizeHeight, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ 
        quality, 
        progressive: true,
        mozjpeg: true 
      })
      .toFile(outputPath);
    
    const newStats = await fs.stat(outputPath);
    const newSizeMB = newStats.size / 1024 / 1024;
    const newSizeKB = newStats.size / 1024;
    const savedPercent = ((1 - newSizeMB/originalSizeMB) * 100).toFixed(0);
    
    console.log(`   ${colors.green}✓${colors.reset} Optimized: ${newSizeMB.toFixed(2)} MB (${newSizeKB.toFixed(0)} KB)`);
    console.log(`   Quality: ${quality}%`);
    console.log(`   ${colors.green}Saved: ${savedPercent}%${colors.reset}`);
    
    if (newSizeKB > CONFIG.maxSizeKB) {
      console.log(`   ${colors.yellow}⚠️  Warning: Still > ${CONFIG.maxSizeKB} KB (but acceptable)${colors.reset}`);
    } else {
      console.log(`   ${colors.green}✅ Perfect for repo!${colors.reset}`);
    }
    
    return {
      filename,
      originalSizeKB,
      newSizeKB,
      savedPercent: parseFloat(savedPercent),
    };
    
  } catch (error) {
    console.error(`${colors.red}❌ Error processing ${path.basename(inputPath)}: ${error.message}${colors.reset}`);
    return null;
  }
}

async function ensureDirectories() {
  await fs.mkdir(CONFIG.sourceDir, { recursive: true });
  await fs.mkdir(CONFIG.outputDir, { recursive: true });
}

async function main() {
  console.log(`${colors.cyan}
╔═══════════════════════════════════════╗
║   Image Optimizer for Web Komunitas   ║
╚═══════════════════════════════════════╝${colors.reset}
`);
  
  await ensureDirectories();
  
  // Find all images
  const patterns = [
    `${CONFIG.sourceDir}/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}`,
  ];
  
  let allImages = [];
  for (const pattern of patterns) {
    const images = await glob(pattern);
    allImages = allImages.concat(images);
  }
  
  if (allImages.length === 0) {
    console.log(`${colors.yellow}No images found in ${CONFIG.sourceDir}${colors.reset}`);
    console.log(`\nPlease add images to ${CONFIG.sourceDir}/ first.`);
    console.log(`Example: cp ~/Downloads/*.jpg ${CONFIG.sourceDir}/\n`);
    return;
  }
  
  console.log(`${colors.cyan}Found ${allImages.length} image(s) to optimize${colors.reset}`);
  console.log(`${colors.gray}Target size: max ${CONFIG.maxSizeKB} KB per image${colors.reset}`);
  console.log(`${colors.gray}Max dimension: ${CONFIG.maxDimension}px${colors.reset}`);
  console.log(`${colors.gray}Naming strategy: ${CONFIG.namingStrategy}${colors.reset}\n`);
  
  const results = [];
  const folderCounters = {}; // Track counter per folder
  
  for (let i = 0; i < allImages.length; i++) {
    const imagePath = allImages[i];
    const relativePath = path.relative(CONFIG.sourceDir, imagePath);
    let outputPath;
    
    if (CONFIG.namingStrategy === 'folder') {
      // Get folder name and create sequential naming
      const folderName = path.dirname(relativePath);
      const baseFolderName = folderName === '.' ? 'image' : path.basename(folderName);
      
      // Initialize counter for this folder if not exists
      if (!folderCounters[folderName]) {
        folderCounters[folderName] = 1;
      }
      
      const counter = String(folderCounters[folderName]).padStart(3, '0');
      const newFileName = `${baseFolderName}-${counter}.jpg`;
      outputPath = path.join(CONFIG.outputDir, folderName, newFileName);
      
      folderCounters[folderName]++;
    } else {
      // Keep original filename
      outputPath = path.join(CONFIG.outputDir, relativePath)
        .replace(/\.(png|PNG)$/i, '.jpg'); // Convert PNG to JPG
    }
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    const result = await optimizeImage(imagePath, outputPath);
    
    if (result) {
      results.push(result);
    }
  }
  
  // Summary
  if (results.length > 0) {
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSizeKB, 0);
    const totalNew = results.reduce((sum, r) => sum + r.newSizeKB, 0);
    const totalSaved = ((1 - totalNew/totalOriginal) * 100).toFixed(0);
    
    console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.green}✅ Successfully optimized ${results.length} image(s)!${colors.reset}`);
    console.log(`\n📊 Summary:`);
    console.log(`   Total original size: ${(totalOriginal / 1024).toFixed(2)} MB`);
    console.log(`   Total optimized size: ${(totalNew / 1024).toFixed(2)} MB`);
    console.log(`   ${colors.green}Total saved: ${totalSaved}%${colors.reset}`);
    console.log(`\n📁 Optimized images saved to: ${colors.cyan}${CONFIG.outputDir}${colors.reset}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Check the optimized images`);
    console.log(`   2. Run: ${colors.cyan}git add ${CONFIG.outputDir}${colors.reset}`);
    console.log(`   3. Run: ${colors.cyan}git commit -m "Add optimized gallery images"${colors.reset}`);
    console.log(`   4. Clean temp files: ${colors.cyan}npm run images:clean-temp${colors.reset}\n`);
  }
}

main().catch(console.error);

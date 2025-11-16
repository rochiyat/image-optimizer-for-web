const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

const GALLERY_DIR = './public/images/gallery';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

async function getImageStats() {
  const images = await glob(`${GALLERY_DIR}/**/*.{jpg,jpeg,png,webp,avif}`);
  
  if (images.length === 0) {
    console.log(`${colors.yellow}No images found in ${GALLERY_DIR}${colors.reset}\n`);
    return;
  }
  
  const stats = [];
  let totalSize = 0;
  
  for (const imagePath of images) {
    const stat = await fs.stat(imagePath);
    const sizeKB = stat.size / 1024;
    const sizeMB = stat.size / 1024 / 1024;
    
    totalSize += stat.size;
    
    stats.push({
      path: path.relative(process.cwd(), imagePath),
      sizeKB,
      sizeMB,
      size: stat.size,
    });
  }
  
  // Sort by size (largest first)
  stats.sort((a, b) => b.size - a.size);
  
  console.log(`${colors.cyan}
╔════════════════════════════════════════╗
║       Gallery Images Statistics        ║
╚════════════════════════════════════════╝${colors.reset}
`);
  
  console.log(`Total images: ${colors.cyan}${stats.length}${colors.reset}`);
  console.log(`Total size: ${colors.cyan}${(totalSize / 1024 / 1024).toFixed(2)} MB${colors.reset}`);
  console.log(`Average size: ${colors.cyan}${(totalSize / stats.length / 1024).toFixed(0)} KB${colors.reset}\n`);
  
  // Size distribution
  const under100KB = stats.filter(s => s.sizeKB < 100).length;
  const under300KB = stats.filter(s => s.sizeKB >= 100 && s.sizeKB < 300).length;
  const under500KB = stats.filter(s => s.sizeKB >= 300 && s.sizeKB < 500).length;
  const over500KB = stats.filter(s => s.sizeKB >= 500).length;
  
  console.log(`${colors.cyan}Size Distribution:${colors.reset}`);
  console.log(`  ${colors.green}< 100 KB:${colors.reset}    ${under100KB} images (${(under100KB/stats.length*100).toFixed(0)}%)`);
  console.log(`  ${colors.green}100-300 KB:${colors.reset}  ${under300KB} images (${(under300KB/stats.length*100).toFixed(0)}%)`);
  console.log(`  ${colors.yellow}300-500 KB:${colors.reset}  ${under500KB} images (${(under500KB/stats.length*100).toFixed(0)}%)`);
  console.log(`  ${colors.red}> 500 KB:${colors.reset}    ${over500KB} images (${(over500KB/stats.length*100).toFixed(0)}%)`);
  
  // Show largest files
  if (stats.length > 0) {
    console.log(`\n${colors.cyan}Top 10 Largest Files:${colors.reset}`);
    const top10 = stats.slice(0, 10);
    
    for (let i = 0; i < top10.length; i++) {
      const stat = top10[i];
      const color = stat.sizeKB > 500 ? colors.red : stat.sizeKB > 300 ? colors.yellow : colors.green;
      const sizeStr = stat.sizeMB > 1 
        ? `${stat.sizeMB.toFixed(2)} MB` 
        : `${stat.sizeKB.toFixed(0)} KB`;
      
      console.log(`  ${i + 1}. ${color}${sizeStr.padEnd(10)}${colors.reset} ${colors.gray}${stat.path}${colors.reset}`);
    }
  }
  
  // Warnings
  if (over500KB > 0) {
    console.log(`\n${colors.yellow}⚠️  Warning: ${over500KB} file(s) are larger than 500 KB${colors.reset}`);
    console.log(`${colors.gray}   Consider re-optimizing these files with lower quality${colors.reset}`);
  }
  
  if (totalSize / 1024 / 1024 > 100) {
    console.log(`\n${colors.yellow}⚠️  Warning: Total gallery size is > 100 MB${colors.reset}`);
    console.log(`${colors.gray}   Consider moving some images to Cloudinary${colors.reset}`);
  }
  
  console.log('');
}

getImageStats().catch(console.error);

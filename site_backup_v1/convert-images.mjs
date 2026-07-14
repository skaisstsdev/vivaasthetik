// convert-images.mjs - convert all images to WebP
import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const dirs = [
  'public',
  'public/images/services',
];

const extensions = ['.jpg', '.jpeg', '.png', '.PNG', '.JPG'];

let totalSavedBytes = 0;

for (const dir of dirs) {
  const files = readdirSync(dir);
  for (const file of files) {
    const ext = extname(file);
    if (!extensions.includes(ext)) continue;
    
    const inputPath = join(dir, file);
    const stat = statSync(inputPath);
    if (stat.isDirectory()) continue;
    
    const outputName = basename(file, ext) + '.webp';
    const outputPath = join(dir, outputName);
    
    // Skip if already converted
    if (existsSync(outputPath)) {
      console.log(`⏭  Skipping ${file} (already exists)`);
      continue;
    }
    
    try {
      await sharp(inputPath)
        .webp({ quality: 90, effort: 4 })
        .toFile(outputPath);
      
      const newStat = statSync(outputPath);
      const saved = stat.size - newStat.size;
      totalSavedBytes += saved;
      
      console.log(`✅ ${file} → ${outputName} (${(stat.size/1024).toFixed(0)}KB → ${(newStat.size/1024).toFixed(0)}KB, saved ${(saved/1024).toFixed(0)}KB)`);
    } catch (err) {
      console.error(`❌ Failed: ${file}`, err.message);
    }
  }
}

console.log(`\n🎉 Total saved: ${(totalSavedBytes/1024/1024).toFixed(2)} MB`);

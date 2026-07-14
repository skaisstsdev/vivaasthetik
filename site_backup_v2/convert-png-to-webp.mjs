// convert-png-to-webp.mjs - convert Cyrillic-named PNG files to clean WebP names
import sharp from 'sharp';

const conversions = [
  { from: 'public/images/services/ботокс.PNG', to: 'public/images/services/botox_final.webp' },
  { from: 'public/images/services/фаденлифтинг.PNG', to: 'public/images/services/faden_final.webp' },
  { from: 'public/images/services/филлеры.PNG', to: 'public/images/services/filler_final.webp' },
  { from: 'public/images/services/волосы лечение.PNG', to: 'public/images/services/hair_final.webp' },
  { from: 'public/images/services/интимлифтинг.PNG', to: 'public/images/services/intim_final.webp' },
  { from: 'public/images/services/коррекция губ.PNG', to: 'public/images/services/lips_final.webp' },
  { from: 'public/images/services/мезотерапия.PNG', to: 'public/images/services/meso_final.webp' },
  { from: 'public/images/services/вампирлифтинг.PNG', to: 'public/images/services/vampire_final.webp' },
  { from: 'public/images/services/Липолиз.PNG', to: 'public/images/services/lipolyse_final.webp' },
];

import { existsSync, statSync } from 'fs';

let totalSaved = 0;

for (const { from, to } of conversions) {
  if (!existsSync(from)) {
    console.log(`⚠️  Source not found: ${from}`);
    continue;
  }
  
  const origSize = statSync(from).size;
  
  try {
    await sharp(from)
      .webp({ quality: 88, effort: 4 })
      .toFile(to);
    
    const newSize = existsSync(to) ? statSync(to).size : 0;
    const saved = origSize - newSize;
    totalSaved += saved;
    
    console.log(`✅ ${from.split('/').pop()} → ${to.split('/').pop()} (${(origSize/1024/1024).toFixed(1)}MB → ${(newSize/1024).toFixed(0)}KB, -${(saved/1024/1024).toFixed(1)}MB)`);
  } catch (err) {
    console.error(`❌ Failed: ${from}`, err.message);
  }
}

console.log(`\n🎉 Total saved: ${(totalSaved/1024/1024).toFixed(2)} MB`);

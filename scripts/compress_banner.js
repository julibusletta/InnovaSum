const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function compressExisting() {
  const input = path.join(process.cwd(), 'public', 'images', 'bannerof2.png');
  const output = path.join(process.cwd(), 'public', 'images', 'bannerof2.webp');

  if (fs.existsSync(input)) {
    console.log(`Comprimiendo ${input}...`);
    try {
      await sharp(input)
        .resize(1920) // Max width for banners
        .webp({ quality: 80 })
        .toFile(output);
      console.log(`¡Listo! Guardado en ${output}`);
      const stats = fs.statSync(output);
      console.log(`Nuevo tamaño: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (err) {
      console.error('Error comprimiendo:', err);
    }
  } else {
    console.log('No se encontró bannerof2.png');
  }
}

compressExisting();

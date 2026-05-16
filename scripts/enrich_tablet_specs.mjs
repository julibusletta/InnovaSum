import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const SPECS_DATABASE = {
  'IPAD 11TH': {
    procesador: 'Apple A16 Bionic (6 núcleos)',
    pantalla: '10.9" Liquid Retina (2360 x 1640), 500 nits',
    camaras: 'Trasera 12MP Wide, Frontal 12MP Ultra-wide (Encuadre Centrado)',
    bateria: 'Hasta 10 horas de navegación y video',
    otros: 'USB-C, Touch ID, compatible con Apple Pencil',
    marca: 'Apple'
  },
  'IPAD AIR M3': {
    procesador: 'Apple M2 / M3 Chip',
    pantalla: '11" / 13" Liquid Retina con True Tone',
    camaras: 'Trasera 12MP Wide, Frontal 12MP Landscape Ultra-wide',
    bateria: 'Hasta 10 horas de autonomía',
    otros: 'Carga USB-C, Wi-Fi 6E, compatible con Apple Pencil Pro',
    marca: 'Apple'
  },
  'IPAD AIR M4': {
    procesador: 'Apple M4 Chip (Neural Engine avanzado)',
    pantalla: '11" / 13" Liquid Retina con 500 nits',
    camaras: 'Trasera 12MP Wide, Frontal 12MP Landscape Ultra-wide',
    bateria: 'Hasta 10 horas de autonomía',
    otros: 'Apple Intelligence, USB-C, Wi-Fi 7 ready',
    marca: 'Apple'
  },
  'IPAD PRO M5': {
    procesador: 'Apple M4 / M5 Chip',
    pantalla: '11" / 13" Tandem OLED (ProMotion 120Hz)',
    camaras: 'Trasera 12MP Wide + Pro-Video, Frontal 12MP TrueDepth',
    bateria: 'Hasta 10 horas de autonomía',
    otros: 'Face ID, Thunderbolt / USB 4, Diseño Ultra-delgado',
    marca: 'Apple'
  },
  'REDMI PAD 2': {
    procesador: 'Snapdragon 680 / Helio G99',
    pantalla: '11" FHD+ (90Hz / 120Hz)',
    camaras: 'Trasera 8MP, Frontal 5MP',
    bateria: '8000 mAh, Carga rápida 18W',
    otros: 'Cuatro altavoces con Dolby Atmos',
    marca: 'Xiaomi'
  },
  'FIRE HD 10': {
    procesador: 'Octa-core 2.0 GHz',
    pantalla: '10.1" 1080p Full HD (1920 x 1200)',
    camaras: '5MP Trasera y Frontal',
    bateria: 'Hasta 13 horas de uso mixto',
    otros: 'USB-C (2.0), 3GB RAM, Integración con Alexa',
    marca: 'Amazon'
  }
};

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    
    const tablets = await Product.find({ category: 'tablets' });
    console.log(`Enriching ${tablets.length} Tablets...`);

    let count = 0;
    for (const p of tablets) {
      const upperName = p.name.toUpperCase();
      let matchedKey = null;

      if (upperName.includes('IPAD 11TH')) matchedKey = 'IPAD 11TH';
      else if (upperName.includes('IPAD AIR M3')) matchedKey = 'IPAD AIR M3';
      else if (upperName.includes('IPAD AIR M4')) matchedKey = 'IPAD AIR M4';
      else if (upperName.includes('IPAD PRO') && (upperName.includes('M5') || upperName.includes('M4'))) matchedKey = 'IPAD PRO M5';
      else if (upperName.includes('REDMI PAD')) matchedKey = 'REDMI PAD 2';
      else if (upperName.includes('FIRE HD 10')) matchedKey = 'FIRE HD 10';

      if (matchedKey) {
        const base = SPECS_DATABASE[matchedKey];
        
        let storage = '128 GB';
        const storageMatch = upperName.match(/(\d+)(GB|TB)/);
        if (storageMatch) storage = storageMatch[1] + ' ' + storageMatch[2];

        const specifications = [
          { label: 'Procesador', value: base.procesador },
          { label: 'Pantalla', value: base.pantalla },
          { label: 'Almacenamiento', value: storage },
          { label: 'Cámaras', value: base.camaras },
          { label: 'Capacidad de Batería', value: base.bateria },
          { label: 'Características', value: base.otros },
          { label: 'Marca', value: base.marca }
        ];

        await Product.updateOne({ _id: p._id }, { $set: { specifications } });
        console.log(`Updated: ${p.name} -> ${matchedKey}`);
        count++;
      }
    }

    console.log(`Done. Updated ${count} Tablets.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

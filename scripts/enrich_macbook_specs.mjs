import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const SPECS_DATABASE = {
  'MACBOOK AIR M1': {
    procesador: 'Apple M1 (8 núcleos CPU, 7/8 núcleos GPU)',
    pantalla: '13.3" Retina con True Tone (2560 x 1600)',
    bateria: 'Hasta 18 horas de autonomía',
    otros: 'Touch ID, Magic Keyboard, trackpad Force Touch'
  },
  'MACBOOK AIR M2': {
    procesador: 'Apple M2 (8 núcleos CPU, 8/10 núcleos GPU)',
    pantalla: '13.6" / 15.3" Liquid Retina (2560 x 1664 / 2880 x 1864)',
    bateria: 'Hasta 18 horas de autonomía',
    otros: 'Carga MagSafe 3, cámara FaceTime HD 1080p'
  },
  'MACBOOK AIR M3': {
    procesador: 'Apple M3 (8 núcleos CPU, 8/10 núcleos GPU)',
    pantalla: '13.6" / 15.3" Liquid Retina, soporte hasta 2 pantallas externas',
    bateria: 'Hasta 18 horas de autonomía',
    otros: 'Wi-Fi 6E, MagSafe 3, diseño sin ventilador'
  },
  'MACBOOK AIR M4': {
    procesador: 'Apple M4 (10 núcleos CPU, 10 núcleos GPU)',
    pantalla: '13.6" / 15.3" Liquid Retina con 500 nits',
    bateria: 'Hasta 18 horas de autonomía',
    otros: 'Apple Intelligence, Ray Tracing, Neural Engine de 16 núcleos'
  },
  'MACBOOK PRO M3': {
    procesador: 'Apple M3 / M3 Pro / M3 Max',
    pantalla: '14.2" / 16.2" Liquid Retina XDR (120Hz ProMotion)',
    bateria: 'Hasta 22 horas de autonomía',
    otros: 'HDMI 2.1, Ranura SDXC, MagSafe 3'
  },
  'MACBOOK NEO': {
    procesador: 'Apple A18 Pro (Neural Engine avanzado)',
    pantalla: '13" Retina de alta fidelidad',
    bateria: 'Eficiencia extrema para productividad móvil',
    otros: 'Edición especial Ultra-portátil'
  }
};

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    
    const macbooks = await Product.find({ category: 'macbook' });
    console.log(`Enriching ${macbooks.length} Macbooks...`);

    let count = 0;
    for (const p of macbooks) {
      const upperName = p.name.toUpperCase();
      let matchedKey = null;

      if (upperName.includes('MACBOOK M1')) matchedKey = 'MACBOOK AIR M1';
      else if (upperName.includes('MACBOOK M2')) matchedKey = 'MACBOOK AIR M2';
      else if (upperName.includes('MACBOOK M3 AIR')) matchedKey = 'MACBOOK AIR M3';
      else if (upperName.includes('MACBOOK M3 PRO')) matchedKey = 'MACBOOK PRO M3'; // Generalize
      else if (upperName.includes('MACBOOK PRO M3')) matchedKey = 'MACBOOK PRO M3';
      else if (upperName.includes('MACBOOK M4 AIR')) matchedKey = 'MACBOOK AIR M4';
      else if (upperName.includes('MACBOOK NEO')) matchedKey = 'MACBOOK NEO';
      else if (upperName.includes('MACBOOK AIR')) {
          if (upperName.includes('M1')) matchedKey = 'MACBOOK AIR M1';
          else if (upperName.includes('M2')) matchedKey = 'MACBOOK AIR M2';
          else if (upperName.includes('M3')) matchedKey = 'MACBOOK AIR M3';
          else matchedKey = 'MACBOOK AIR M1'; // Default to M1 if ambiguous but is Air
      }

      if (matchedKey) {
        const base = SPECS_DATABASE[matchedKey];
        
        // Extract RAM and Storage
        let ram = '8 GB';
        let storage = '256 GB';
        
        const ramMatch = upperName.match(/(\d+)(GB|RAM)/);
        const storageMatch = upperName.match(/(\d+)(GB|TB|SSD)/);
        
        if (ramMatch) ram = ramMatch[1] + ' GB';
        // If name has 16/256, handle it
        const comboMatch = upperName.match(/(\d+)\/(\d+)(GB|TB)/);
        if (comboMatch) {
            ram = comboMatch[1] + ' GB';
            storage = comboMatch[2] + ' ' + comboMatch[3];
        } else if (storageMatch) {
            storage = storageMatch[1] + ' ' + storageMatch[2];
        }

        const specifications = [
          { label: 'Procesador', value: base.procesador },
          { label: 'Memoria RAM', value: ram },
          { label: 'Almacenamiento', value: storage },
          { label: 'Pantalla', value: base.pantalla },
          { label: 'Batería', value: base.bateria },
          { label: 'Características', value: base.otros },
          { label: 'Marca', value: 'Apple' }
        ];

        await Product.updateOne({ _id: p._id }, { $set: { specifications } });
        console.log(`Updated: ${p.name} -> ${matchedKey}`);
        count++;
      }
    }

    console.log(`Done. Updated ${count} Macbooks.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const SPECS_DATABASE = {
  'REALME 14': {
    procesador: 'MediaTek Dimensity 7300-Ultra (4 nm)',
    camaras: 'Trasera 50MP OIS + 8MP, Frontal 32MP',
    pantalla: '6.7" AMOLED Pro-XDR, 120Hz',
    bateria: '5000 mAh, SuperVOOC 67W',
    so: 'Android 14 (Realme UI 5.0)'
  },
  'REALME C71': {
    procesador: 'MediaTek Dimensity 6100+ 5G',
    camaras: 'Trasera 50MP AI, Frontal 8MP',
    pantalla: '6.72" FHD+, 120Hz',
    bateria: '5000 mAh, 33W Fast Charge',
    so: 'Android 14 (Realme UI Edition)'
  },
  'REALME C75': {
    procesador: 'Helio G99 / Snapdragon 685',
    camaras: 'Trasera 108MP 3x In-sensor Zoom, Frontal 16MP',
    pantalla: '6.72" 90Hz / 120Hz Vivid Display',
    bateria: '5000 mAh, SuperVOOC 45W',
    so: 'Android 14'
  },
  'REALME C85': {
    procesador: 'Snapdragon 6 Gen 1 / Helio G100',
    camaras: 'Trasera 50MP OIS, Frontal 16MP',
    pantalla: '6.7" AMOLED 120Hz Curved',
    bateria: '5000 mAh, 67W Charging',
    so: 'Android 15 (Realme UI 6.0)'
  },
  'REALME GT7': {
    procesador: 'Qualcomm Snapdragon 8 Elite (3 nm)',
    camaras: 'Trasera 50MP IMX906 + 50MP Periscope 3x + 8MP, Frontal 16MP',
    pantalla: '6.78" LTPO AMOLED, 120Hz, 6000 nits peak',
    bateria: '6500 mAh, HyperCharge 120W',
    so: 'Realme UI 6.0 (Android 15)'
  },
  'REALME NOTE 60': {
    procesador: 'Unisoc T612 Superior Efficiency',
    camaras: 'Trasera 13MP / 50MP AI, Frontal 5MP',
    pantalla: '6.74" 90Hz Eye Comfort Display',
    bateria: '5000 mAh, 10W Charging',
    so: 'Realme UI Lite Edition'
  },
  'REALME NOTE 70': {
    procesador: 'MediaTek Helio G85',
    camaras: 'Trasera 50MP AI Dual, Frontal 8MP',
    pantalla: '6.74" 90Hz High Brightness Display',
    bateria: '5000 mAh, 18W Fast Charge',
    so: 'Android 14 (Realme UI)'
  }
};

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    
    const products = await Product.find({ category: 'realme' });
    console.log(`Enriching ${products.length} Realme products...`);

    let count = 0;
    for (const p of products) {
      const upperName = p.name.toUpperCase();
      let matchedKey = null;

      if (upperName.includes('GT7')) matchedKey = 'REALME GT7';
      else if (upperName.includes('REALME 14')) matchedKey = 'REALME 14';
      else if (upperName.includes('C71')) matchedKey = 'REALME C71';
      else if (upperName.includes('C75')) matchedKey = 'REALME C75';
      else if (upperName.includes('C85')) matchedKey = 'REALME C85';
      else if (upperName.includes('NOTE 60')) matchedKey = 'REALME NOTE 60';
      else if (upperName.includes('NOTE 70')) matchedKey = 'REALME NOTE 70';

      if (matchedKey) {
        const base = SPECS_DATABASE[matchedKey];
        
        let ram = '4 GB';
        let storage = '128 GB';
        
        const ramMatch = upperName.match(/(\d+)(GB)?RAM/);
        const slashMatch = upperName.match(/(\d+)\/(\d+)GB/);
        const joinedMatch = upperName.match(/(\d{1,2})(\d{3})GB/);

        if (slashMatch) {
            ram = slashMatch[1] + ' GB';
            storage = slashMatch[2] + ' GB';
        } else if (joinedMatch) {
            ram = joinedMatch[1] + ' GB';
            storage = joinedMatch[2] + ' GB';
        } else if (ramMatch) {
            ram = ramMatch[1] + ' GB';
        }

        const specifications = [
          { label: 'Procesador', value: base.procesador },
          { label: 'Memoria RAM', value: ram },
          { label: 'Almacenamiento', value: storage },
          { label: 'Cámara(s)', value: base.camaras },
          { label: 'Pantalla', value: base.pantalla },
          { label: 'Batería y Carga', value: base.bateria },
          { label: 'Sistema Operativo', value: base.so },
          { label: 'Marca', value: 'Realme' }
        ];

        await Product.updateOne({ _id: p._id }, { $set: { specifications } });
        console.log(`Updated: ${p.name} -> ${matchedKey}`);
        count++;
      }
    }

    console.log(`Done. Updated ${count} Realme products.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

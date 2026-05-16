
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const motorolaSpecs = {
  'G86': {
    processor: 'MediaTek Dimensity 7300 (4nm) Octa-core hasta 2.5GHz',
    dimensions: '161.9 x 73.1 x 7.6 mm | 175g',
    display: 'pOLED de 6.67" FHD+ (2400 x 1080), 120Hz, 1600 nits',
    rearCamera: '50MP (Principal, OIS) + 8MP (Ultra Gran Angular / Macro)',
    frontCamera: '32MP f/2.4',
    battery: '5200 mAh | Carga rápida TurboPower 30W',
    iaFeatures: 'Moto AI: Edición mágica, optimización de escena y traducción en tiempo real',
    security: 'Lector de huellas bajo pantalla | Desbloqueo facial',
    connectivity: '5G, Wi-Fi 6, Bluetooth 5.3, SIM Dual',
    resistance: 'Resistencia al agua y polvo IP54',
    nfc: 'Sí (según región)',
    navigation: 'GPS, GLONASS, GALILEO, Beidou',
    audio: 'Altavoces estéreo con Dolby Atmos',
    sensors: 'Acelerómetro, Giroscopio, Proximidad, Luz ambiental, Brújula',
    os: 'Android 15 con My UX'
  },
  'G56': {
    processor: 'MediaTek Dimensity 7060 (6nm) Octa-core',
    dimensions: '165.2 x 75.8 x 8.2 mm',
    display: 'IPS LCD de 6.72" FHD+ (2400 x 1080), 120Hz',
    rearCamera: '50MP (Principal) + 8MP (Ultra Gran Angular)',
    frontCamera: '32MP',
    battery: '5200 mAh | Carga rápida 30W',
    iaFeatures: 'Optimización de imagen mediante IA',
    security: 'Lector de huellas lateral | Desbloqueo facial',
    connectivity: '5G, Wi-Fi 5, Bluetooth 5.3',
    resistance: 'Protección contra salpicaduras (Repelente al agua)',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS, GALILEO',
    audio: 'Altavoces estéreo con Dolby Atmos',
    sensors: 'Acelerómetro, Giroscopio, Proximidad, Luz ambiental, Brújula',
    os: 'Android 15'
  },
  'G35': {
    processor: 'UNISOC T760 (6nm) 5G Octa-core hasta 2.2GHz',
    dimensions: '166.3 x 76.0 x 8.0 mm',
    display: 'IPS LCD de 6.72" FHD+, 120Hz, 1000 nits (HBM)',
    rearCamera: '50MP (Principal) + 8MP (Ultra Gran Angular)',
    frontCamera: '16MP',
    battery: '5000 mAh | Carga de 18W',
    iaFeatures: 'Mejora de fotos con IA',
    security: 'Lector de huellas lateral',
    connectivity: '5G, Wi-Fi 5, Bluetooth 5.1',
    resistance: 'Resistencia a salpicaduras IP52',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS, GALILEO',
    audio: 'Altavoces estéreo con Dolby Atmos',
    sensors: 'Acelerómetro, Giroscopio, Proximidad, Luz ambiental',
    os: 'Android 14 (actualizable)'
  },
  'G15': {
    processor: 'MediaTek Helio G81 Octa-core hasta 2.0GHz',
    dimensions: '167.1 x 76.5 x 8.1 mm',
    display: 'IPS LCD de 6.72" HD+, 90Hz',
    rearCamera: '50MP (Principal) + 2MP (Macro)',
    frontCamera: '8MP',
    battery: '5200 mAh | Carga de 18W',
    iaFeatures: 'Retoque de retratos básico',
    security: 'Lector de huellas lateral',
    connectivity: '4G LTE, Wi-Fi 5, Bluetooth 5.1',
    resistance: 'Repelente al agua',
    nfc: 'No',
    navigation: 'GPS, GLONASS, GALILEO',
    audio: 'Dolby Atmos',
    sensors: 'Acelerómetro, Giroscopio, Proximidad',
    os: 'Android 14'
  },
  'G05': {
    processor: 'MediaTek Helio G81 Extreme Octa-core',
    dimensions: '166.5 x 76.2 x 8.1 mm',
    display: 'IPS LCD de 6.67" HD+, 90Hz',
    rearCamera: '50MP (Principal) + 2MP (Macro)',
    frontCamera: '8MP',
    battery: '5200 mAh | Carga de 18W',
    iaFeatures: 'Optimización de batería por IA',
    security: 'Lector de huellas lateral',
    connectivity: '4G LTE, Wi-Fi 5, Bluetooth 5.1',
    resistance: 'Básica',
    nfc: 'No',
    navigation: 'GPS, GLONASS',
    audio: 'Dolby Atmos',
    sensors: 'Acelerómetro, Proximidad',
    os: 'Android 14 Go Edition'
  },
  'G06': {
    processor: 'MediaTek Helio G81 Extreme Octa-core',
    dimensions: '171.2 x 78.8 x 8.2 mm',
    display: 'IPS LCD de 6.88" HD+, 120Hz',
    rearCamera: '50MP (Principal) + 2MP (Macro)',
    frontCamera: '8MP',
    battery: '5200 mAh | Carga de 10W',
    iaFeatures: 'N/A',
    security: 'Lector de huellas lateral',
    connectivity: '4G LTE, Wi-Fi 5, Bluetooth 5.1',
    resistance: 'Básica',
    nfc: 'No',
    navigation: 'GPS, GLONASS',
    audio: 'Dolby Atmos',
    sensors: 'Acelerómetro, Proximidad',
    os: 'Android 14 Go Edition'
  },
  'E15': {
    processor: 'MediaTek Helio G81 Extreme Octa-core',
    dimensions: '166.5 x 76.2 x 8.1 mm',
    display: 'IPS LCD de 6.67" HD+, 90Hz',
    rearCamera: '32MP (Principal)',
    frontCamera: '8MP',
    battery: '5200 mAh | Carga de 18W',
    iaFeatures: 'Básica',
    security: 'Lector de huellas lateral',
    connectivity: '4G LTE, Wi-Fi 5',
    resistance: 'Básica',
    nfc: 'No',
    navigation: 'GPS, GLONASS',
    audio: 'Dolby Atmos',
    sensors: 'Acelerómetro, Proximidad',
    os: 'Android 14 Go Edition'
  }
};

async function enrichMotorola() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const products = await Product.find({ category: 'motorola' });
    console.log(`Found ${products.length} Motorola products.`);

    let updatedCount = 0;

    for (const prod of products) {
      const nameUpper = prod.name.toUpperCase();
      let matchedModel = null;
      let modelKey = null;

      // Find identifying key
      for (const key of Object.keys(motorolaSpecs)) {
        if (nameUpper.includes(`G${key}`) || nameUpper.includes(`E${key}`) || nameUpper.includes(` ${key} `)) {
           // Refine check for exact model
           if (nameUpper.includes(` ${key} `) || nameUpper.includes(` ${key}-`) || nameUpper.endsWith(` ${key}`)) {
             modelKey = key;
             break;
           }
        }
      }

      // Special handling for G86, G56 etc if they don't have spaces
      if (!modelKey) {
        if (nameUpper.includes('G86')) modelKey = 'G86';
        else if (nameUpper.includes('G56')) modelKey = 'G56';
        else if (nameUpper.includes('G35')) modelKey = 'G35';
        else if (nameUpper.includes('G15')) modelKey = 'G15';
        else if (nameUpper.includes('G05')) modelKey = 'G05';
        else if (nameUpper.includes('G06')) modelKey = 'G06';
        else if (nameUpper.includes('E15')) modelKey = 'E15';
      }

      if (modelKey && motorolaSpecs[modelKey]) {
        const spec = motorolaSpecs[modelKey];
        
        // Dynamic RAM/Storage detection
        let dynamicStorage = 'Consulte';
        let dynamicRam = 'Consulte';

        // Try standard "128GB 6RAM" or "64GB2RAM"
        const storageMatch = nameUpper.match(/(\d+)\s*GB/);
        const ramMatch = nameUpper.match(/(\d+)\s*R?AM/);

        if (storageMatch) dynamicStorage = `${storageMatch[1]} GB`;
        if (ramMatch) dynamicRam = `${ramMatch[1]} GB`;

        // Handle "64GB2RAM" specific case
        const combinedMatch = nameUpper.match(/(\d+)GB(\d+)RAM/);
        if (combinedMatch) {
          dynamicStorage = `${combinedMatch[1]} GB`;
          dynamicRam = `${combinedMatch[2]} GB`;
        }

        const finalSpecs = [
          { label: 'Procesador', value: spec.processor },
          { label: 'Almacenamiento', value: dynamicStorage },
          { label: 'Memoria RAM', value: dynamicRam },
          { label: 'Dimensiones', value: spec.dimensions },
          { label: 'Pantalla', value: spec.display },
          { label: 'Cámara trasera', value: spec.rearCamera },
          { label: 'Cámara frontal', value: spec.frontCamera },
          { label: 'Batería y carga', value: spec.battery },
          { label: 'Funciones de IA', value: spec.iaFeatures },
          { label: 'Seguridad', value: spec.security },
          { label: 'Redes y conectividad', value: spec.connectivity },
          { label: 'Resistencias', value: spec.resistance },
          { label: 'NFC', value: spec.nfc },
          { label: 'Navegación', value: spec.navigation },
          { label: 'Audio', value: spec.audio },
          { label: 'Sensores', value: spec.sensors },
          { label: 'Sistema operativo', value: spec.os }
        ];

        await Product.updateOne(
          { _id: prod._id },
          { $set: { specifications: finalSpecs } }
        );
        updatedCount++;
        console.log(`Updated: ${prod.name}`);
      } else {
        console.warn(`No spec found for: ${prod.name}`);
      }
    }

    console.log(`Successfully enriched ${updatedCount} Motorola products.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

enrichMotorola();

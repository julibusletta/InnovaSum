
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const samsungSpecs = {
  'A56': {
    processor: 'Samsung Exynos 1580 (4nm) Octa-core hasta 2.9GHz',
    dimensions: '161.7 x 77.4 x 8.2 mm | 213g',
    display: 'Super AMOLED de 6.6" FHD+, 120Hz, 1000 nits (HBM), Vision Booster',
    rearCamera: '50MP (OIS) + 12MP (Ultra Gran Angular) + 5MP (Macro)',
    frontCamera: '12MP f/2.2',
    battery: '5000 mAh | Carga rápida de 45W',
    iaFeatures: 'Galaxy AI: Rodea para buscar, Asistente de notas, Traducción en vivo',
    security: 'Sensor de huellas en pantalla | Samsung Knox Vault',
    connectivity: '5G, Wi-Fi 6, Bluetooth 5.3, SIM Dual / eSIM',
    resistance: 'Resistencia al agua y polvo IP67',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS, GALILEO, Beidou, QZSS',
    audio: 'Altavoces estéreo con Dolby Atmos',
    sensors: 'Acelerómetro, Giroscopio, Geomagnético, Hall, Luz, Proximidad virtual',
    os: 'Android 15 con One UI 7.0 (Soporte por 6 años)'
  },
  'A36': {
    processor: 'Qualcomm Snapdragon 6 Gen 3 Octa-core',
    dimensions: '161.7 x 78.0 x 8.2 mm',
    display: 'Super AMOLED de 6.6" FHD+, 120Hz, 1000 nits',
    rearCamera: '50MP (OIS) + 8MP (Ultra Gran Angular) + 5MP (Macro)',
    frontCamera: '13MP',
    battery: '5000 mAh | Carga rápida de 45W',
    iaFeatures: 'Galaxy AI: Rodea para buscar, Sugerencia de edición',
    security: 'Sensor de huellas en pantalla | Samsung Knox',
    connectivity: '5G, Wi-Fi 6, Bluetooth 5.3',
    resistance: 'Resistencia al agua y polvo IP67',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS, GALILEO, Beidou',
    audio: 'Altavoces estéreo con Dolby Atmos',
    sensors: 'Acelerómetro, Giroscopio, Geomagnético, Hall, Luz, Proximidad virtual',
    os: 'Android 15 con One UI 7.0 (Soporte por 6 años)'
  },
  'A26': {
    processor: 'Samsung Exynos 1380 (5nm) Octa-core hasta 2.4GHz',
    dimensions: '161.0 x 76.5 x 8.3 mm',
    display: 'Super AMOLED de 6.5" FHD+, 120Hz, 1000 nits',
    rearCamera: '50MP (OIS) + 8MP (Ultra Gran Angular) + 2MP (Macro)',
    frontCamera: '13MP',
    battery: '5000 mAh | Carga rápida de 25W',
    iaFeatures: 'Mejora de imagen automática',
    security: 'Sensor de huellas en pantalla | Samsung Knox',
    connectivity: '5G, Wi-Fi 5, Bluetooth 5.3',
    resistance: 'Resistencia al agua y polvo IP67',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS, GALILEO, Beidou',
    audio: 'Altavoces estéreo con Dolby Atmos',
    sensors: 'Acelerómetro, Giroscopio, Geomagnético, Sensor de luz, Proximidad virtual',
    os: 'Android 15 con One UI 7.0'
  },
  'A07': {
    processor: 'MediaTek Helio G85 Octa-core hasta 2.0GHz',
    dimensions: '167.3 x 77.3 x 8.0 mm',
    display: 'PLS LCD de 6.7" HD+ (1600 x 720), 90Hz',
    rearCamera: '50MP (Principal) + 2MP (Profundidad)',
    frontCamera: '8MP',
    battery: '5000 mAh | Carga rápida de 25W',
    iaFeatures: 'Optimizador de escenas básico',
    security: 'Lector de huellas lateral | Desbloqueo facial',
    connectivity: '4G LTE, Wi-Fi 5, Bluetooth 5.3',
    resistance: 'Básica',
    nfc: 'No',
    navigation: 'GPS, GLONASS, GALILEO, Beidou',
    audio: 'Jack de 3.5mm | Dolby Atmos',
    sensors: 'Acelerómetro, Sensor de luz, Sensor de proximidad',
    os: 'Android 15 con One UI 6.1 (Core Edition)'
  },
  'A06': {
    processor: 'MediaTek Helio G85 Octa-core hasta 2.0GHz',
    dimensions: '167.3 x 77.3 x 8.0 mm',
    display: 'PLS LCD de 6.7" HD+ (1600 x 720), 60Hz',
    rearCamera: '50MP (Principal) + 2MP (Profundidad)',
    frontCamera: '8MP',
    battery: '5000 mAh | Carga rápida de 25W',
    iaFeatures: 'N/A',
    security: 'Lector de huellas lateral | Desbloqueo facial',
    connectivity: '4G LTE, Wi-Fi 5, Bluetooth 5.3',
    resistance: 'Básica',
    nfc: 'No',
    navigation: 'GPS, GLONASS, GALILEO, Beidou',
    audio: 'Jack de 3.5mm',
    sensors: 'Acelerómetro, Sensor de luz, Sensor de proximidad',
    os: 'Android 14 con One UI 6.1'
  },
  'TAB A11': {
    processor: 'MediaTek Helio G99 / Unisoc T616 (Octa-core)',
    dimensions: '257.1 x 168.7 x 6.9 mm',
    display: 'LCD de 11.0" WUXGA (1920 x 1200), 90Hz',
    rearCamera: '8MP Autofocus',
    frontCamera: '5MP',
    battery: '7040 mAh | Carga de 15W',
    iaFeatures: 'Multitarea inteligente',
    security: 'Reconocimiento facial',
    connectivity: 'Wi-Fi 5, Bluetooth 5.3 (Modelo SM-X135 soporta 4G LTE)',
    resistance: 'N/A',
    nfc: 'No',
    navigation: 'GPS, GLONASS, Beidou',
    audio: 'Cuatro altavoces con Dolby Atmos',
    sensors: 'Acelerómetro, Giroscopio, Geomagnético, Sensor Hall, Sensor de luz',
    os: 'Android 14 con One UI 6.0'
  }
};

async function enrichSamsung() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const products = await Product.find({ category: 'samsung' });
    console.log(`Found ${products.length} Samsung products.`);

    let updatedCount = 0;

    for (const prod of products) {
      const nameUpper = prod.name.toUpperCase();
      let modelKey = null;

      // Model Matching
      if (nameUpper.includes('TAB A11')) modelKey = 'TAB A11';
      else if (nameUpper.includes('A56')) modelKey = 'A56';
      else if (nameUpper.includes('A36')) modelKey = 'A36';
      else if (nameUpper.includes('A26')) modelKey = 'A26';
      else if (nameUpper.includes('A07')) modelKey = 'A07';
      else if (nameUpper.includes('A06')) modelKey = 'A06';

      if (modelKey && samsungSpecs[modelKey]) {
        const spec = samsungSpecs[modelKey];
        
        // RAM/Storage Detection
        let dynamicStorage = 'Consulte';
        let dynamicRam = 'Consulte';

        // Samsung special pattern: 12256GB -> 12 RAM, 256 Storage
        // Or 8256GB -> 8 RAM, 256 Storage
        const samsungPat = nameUpper.match(/(\d{1,2})(\d{3})GB/);
        if (samsungPat) {
          dynamicRam = `${samsungPat[1]} GB`;
          dynamicStorage = `${samsungPat[2]} GB`;
        } else {
          // Fallback to standard
          const storageMatch = nameUpper.match(/(\d+)\s*GB/);
          const ramMatch = nameUpper.match(/(\d+)\s*R?AM/);
          if (storageMatch) dynamicStorage = `${storageMatch[1]} GB`;
          if (ramMatch) dynamicRam = `${ramMatch[1]} GB`;
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
          { label: 'Resistencia', value: spec.resistance },
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

    console.log(`Successfully enriched ${updatedCount} Samsung products.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

enrichSamsung();

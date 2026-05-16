
import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const SPECS_DATABASE = {
  // NOTE 14 Series
  'NOTE 14': {
    processor: 'MediaTek Dimensity 7025-Ultra (6nm)',
    display: '6.67" AMOLED, 120Hz, 2100 nits (peak)',
    dimensions: '161.9 x 74.1 x 7.6 mm',
    rearCamera: '50MP (Sony IMX882, OIS) + 2MP (Depth)',
    frontCamera: '20MP',
    battery: '5110 mAh, Carga rápida 45W',
    security: 'Sensor de huellas en pantalla, Face Unlock',
    connectivity: '5G, Wi-Fi 6, Bluetooth 5.3',
    resistance: 'IP64 (Polvo y salpicaduras)',
    nfc: 'Sí (según región)',
    navigation: 'GPS, GLONASS, GALILEO, BDS',
    audio: 'Altavoces estéreo, Hi-Res Audio',
    sensors: 'Proximidad, Luz ambiental, Acelerómetro, Brújula, Giroscopio',
    os: 'Xiaomi HyperOS (Android 14/15)',
    ia: 'AI Camera, AI Portrait, AI Face Unlock'
  },
  'NOTE 14 PRO': {
    processor: 'MediaTek Dimensity 7300-Ultra / Snapdragon 7s Gen 3',
    display: '6.67" AMOLED 1.5K, 120Hz, HDR10+, Dolby Vision',
    dimensions: '161.4 x 74.3 x 8.3 mm',
    rearCamera: '50MP (OIS) + 8MP (Ultra-wide) + 2MP (Macro)',
    frontCamera: '20MP',
    battery: '5500 mAh, Carga rápida 45W',
    security: 'Sensor de huellas en pantalla, IP68/IP69K',
    connectivity: '5G, Wi-Fi 6, Bluetooth 5.4',
    resistance: 'IP68/IP69K (Agua y polvo)',
    nfc: 'Sí',
    navigation: 'L1+L5 GPS, GLONASS, Galileo, Beidou',
    audio: 'Altavoces duales estéreo, Dolby Atmos',
    sensors: 'Giroscopio, Acelerómetro, Infrarrojos, Luz ambiental',
    os: 'Xiaomi HyperOS',
    ia: 'AI Image Engine 2.0, AI Noise Cancellation'
  },
  'NOTE 14 PRO+': {
    processor: 'Snapdragon 7s Gen 3 (4nm)',
    display: '6.67" AMOLED 1.5K Curva, 120Hz, 3000 nits (peak)',
    dimensions: '162.3 x 74.4 x 8.5 mm',
    rearCamera: '50MP (Light Fusion 800, OIS) + 50MP (Teleobjetivo) + 8MP (Ultra-wide)',
    frontCamera: '20MP',
    battery: '6200 mAh, HyperCharge 90W',
    security: 'Huella en pantalla, Reconocimiento facial IA',
    connectivity: '5G, Wi-Fi 6, Bluetooth 5.4, Infrarrojos',
    resistance: 'IP68/IP69K (Súper resistencia)',
    nfc: 'Sí',
    navigation: 'Multibanda GPS (L1+L5), Galileo, GLONASS',
    audio: 'Triple micrófono, Altavoces estéreo Hi-Res',
    sensors: 'Todos los sensores estándar + Barómetro',
    os: 'Xiaomi HyperOS 2.0',
    ia: 'AI Smart Charging, AI Photo Editing, AI Translation'
  },
  'NOTE 14S': {
    processor: 'MediaTek Helio G99-Ultra',
    display: '6.67" AMOLED, 120Hz, 1300 nits',
    dimensions: '161.1 x 74.9 x 7.9 mm',
    rearCamera: '108MP (Principal) + 8MP (Ultra-wide) + 2MP (Macro)',
    frontCamera: '16MP',
    battery: '5000 mAh, Carga rápida 33W',
    security: 'Sensor de huellas lateral',
    connectivity: '4G LTE, Wi-Fi 5, Bluetooth 5.2',
    resistance: 'IP54',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS, Euro Galileo',
    audio: 'Doble altavoz estéreo, Jack 3.5mm',
    sensors: 'Brújula, Gravedad, Giroscopio, Proximidad',
    os: 'MIUI 14 / HyperOS',
    ia: 'AI Beauty, AI Scene Detection'
  },
  // NOTE 15 Series
  'NOTE 15': {
    processor: 'Snapdragon 6 Gen 3 (4nm)',
    display: '6.77" AMOLED, 120Hz, 1.5K, 3200 nits (peak)',
    dimensions: '162.5 x 75.2 x 7.8 mm',
    rearCamera: '108MP (Dual ISO) + 2MP (Depth)',
    frontCamera: '20MP',
    battery: '5520 mAh (Silicio-Carbono), 45W',
    security: 'Huella en pantalla (Gen 5)',
    connectivity: '5G, Wi-Fi 6, Bluetooth 5.4, IR Blaster',
    resistance: 'IP66 (Titan Durability)',
    nfc: 'Sí',
    navigation: 'L1 GPS, Galileo, BeiDou',
    audio: 'Altavoces estéreo Duales',
    sensors: 'Giroscopio de hardware, Acelerómetro',
    os: 'Xiaomi HyperOS 2 (Android 15)',
    ia: 'AI Portrait, AI Eraser pro, AI Live Translation'
  },
  'NOTE 15 PRO': {
    processor: 'Snapdragon 7s Gen 4 (4nm)',
    display: '6.83" AMOLED, 120Hz, 12-bit color, HDR10+',
    dimensions: '162.3 x 74.8 x 8.1 mm',
    rearCamera: '200MP (OIS, Samsung HP3) + 8MP (UW) + 2MP (Macro)',
    frontCamera: '32MP',
    battery: '6580 mAh (Silicio-Carbono), 45W',
    security: 'IP68/IP69K, Huella ultra-rápida',
    connectivity: '5G, Wi-Fi 7 Ready, Bluetooth 5.4',
    resistance: 'IP68/IP69K (Sumergible 2m)',
    nfc: 'Sí (Xiaomi Pay)',
    navigation: 'L1+L5 Multibanda GPS',
    audio: 'Dolby Atmos, Altavoces simétricos',
    sensors: 'Completo incluyendo sensor espectral',
    os: 'Xiaomi HyperOS 2',
    ia: 'AI Image Expansion, AI Voice Assistant'
  },
  'NOTE 15 PRO+': {
    processor: 'MediaTek Dimensity 8400-Ultra (3nm)',
    display: '6.83" AMOLED Curva Pro, 144Hz, DC Dimming',
    dimensions: '162.1 x 74.6 x 8.4 mm',
    rearCamera: '200MP (Pro-OIS) + 50MP (Tele) + 12MP (UW)',
    frontCamera: '32MP Pro',
    battery: '6500 mAh, HyperCharge 100W',
    security: 'Bio-seguridad avanzada, IP69K',
    connectivity: '5G, Wi-Fi 7, Bluetooth 5.5',
    resistance: 'IP68/IP69K Resistente a alta presión',
    nfc: 'Sí (NFC 3.0)',
    navigation: 'GPS (L1+L5), NavIC, Galileo',
    audio: 'Hi-Fi Audio, Dual Speakers Bose Tuned',
    sensors: 'Sensor de parpadeo, Barómetro, Giroscopio',
    os: 'Xiaomi HyperOS 2.1',
    ia: 'Generative AI Photo, AI Video Enhancement'
  },
  // POCO X/F
  'POCO X7 PRO': {
    processor: 'Snapdragon 7+ Gen 3 / Dimensity 8300-Ultra',
    display: '6.67" Flow AMOLED 1.5K, 120Hz, 1800 nits',
    dimensions: '160.5 x 74.3 x 8.1 mm',
    rearCamera: '64MP (OIS) + 8MP (UW) + 2MP (Macro)',
    frontCamera: '16MP',
    battery: '5000 mAh, Carga turbo 67W',
    security: 'Sensor de huellas en pantalla',
    connectivity: '5G, Wi-Fi 6, Bluetooth 5.4',
    resistance: 'IP54',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS, Beidou',
    audio: 'Altavoces duales, Dolby Atmos',
    sensors: 'Infrarrojos, Motor lineal eje X',
    os: 'HyperOS',
    ia: 'WildBoost Optimization 2.0'
  },
  'POCO X8 PRO': {
    processor: 'MediaTek Dimensity 8500-Ultra',
    display: '6.59" 1.5K AMOLED, 120Hz, 3500 nits',
    dimensions: '161.0 x 74.5 x 7.9 mm',
    rearCamera: '50MP (OIS) + 8MP (UW) + 2MP (Macro)',
    frontCamera: '20MP',
    battery: '6500 mAh, 100W HyperCharge',
    security: 'Huella en pantalla, IP68',
    connectivity: '5G, Wi-Fi 7, Bluetooth 5.4',
    resistance: 'IP68/IP69K',
    nfc: 'Sí',
    navigation: 'Tri-band GPS',
    audio: 'Bose Audio, Dual Speakers',
    sensors: 'Giroscopio, Acelerómetro, E-Compass',
    os: 'HyperOS 2.0',
    ia: 'AI Ray Tracing Engine, AI Battery Management'
  },
  'POCO X8 PRO MAX': {
    processor: 'MediaTek Dimensity 9500s (3nm)',
    display: '6.83" 1.5K AMOLED, 120Hz, 3500 nits',
    dimensions: '162.5 x 75.0 x 8.3 mm',
    rearCamera: '50MP (1-inch equivalent) + 50MP (Tele) + 12MP (UW)',
    frontCamera: '32MP',
    battery: '8500 mAh, 120W HyperCharge',
    security: 'Huella ultrasónica, IP69K',
    connectivity: '5G SA/NSA, Wi-Fi 7, Bluetooth 5.5',
    resistance: 'IP68/IP69K',
    nfc: 'Sí',
    navigation: 'Dual GPS, Galileo, NavIC',
    audio: 'Quad Speakers Bose, High-Res Wireless',
    sensors: 'Barómetro, Sensor de Color, IR',
    os: 'HyperOS 2.5',
    ia: 'Advanced Generative AI, AI Frame Boost'
  },
  'POCO F7': {
    processor: 'Snapdragon 8s Gen 3',
    display: '6.67" Flow AMOLED 1.5K, 120Hz, 2400 nits',
    dimensions: '160.5 x 74.4 x 7.8 mm',
    rearCamera: '50MP (Sony LYT-600, OIS) + 8MP (UW)',
    frontCamera: '20MP',
    battery: '5000 mAh, 90W HyperCharge',
    security: 'Huella en pantalla óptica',
    connectivity: '5G, Wi-Fi 6E, Bluetooth 5.4',
    resistance: 'IP64',
    nfc: 'Sí',
    navigation: 'L1+L5 Dual GPS',
    audio: 'Stereo Speakers, Hi-Res',
    sensors: 'Infrarrojos, Motor vibración flagship',
    os: 'HyperOS',
    ia: 'AI Game Turbo, AI Smart Portat'
  },
  'POCO F8 PRO': {
    processor: 'Snapdragon 8 Elite (Gen 5 Performance)',
    display: '6.67" WQHD+ AMOLED, 120Hz, Pro-Motion',
    dimensions: '160.8 x 74.2 x 8.2 mm',
    rearCamera: '50MP (LYT-808, OIS) + 50MP (UW) + 50MP (Tele)',
    frontCamera: '32MP',
    battery: '6000 mAh, 120W Wired, 50W Wireless',
    security: 'Huella en pantalla, Reconocimiento 3D',
    connectivity: '5G, Wi-Fi 7, Bluetooth 5.5',
    resistance: 'IP68',
    nfc: 'Sí',
    navigation: 'Penta-band GPS',
    audio: 'Bose Sound with Subwoofer',
    sensors: 'Completo + Sensor de temperatura',
    os: 'HyperOS 2',
    ia: 'AI Super Resolution, AI Multi-tasking'
  },
  'POCO F8 ULTRA': {
    processor: 'Snapdragon 8 Elite Special Edition',
    display: '6.9" 1.5K LTPO AMOLED, 144Hz, 4000 nits',
    dimensions: '163.5 x 76.2 x 8.4 mm',
    rearCamera: '50MP (1-inch) + 50MP (Periscosopio 5x) + 50MP (UW)',
    frontCamera: '32MP Under-display',
    battery: '6500 mAh, 120W Wired, 80W Wireless',
    security: 'Huella Ultrasónica, IP69K',
    connectivity: '5G Advanced, Wi-Fi 7+, BT 5.6',
    resistance: 'IP69K (Grado militar)',
    nfc: 'Sí',
    navigation: 'L1+L2+L5 GPS',
    audio: 'Cinematic Bose Audio System',
    sensors: 'ToF sensor, Espectrómetro, Barómetro',
    os: 'HyperOS 2 Pro',
    ia: 'Full Suite AI (Magic Eraser, Video Boost, AI Search)'
  },
  // REDMI Series
  'REDMI 15': {
    processor: 'Snapdragon 685 (6nm)',
    display: '6.9" IPS LCD, 120Hz, FHD+',
    dimensions: '168.6 x 76.3 x 8.2 mm',
    rearCamera: '50MP (Principal) + 2MP (Macro)',
    frontCamera: '13MP',
    battery: '5030 mAh, 33W',
    security: 'Huella lateral',
    connectivity: '4G LTE, WiFi 5, BT 5.1',
    resistance: 'IP53',
    nfc: 'Sí (según región)',
    navigation: 'GPS, GLONASS, Galileo',
    audio: 'Altavoz, Jack 3.5mm',
    sensors: 'Acelerómetro, Brújula',
    os: 'Xiaomi HyperOS 2',
    ia: 'AI Camera Beauty'
  },
  'REDMI 15C': {
    processor: 'MediaTek Dimensity 6100+ / Helio G81-Ultra',
    display: '6.88" HD+ LCD, 90Hz-120Hz',
    dimensions: '171.8 x 77.8 x 8.2 mm',
    rearCamera: '50MP AI Camera',
    frontCamera: '8MP',
    battery: '6000 mAh, 18W-33W',
    security: 'Huella lateral',
    connectivity: '4G/5G (según modelo), BT 5.3',
    resistance: 'IP54',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS, Galileo, BSD',
    audio: 'Jack 3.5mm, Mono altavoz fuerte',
    sensors: 'Luz, Proximidad virtual, Acelerómetro',
    os: 'Xiaomi HyperOS (Go/Standard)',
    ia: 'AI Night Mode'
  },
  'REDMI A5': {
    processor: 'MediaTek Helio G36 / G85',
    display: '6.71" HD+ LCD, 90Hz',
    dimensions: '168.4 x 76.3 x 8.3 mm',
    rearCamera: '13MP Main + 0.08MP Aux',
    frontCamera: '5MP',
    battery: '5000 mAh, 10W',
    security: 'Huella lateral / trasera',
    connectivity: '4G, WiFi 5, BT 5.0',
    resistance: 'No',
    nfc: 'No',
    navigation: 'GPS, GLONASS',
    audio: 'Jack 3.5mm',
    sensors: 'Acelerómetro',
    os: 'Android 14 (Go Edition) / HyperOS',
    ia: 'No'
  },
  'REDMI A7 PRO': {
    processor: 'MediaTek Dimensity 6300 / Snapdragon 4s Gen 2',
    display: '6.8" HD+ LCD, 120Hz',
    dimensions: '170.2 x 77.5 x 8.5 mm',
    rearCamera: '13MP Main + 2MP Depth',
    frontCamera: '8MP',
    battery: '6000 mAh, 18W-33W',
    security: 'Huella lateral',
    connectivity: '5G, WiFi 5, BT 5.3',
    resistance: 'IP54',
    nfc: 'Sí',
    navigation: 'GPS, Beidou, GLONASS',
    audio: 'Jack 3.5mm',
    sensors: 'Acelerómetro, Sensor de luz virtual',
    os: 'Xiaomi HyperOS 2 / 3',
    ia: 'AI Bokeh'
  },
  // POCO M
  'POCO M7 PRO': {
    processor: 'MediaTek Dimensity 7025-Ultra',
    display: '6.67" AMOLED, 120Hz, 1000 nits',
    dimensions: '161.1 x 75.0 x 7.7 mm',
    rearCamera: '50MP (OIS) + 2MP',
    frontCamera: '16MP',
    battery: '5110 mAh, 45W',
    security: 'Huella en pantalla',
    connectivity: '5G, WiFi 6, BT 5.3',
    resistance: 'IP54',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS',
    audio: 'Dual Altavoces',
    sensors: 'Completo estándar',
    os: 'HyperOS',
    ia: 'Varios filtros IA'
  },
  'POCO M8': {
    processor: 'Snapdragon 6 Gen 3',
    display: '6.7" AMOLED, 120Hz, 2400 nits',
    dimensions: '162.0 x 75.5 x 7.9 mm',
    rearCamera: '50MP (OIS) + 2MP',
    frontCamera: '20MP',
    battery: '5500 mAh, 45W',
    security: 'Huella en pantalla',
    connectivity: '5G, WiFi 6, BT 5.4',
    resistance: 'IP66',
    nfc: 'Sí',
    navigation: 'GPS, Galileo',
    audio: 'Doble altavoz',
    sensors: 'Giroscopio, IR',
    os: 'HyperOS 2',
    ia: 'AI Optimizer'
  },
  'POCO M8 PRO': {
    processor: 'Snapdragon 7s Gen 4',
    display: '6.8" 1.5K AMOLED, 120Hz',
    dimensions: '162.8 x 75.8 x 8.0 mm',
    rearCamera: '50MP (OIS) + 8MP (UW)',
    frontCamera: '32MP',
    battery: '6500 mAh, 100W',
    security: 'Huella en pantalla, IP68',
    connectivity: '5G, Wi-Fi 7, BT 5.4',
    resistance: 'IP68/IP69K',
    nfc: 'Sí',
    navigation: 'L1+L5 GPS',
    audio: 'Bose Audio Tuned',
    sensors: 'Completo flagship-light',
    os: 'HyperOS 2.1',
    ia: 'Full Camera AI'
  },
  'POCO C71': {
    processor: 'Unisoc T7250 / MediaTek G85',
    display: '6.88" HD+ LCD, 120Hz',
    dimensions: '171.1 x 77.8 x 8.3 mm',
    rearCamera: '32MP Main',
    frontCamera: '13MP',
    battery: '5200 mAh, 18W',
    security: 'Huella lateral',
    connectivity: '4G, WiFi 5, BT 5.2',
    resistance: 'No',
    nfc: 'No',
    navigation: 'GPS',
    audio: 'Mono, Jack 3.5mm',
    sensors: 'Acelerómetro',
    os: 'HyperOS',
    ia: 'Filtros básicos'
  },
  'POCO C85': {
    processor: 'MediaTek Helio G81-Ultra',
    display: '6.9" HD+ LCD, 120Hz',
    dimensions: '171.5 x 78.0 x 8.2 mm',
    rearCamera: '50MP AI Main',
    frontCamera: '8MP',
    battery: '6000 mAh, 33W',
    security: 'Huella lateral, IP64',
    connectivity: '4G, WiFi 5, BT 5.3',
    resistance: 'IP64',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS',
    audio: 'Altavoz potente, Jack 3.5mm',
    sensors: 'Luz ambiental virtual',
    os: 'HyperOS',
    ia: 'AI Cinema Mode'
  },
  'POCO X7': {
    processor: 'Snapdragon 7s Gen 2 / Gen 3',
    display: '6.67" AMOLED, 120Hz, 1.5K',
    dimensions: '161.5 x 74.5 x 8.0 mm',
    rearCamera: '64MP (OIS) + 8MP + 2MP',
    frontCamera: '16MP',
    battery: '5100 mAh, 67W',
    security: 'Huella en pantalla',
    connectivity: '5G, Wi-Fi 6',
    resistance: 'IP54',
    nfc: 'Sí',
    navigation: 'GPS',
    audio: 'Stereo',
    sensors: 'Infrarrojos',
    os: 'HyperOS',
    ia: 'AI Engine'
  },
  'POCO X8': {
    processor: 'MediaTek Dimensity 8500-Ultra (or equivalent 5G chipset)',
    display: '6.67" AMOLED, 120Hz, 1.5K, 3000 nits',
    dimensions: '161.0 x 74.5 x 7.9 mm',
    rearCamera: '50MP (OIS) + 8MP (UW) + 2MP (Macro)',
    frontCamera: '20MP',
    battery: '6500 mAh, 100W HyperCharge',
    security: 'Huella en pantalla, Reconocimiento facial',
    connectivity: '5G, Wi-Fi 6, Bluetooth 5.4',
    resistance: 'IP64/IP68 (Protección avanzada)',
    nfc: 'Sí',
    navigation: 'GPS, GLONASS, Galileo',
    audio: 'Dual Stereo Speakers',
    sensors: 'Giroscopio de hardware, Acelerómetro',
    os: 'HyperOS 2.0',
    ia: 'AI Camera, AI Optimizer'
  },
  'REDMI 14': {
    processor: 'MediaTek Dimensity 7025-Ultra (5G)',
    display: '6.88" IPS LCD, 120Hz, FHD+',
    dimensions: '168.0 x 76.5 x 8.1 mm',
    rearCamera: '50MP (Principal) + 2MP (Profundidad)',
    frontCamera: '13MP',
    battery: '5110 mAh, 33W-45W',
    security: 'Huella lateral',
    connectivity: '5G, WiFi 6, BT 5.3',
    resistance: 'IP64 (Polvo y salpicaduras)',
    nfc: 'Sí',
    navigation: 'GPS, Beidou, GLONASS',
    audio: 'Mono / Altavoces duales',
    sensors: 'Acelerómetro, Sensor de luz virtual',
    os: 'Xiaomi HyperOS (Android 15)',
    ia: 'AI Portrait Mode'
  },
};

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('DB Connected');

  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
    name: String,
    category: String,
    specifications: Array
  }, { strict: false }));

  const products = await Product.find({ category: 'xiaomi' });
  console.log(`Working on ${products.length} Xiaomi products...`);

  let count = 0;
  for (const p of products) {
    const nameUpper = p.name.toUpperCase();
    
    // Find the best match in our database
    let matchedBase = null;
    for (const base of Object.keys(SPECS_DATABASE)) {
       if (nameUpper.includes(base)) {
          if (!matchedBase || base.length > matchedBase.length) {
             matchedBase = base;
          }
       }
    }

    if (matchedBase) {
      const baseSpecs = SPECS_DATABASE[matchedBase];
      const ramMatch = p.name.match(/(\d+RAM|\d+\/\d+GB)/i);
      const storageMatch = p.name.match(/(\d+GB)/i);
      
      const ramValue = ramMatch ? ramMatch[0].toUpperCase() : 'Según variante';
      const storageValue = storageMatch ? storageMatch[0].toUpperCase() : 'Según variante';

      const enrichedSpecs = [
        { label: 'Procesador', value: baseSpecs.processor },
        { label: 'Almacenamiento y RAM', value: `${storageValue} / ${ramValue}` },
        { label: 'Dimensiones', value: baseSpecs.dimensions },
        { label: 'Pantalla', value: baseSpecs.display },
        { label: 'Cámara trasera', value: baseSpecs.rearCamera },
        { label: 'Cámara frontal', value: baseSpecs.frontCamera },
        { label: 'Batería y carga', value: baseSpecs.battery },
        { label: 'Funciones de IA', value: baseSpecs.ia },
        { label: 'Seguridad', value: baseSpecs.security },
        { label: 'Redes y conectividad', value: baseSpecs.connectivity },
        { label: 'Resistencias al agua y polvo', value: baseSpecs.resistance },
        { label: 'NFC', value: baseSpecs.nfc },
        { label: 'Navegación y posicionamiento', value: baseSpecs.navigation },
        { label: 'Audio', value: baseSpecs.audio },
        { label: 'Sensores', value: baseSpecs.sensors },
        { label: 'Sistema operativo', value: baseSpecs.os },
        { label: 'Marca', value: 'Xiaomi' },
        { label: 'Modelo', value: matchedBase }
      ];

      await Product.updateOne({ _id: p._id }, { $set: { specifications: enrichedSpecs } });
      count++;
    }
  }

  console.log(`Finished. Updated ${count} products.`);
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});

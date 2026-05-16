
import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const SPECS_DATABASE = {
  'ECHO SHOW 8': {
    type: 'show',
    display: '8.0" táctil HD (1280 x 800)',
    audio: '2 altavoces de 2.0" de neodimio con radiador de bajos pasivo (Audio Espacial)',
    camera: '13 MP con encuadre automático y cubierta integrada',
    connectivity: 'Wi-Fi de doble banda, Bluetooth, Zigbee + Matter + Thread',
    processor: 'Octa-Core con motor AZ2 Neural Edge',
    sensors: 'Movimiento (Ultrasonido), Luz ambiental',
    dimensions: '200 x 139 x 106 mm',
    privacy: 'Botón de apagado de micrófono y cámara, cubierta de cámara',
    generation: '3ra Generación (2023)',
    feature: 'Hub de Hogar Digital integrado'
  },
  'ECHO SHOW 5': {
    type: 'show',
    display: '5.5" táctil (960 x 480)',
    audio: '1 altavoz de 1.75" de gama completa',
    camera: '2 MP con cubierta integrada',
    connectivity: 'Wi-Fi de doble banda, Bluetooth, Matter',
    processor: 'MediaTek MT8169 B con motor AZ2 Neural Edge',
    sensors: 'Luz ambiental, Acelerómetro',
    dimensions: '147 x 82 x 91 mm',
    privacy: 'Botón de apagado de micrófono y cámara, cubierta de cámara',
    generation: '3ra Generación (2023)',
    feature: 'Control de música y hogar digital'
  },
  'ECHO DOT 5': {
    type: 'dot',
    audio: '1 altavoz de 1.73" de proyección frontal, alta definición',
    connectivity: 'Wi-Fi de doble banda, Bluetooth, Matter',
    sensors: 'Temperatura, Movimiento (Ultrasonido)',
    dimensions: '100 x 100 x 89 mm',
    privacy: 'Botón de apagado de micrófono',
    generation: '5ta Generación (2022)',
    feature: 'Sensor de temperatura y detección de movimiento',
    weight: '304 g'
  },
  'ECHO POP': {
    type: 'dot',
    audio: '1 altavoz de 1.95" de proyección frontal, sonido completo',
    connectivity: 'Wi-Fi de doble banda, Bluetooth, Matter',
    dimensions: '99 x 83 x 91 mm',
    privacy: 'Botón de apagado de micrófono',
    generation: '1ra Generación (2023)',
    feature: 'Diseño semi-esférico compacto',
    weight: '196 g'
  },
  'ECHO SPOT': {
    type: 'spot',
    display: '2.83" táctil (240 x 320) con cristal semicircular',
    audio: '1 altavoz de 1.73" de proyección frontal',
    connectivity: 'Wi-Fi de doble banda, Bluetooth, Matter',
    processor: 'MediaTek MT8519',
    sensors: 'Movimiento (Ultrasonido), Luz ambiental',
    dimensions: '113 x 103 x 111 mm',
    privacy: 'Botón de apagado de micrófono',
    generation: 'Modelo 2024',
    feature: 'Reloj inteligente personalizable con visuales dinámicos'
  },
  'FIRE TV STICK': {
    type: 'stick',
    resolution: 'Full HD (1080p a 60 fps)',
    processor: 'Quad-Core 1.7 GHz',
    storage: '8 GB internos',
    ram: '1 GB DDR4',
    connectivity: 'Wi-Fi 5 (802.11ac), Bluetooth 5.0 (BLE)',
    audio: 'Dolby Atmos, sonido envolvente 7.1',
    video: 'HDR10, HDR10+, HLG',
    remote: 'Control remoto por voz Alexa (3ra gen) con botones de TV',
    generation: '3ra Generación (HD)'
  },
  'FIRE TV STICK 4K': {
    type: 'stick',
    resolution: '4K Ultra HD (2160p a 60 fps)',
    processor: 'Quad-Core 1.7 GHz',
    storage: '8 GB internos',
    ram: '2 GB',
    connectivity: 'Wi-Fi 6 (802.11ax), Bluetooth 5.2 (BLE)',
    audio: 'Dolby Atmos, sonido envolvente 7.1',
    video: 'Dolby Vision, HDR10, HDR10+, HLG',
    remote: 'Control remoto por voz Alexa con botones de TV',
    generation: '2da Generación (2023)'
  },
  'FIRE TV STICK 4K MAX': {
    type: 'stick',
    resolution: '4K Ultra HD (2160p a 60 fps)',
    processor: 'Quad-Core 2.0 GHz',
    storage: '16 GB internos',
    ram: '2 GB',
    connectivity: 'Wi-Fi 6E (802.11ax), Bluetooth 5.2 (BLE)',
    audio: 'Dolby Atmos, sonido envolvente 7.1',
    video: 'Dolby Vision, HDR10, HDR10+, HLG',
    remote: 'Control remoto por voz Alexa con botones de TV',
    generation: '2da Generación (2023)',
    feature: 'Soporta Fondo Ambiental (Fire TV Ambient Experience)'
  }
};

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('DB Connected');

    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
      name: String,
      category: String,
      specifications: Array
    }, { strict: false }));

    const products = await Product.find({ category: 'amazon' });
    console.log(`Working on ${products.length} Amazon products...`);

    let count = 0;
    for (const p of products) {
      const nameUpper = p.name.toUpperCase();
      
      // Find the best match
      let matchedKey = null;
      for (const key of Object.keys(SPECS_DATABASE)) {
         if (nameUpper.includes(key)) {
            if (!matchedKey || key.length > matchedKey.length) {
               matchedKey = key;
            }
         }
      }

      if (matchedKey) {
        const specs = SPECS_DATABASE[matchedKey];
        let enrichedSpecs = [];

        if (specs.type === 'stick') {
          enrichedSpecs = [
            { label: 'Resolución máxima', value: specs.resolution },
            { label: 'Procesador', value: specs.processor },
            { label: 'Almacenamiento y RAM', value: `${specs.storage} / ${specs.ram}` },
            { label: 'Conectividad inalámbrica', value: specs.connectivity },
            { label: 'Audio compatible', value: specs.audio },
            { label: 'Formatos de video', value: specs.video },
            { label: 'Control remoto', value: specs.remote },
            { label: 'Generación', value: specs.generation },
            { label: 'Atributo destacado', value: specs.feature || 'Streaming de alta velocidad' },
            { label: 'Marca', value: 'Amazon' }
          ];
        } else {
          enrichedSpecs = [
            { label: 'Pantalla', value: specs.display || 'No tiene pantalla' },
            { label: 'Cámara', value: specs.camera || 'No tiene cámara' },
            { label: 'Audio', value: specs.audio },
            { label: 'Conectividad inalámbrica', value: specs.connectivity },
            { label: 'Procesador', value: specs.processor || 'Amazon AZ Neural Edge' },
            { label: 'Sensores', value: specs.sensors || 'No especificado' },
            { label: 'Dimensiones', value: specs.dimensions },
            { label: 'Privacidad', value: specs.privacy },
            { label: 'Generación', value: specs.generation },
            { label: 'Atributo destacado', value: specs.feature },
            { label: 'Marca', value: 'Amazon' }
          ];
        }

        await Product.updateOne({ _id: p._id }, { $set: { specifications: enrichedSpecs } });
        console.log(`Updated: ${p.name} -> ${matchedKey}`);
        count++;
      } else {
        console.log(`No match found for: ${p.name}`);
      }
    }

    console.log(`Finished. Updated ${count} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during enrichment:', error);
    process.exit(1);
  }
}

run();


import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const SPECS_DATABASE = {
  'X20 MAX': {
    suction: '8,000 Pa',
    mopping: 'Mopas giratorias dobles, elevación automática de 10 mm, brazo extensible de 40 mm para bordes, lavado con agua caliente y secado con aire caliente.',
    sensors: 'Navegación LDS LiDAR, luz estructurada 3D (evasión de obstáculos), detección ultrasónica de alfombras, sensores de bordes.',
    model: 'D109GL',
    dimensions: 'Φ350 x 97 mm',
    ratedPower: '55W',
    ratedVoltage: '14.4V⎓',
    chargingVoltage: '19.6V⎓',
    battery: '5,200 mAh (Nominal) / 4,800 mAh (Real)',
    weight: '3.9 kg (Robot)'
  },
  'X20 PRO': {
    suction: '7,000 Pa',
    mopping: 'Mopas dobles giratorias de alta velocidad, elevación automática sobre alfombras, lavado automático y secado con aire caliente en la base.',
    sensors: 'Navegación láser LDS, evasión de obstáculos con luz estructurada.',
    model: 'D102GL',
    dimensions: 'Φ350 x 97 mm',
    ratedPower: '55W',
    ratedVoltage: '14.4V⎓',
    chargingVoltage: '19.6V⎓',
    battery: '5,200 mAh',
    weight: '3.8 kg (Robot)'
  },
  'S20+': {
    suction: '6,000 Pa',
    mopping: 'Mopas rotativas duales, elevación inteligente de 7 mm al detectar alfombras.',
    sensors: 'Navegación LDS, detección ultrasónica de alfombras, sensores anticaída.',
    model: 'B108GL',
    dimensions: 'Φ350 × 97 mm',
    ratedPower: '55W',
    ratedVoltage: '14.4V⎓',
    chargingVoltage: '19.6V⎓',
    battery: '5,200 mAh (Nominal) / 4,800 mAh (Real)',
    weight: '3.8 kg'
  },
  'S20': {
    suction: '5,000 Pa',
    mopping: 'Tanque 2 en 1 (400ml polvo / 270ml agua), patrón de limpieza en forma de Y para simular fregado manual.',
    sensors: 'Navegación láser LDS, 3 modos de potencia, sensores de colisión.',
    model: 'D106',
    dimensions: 'Φ325 x 98 mm',
    ratedPower: '45W',
    ratedVoltage: '14.4V⎓',
    chargingVoltage: '20V⎓',
    battery: '3,200 mAh (Nominal) / 2,900 mAh (Real)',
    weight: '3.5 kg'
  },
  'VACUUM 5': {
    suction: '20,000 Pa (Serie 5)',
    mopping: 'Mopado a presión constante con reconocimiento de IA para diferentes tipos de suelos, brazo extensible mejorado.',
    sensors: 'Navegación LDS + Visión IA / Luz estructurada avanzada para reconocimiento de objetos pequeños.',
    model: 'Mijia Robot Vacuum 5 Series',
    dimensions: 'Φ350 x 97 mm',
    ratedPower: '65W',
    ratedVoltage: '14.4V⎓',
    chargingVoltage: '20V⎓',
    battery: '5,200 mAh',
    weight: '4.0 kg'
  },
  'H40': {
    suction: '10,000 Pa',
    mopping: 'Fregado integrado con elevación automática de mopa, flujo de agua ajustable.',
    sensors: 'Navegación láser LDS, tecnología anti-enredos con estructura de peine.',
    model: 'Mijia H40',
    dimensions: 'Φ350 x 97 mm',
    ratedPower: '55W',
    ratedVoltage: '14.4V⎓',
    chargingVoltage: '20V⎓',
    battery: '5,200 mAh',
    weight: '3.8 kg'
  },
  'S40 PRO': {
    suction: '15,000 Pa',
    mopping: 'Mopas rotativas duales (180 rpm), brazo mecánico extensible para limpieza profunda de bordes y esquinas.',
    sensors: 'Navegación láser LDS + Reconocimiento de objetos por luz estructurada.',
    model: 'Mijia S40 Pro',
    dimensions: '355 x 350 x 99 mm',
    ratedPower: '55W',
    ratedVoltage: '14.4V⎓',
    chargingVoltage: '19.6V⎓',
    battery: '5,200 mAh',
    weight: '3.9 kg'
  },
  'S40C': {
    suction: '5,000 Pa',
    mopping: 'Patrón de fregado en forma de Y para mayor eficiencia en eliminación de manchas.',
    sensors: 'Navegación láser LDS, 4 modos de succión, sensores anticaída.',
    model: 'Mijia S40C',
    dimensions: '340 x 340 x 97 mm',
    ratedPower: '45W',
    ratedVoltage: '14.4V⎓',
    chargingVoltage: '20V⎓',
    battery: '2,600 mAh',
    weight: '3.4 kg'
  },
  'S40': {
    suction: '10,000 Pa',
    mopping: 'Fregado integrado, cepillo principal anti-enredos con tecnología de corte de pelo.',
    sensors: 'Navegación láser LDS, mapeo rápido, sensores de obstáculos inteligentes.',
    model: 'Mijia S40',
    dimensions: 'Φ350 x 97 mm',
    ratedPower: '55W',
    ratedVoltage: '14.4V⎓',
    chargingVoltage: '20V⎓',
    battery: '5,200 mAh',
    weight: '3.8 kg'
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

    const products = await Product.find({ category: 'aspiradoras-robot' });
    console.log(`Working on ${products.length} robot vacuum products...`);

    let count = 0;
    for (const p of products) {
      const nameUpper = p.name.toUpperCase();
      
      // Find the best match in our database
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
        
        const enrichedSpecs = [
          { label: 'Potencia de succión', value: specs.suction },
          { label: 'Mopping, tipo y calidad', value: specs.mopping },
          { label: 'Sensores', value: specs.sensors },
          { label: 'Modelo del producto', value: specs.model },
          { label: 'Dimensiones de la aspiradora', value: specs.dimensions },
          { label: 'Potencia nominal', value: specs.ratedPower },
          { label: 'Voltaje nominal', value: specs.ratedVoltage },
          { label: 'Voltaje de carga', value: specs.chargingVoltage },
          { label: 'Capacidad de la batería', value: specs.battery },
          { label: 'Peso neto', value: specs.weight },
          { label: 'Marca', value: 'Xiaomi' }
        ];

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

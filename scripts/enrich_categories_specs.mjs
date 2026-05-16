import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  stock: Number,
  description: String,
  specifications: [{ label: String, value: String }]
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const specsData = {
  // SAMSUNG
  'S25 ULTRA': {
    procesador: 'Qualcomm Snapdragon 8 Elite (3 nm)',
    camaraTrasera: '200 MP (Wide, OIS) + 50 MP (Periscope 5x) + 50 MP (Ultra-wide) + 10 MP (Telephoto)',
    camaraFrontal: '12 MP (Dual Pixel AF)',
    pantalla: '6.9" Dynamic LTPO AMOLED 2X, 120Hz, QHD+ (3120x1440), 2600 nits, Gorilla Armor',
    bateria: '5000 mAh, 45W Fast Charging',
    so: 'Android 15 (One UI 7)',
    descBase: 'El Galaxy S25 Ultra es la máxima expresión de tecnología y productividad. Con su procesador Snapdragon 8 Elite y el S-Pen integrado, es la herramienta definitiva para profesionales y entusiastas de la fotografía.'
  },
  'A56': {
    procesador: 'Exynos 1580 (4 nm)',
    camaraTrasera: '50 MP (f/1.8, OIS) + 12 MP (Ultra-wide) + 5 MP (Macro)',
    camaraFrontal: '32 MP (f/2.2)',
    pantalla: '6.7" FHD+ Super AMOLED, 120Hz, 1000 nits',
    bateria: '5000 mAh, 45W Fast Charging',
    so: 'Android 15 (One UI 7)',
    descBase: 'Equilibrio perfecto entre potencia y elegancia. El Galaxy A56 redefine la gama media con un rendimiento de nivel superior y cámaras que capturan cada detalle con realismo profesional.'
  },
  'A36': {
    procesador: 'Qualcomm Snapdragon 6 Gen 3 (4 nm)',
    camaraTrasera: '50 MP (f/1.8, OIS) + 8 MP (Ultra-wide) + 2 MP (Macro)',
    camaraFrontal: '13 MP (f/2.2)',
    pantalla: '6.7" FHD+ Super AMOLED, 120Hz',
    bateria: '5000 mAh, 45W Charging',
    so: 'Android 15 (One UI 7)',
    descBase: 'Velocidad 5G y una pantalla vibrante para tu contenido diario. El Galaxy A36 ofrece una experiencia fluida y duradera, ideal para quienes buscan calidad Samsung sin compromisos.'
  },
  'A26': {
    procesador: 'Exynos 1380 (5 nm)',
    camaraTrasera: '50 MP (f/1.8, OIS) + 8 MP (Ultra-wide) + 2 MP (Macro)',
    camaraFrontal: '13 MP (f/2.2)',
    pantalla: '6.7" FHD+ Super AMOLED, 120Hz',
    bateria: '5000 mAh, 25W Charging',
    so: 'Android 15 (One UI 7)',
    descBase: 'Diseñado para durar. El Galaxy A26 combina una gran autonomía con una pantalla AMOLED de alta fluidez, perfecto para disfrutar de tus redes y streaming favoritos.'
  },
  'A16': {
    procesador: 'Exynos 1330 / Dimensity 6300',
    camaraTrasera: '50 MP (f/1.8) + 5 MP (Ultra-wide) + 2 MP (Macro)',
    camaraFrontal: '13 MP (f/2.2)',
    pantalla: '6.7" FHD+ AMOLED, 90Hz',
    bateria: '5000 mAh, 25W Charging',
    so: 'Android 15 (One UI 7)',
    descBase: 'Todo lo que necesitás de un smartphone en un diseño moderno. El Galaxy A16 ofrece una gran pantalla y cámaras versátiles para registrar tus momentos más importantes.'
  },
  'A07': {
    procesador: 'MediaTek Helio G99 (6 nm)',
    camaraTrasera: '50 MP (f/1.8) + Lente Auxiliar',
    camaraFrontal: '8 MP (f/2.0)',
    pantalla: '6.7" PLS LCD, 90Hz, 720 x 1600 px',
    bateria: '5000 mAh, 25W Charging',
    so: 'Android 15 (One UI 7)',
    descBase: 'La nueva generación de la serie esencial de Samsung. Con un procesador potente para su gama y una pantalla fluida de 90Hz, el Galaxy A07 es el equilibrio ideal para el día a día.'
  },
  'A06': {
    procesador: 'MediaTek Helio G85 (12 nm)',
    camaraTrasera: '50 MP (f/1.8) + 2 MP (Depth)',
    camaraFrontal: '8 MP (f/2.0)',
    pantalla: '6.7" PLS LCD, 60Hz, 720 x 1600 px',
    bateria: '5000 mAh, 25W Charging',
    so: 'Android 14 (One UI 6)',
    descBase: 'Fiable, rendidor y con el respaldo de Samsung. El Galaxy A06 ofrece una gran pantalla para disfrutar de tu contenido favorito con la mejor autonomía de batería.'
  },
  'TAB A11': {
    procesador: 'MediaTek Helio G99',
    camaraTrasera: '8 MP',
    camaraFrontal: '5 MP',
    pantalla: '11.0" WUXGA (1920x1200) LCD',
    bateria: '7040 mAh',
    so: 'Android 14',
    descBase: 'Compañera ideal para el estudio y el entretenimiento. La Galaxy Tab A11 combina un diseño delgado con un rendimiento sólido para toda la familia.'
  },

  // IPHONE
  'IPHONE 17 PRO MAX': {
    procesador: 'Apple A19 Pro (2 nm)',
    camaraTrasera: '48 MP Fusion + 48 MP Ultra Wide + 48 MP Telephoto (5x Optical)',
    camaraFrontal: '24 MP TrueDepth (AF)',
    pantalla: '6.9" Super Retina XDR OLED, 120Hz ProMotion, 2000 nits',
    bateria: 'Lithium-ion, Fast Charging, MagSafe',
    so: 'iOS 19',
    descBase: 'El iPhone más potente jamás creado. Con el nuevo chip A19 Pro y una pantalla expansiva de 6.9 pulgadas, el iPhone 17 Pro Max redefine los límites de lo que un smartphone profesional puede lograr.'
  },
  'IPHONE 17 PRO': {
    procesador: 'Apple A19 Pro (2 nm)',
    camaraTrasera: '48 MP Fusion + 48 MP Ultra Wide + 48 MP Telephoto (5x Optical)',
    camaraFrontal: '24 MP TrueDepth (AF)',
    pantalla: '6.3" Super Retina XDR OLED, 120Hz ProMotion',
    bateria: 'Lithium-ion, Fast Charging, MagSafe',
    so: 'iOS 19',
    descBase: 'Potencia profesional en el tamaño perfecto. El iPhone 17 Pro combina el rendimiento incomparable del A19 Pro con un sistema de cámaras refinado para capturar video y fotos de cine.'
  },
  'IPHONE 17': {
    procesador: 'Apple A19 (3 nm)',
    camaraTrasera: '48 MP Fusion + 48 MP Ultra Wide',
    camaraFrontal: '12 MP TrueDepth',
    pantalla: '6.3" Super Retina XDR OLED, 120Hz ProMotion',
    bateria: 'Lithium-ion, Fast Charging, MagSafe',
    so: 'iOS 19',
    descBase: 'Innovación en cada detalle. El iPhone 17 estrena la pantalla ProMotion de 120Hz en el modelo estándar, brindando una fluidez asombrosa junto a la eficiencia del nuevo chip A19.'
  },
  'IPHONE 16 PRO MAX': {
    procesador: 'Apple A18 Pro (3 nm)',
    camaraTrasera: '48 MP Fusion + 48 MP Ultra Wide + 12 MP Telephoto (5x)',
    camaraFrontal: '12 MP TrueDepth',
    pantalla: '6.9" Super Retina XDR OLED, 120Hz ProMotion',
    bateria: 'Lithium-ion, Fast Charging, MagSafe',
    so: 'iOS 18 (Upgradable)',
    descBase: 'Experiencia cinematográfica en la palma de tu mano. Con su enorme pantalla de 6.9" y el chip A18 Pro, el iPhone 16 Pro Max es la herramienta definitiva para creadores de contenido.'
  },
  'IPHONE 16 PRO': {
    procesador: 'Apple A18 Pro (3 nm)',
    camaraTrasera: '48 MP Fusion + 48 MP Ultra Wide + 12 MP Telephoto (5x)',
    camaraFrontal: '12 MP TrueDepth',
    pantalla: '6.3" Super Retina XDR OLED, 120Hz ProMotion',
    bateria: 'Lithium-ion, Fast Charging, MagSafe',
    so: 'iOS 18 (Upgradable)',
    descBase: 'Titanio y potencia pura. El iPhone 16 Pro es increíblemente ligero y resistente, ofreciendo el máximo rendimiento de Apple en un formato manejable y ultra-premium.'
  },
  'IPHONE 16': {
    procesador: 'Apple A18 (3 nm)',
    camaraTrasera: '48 MP Fusion + 12 MP Ultra Wide',
    camaraFrontal: '12 MP TrueDepth',
    pantalla: '6.1" Super Retina XDR OLED, 60Hz',
    bateria: 'Lithium-ion, Fast Charging, MagSafe',
    so: 'iOS 18 (Upgradable)',
    descBase: 'Moderno, colorido y potente. El iPhone 16 introduce el nuevo Action Button y el chip A18, acercando las funciones Pro a todo el mundo en un diseño icónico.'
  },

  // XIAOMI / POCO
  'REDMI NOTE 14 PRO': {
    procesador: 'Dimensity 7300-Ultra / Snapdragon 7s Gen 3',
    camaraTrasera: '50 MP (OIS) + 8 MP (Ultra-wide) + 2 MP (Macro)',
    camaraFrontal: '20 MP',
    pantalla: '6.67" 1.5K AMOLED Curved, 120Hz, 3000 nits',
    bateria: '5500 mAh, 45W / 67W HyperCharge',
    so: 'HyperOS (Android 14)',
    descBase: 'Resistente y sofisticado. El Redmi Note 14 Pro ofrece una pantalla curva de alto brillo y resistencia al agua IP68, convirtiéndolo en el compañero más robusto de su clase.'
  },
  'POCO X7 PRO': {
    procesador: 'MediaTek Dimensity 8400-Ultra',
    camaraTrasera: '50 MP (OIS) + 8 MP (Ultra-wide) + 2 MP (Macro)',
    camaraFrontal: '16 MP',
    pantalla: '6.67" 1.5K Flow AMOLED, 120Hz',
    bateria: '5500 mAh, 67W / 90W HyperCharge',
    so: 'HyperOS 2 (Android 15)',
    descBase: 'Rendimiento extremo para gamers. El POCO X7 Pro destaca por su procesador ultra potente y almacenamiento UFS 4.0, garantizando una fluidez absoluta en los juegos más exigentes.'
  },
  'POCO F7': {
    procesador: 'Qualcomm Snapdragon 8s Gen 4',
    camaraTrasera: '50 MP (OIS) + 8 MP (Ultra-wide)',
    camaraFrontal: '32 MP',
    pantalla: '6.83" 1.5K pOLED, 120Hz, 3200 nits',
    bateria: '6500 mAh, 90W Fast Charging',
    so: 'HyperOS 2 (Android 15)',
    descBase: 'El nuevo rey de la gama media-alta. Con una batería masiva de 6500 mAh y el último chip Snapdragon, el POCO F7 redefine lo que significa autonomìa y potencia extrema.'
  },
  'REDMI 14C': {
    procesador: 'MediaTek Helio G81-Ultra',
    camaraTrasera: '50 MP (Main)',
    camaraFrontal: '13 MP',
    pantalla: '6.88" IPS LCD, 120Hz',
    bateria: '5160 mAh, 18W Charging',
    so: 'HyperOS (Android 14)',
    descBase: 'Estilo y gran pantalla a un precio imbatible. El Redmi 14C destaca por su diseño premium y su fluida pantalla de 120Hz, ideal para redes sociales y uso diario.'
  },
  'REDMI NOTE 15 PRO': {
      procesador: 'Snapdragon 7s Gen 4 (6 nm)',
      camaraTrasera: '50 MP (OIS) + 8 MP + 2 MP',
      camaraFrontal: '32 MP',
      pantalla: '6.83" 1.5K pOLED, 120Hz',
      bateria: '6500 mAh, 100W Charging',
      so: 'Android 15 (HyperOS 2)',
      descBase: 'La evolución definitiva de la serie Note. Con carga de 100W y una pantalla OLED de vanguardia, el Redmi Note 15 Pro es la elección inteligente para el usuario moderno.'
  }
};

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const categories = ['xiaomi', 'samsung', 'iphone'];
    const products = await Product.find({ 
      category: { $in: categories },
      stock: { $gt: 0 }
    });

    console.log(`Analyzing ${products.length} products with stock.`);

    const operations = products.map(p => {
      const upperName = p.name.toUpperCase();
      let matchedKey = null;

      // Match keys
      for (const key of Object.keys(specsData)) {
        if (upperName.includes(key)) {
          matchedKey = key;
          break;
        }
      }

      if (matchedKey) {
        const baseSpecs = specsData[matchedKey];
        
        // Extract RAM and Storage
        let ram = 'N/A';
        let storage = 'N/A';

        // Pattern 1: 8/256GB or 4/128
        const slashPattern = upperName.match(/(\d+)\/(\d+)GB/);
        // Pattern 2: 8GB256 or 12256GB
        const joinedPattern = upperName.match(/(\d{1,2})(\d{3})GB/);
        // Pattern 3: 128GB or 512GB (generic)
        const storageOnly = upperName.match(/(\d+)\s?(GB|TB)/);

        if (slashPattern) {
            ram = slashPattern[1] + ' GB';
            storage = slashPattern[2] + ' GB';
        } else if (joinedPattern) {
            ram = joinedPattern[1] + ' GB';
            storage = joinedPattern[2] + ' GB';
        } else if (storageOnly) {
            storage = storageOnly[1] + ' ' + storageOnly[2];
        }

        // Special case for iPhone RAM (Fixed if not specified)
        if (matchedKey.includes('IPHONE')) {
            ram = baseSpecs.ram || '8 GB'; 
            if (matchedKey.includes('17 PRO')) ram = '12 GB';
        }

        const newSpecs = [
          { label: 'Procesador', value: baseSpecs.procesador },
          { label: 'RAM', value: ram },
          { label: 'Almacenamiento', value: storage },
          { label: 'Cámara trasera', value: baseSpecs.camaraTrasera },
          { label: 'Cámara frontal', value: baseSpecs.camaraFrontal },
          { label: 'Pantalla', value: baseSpecs.pantalla },
          { label: 'Batería', value: baseSpecs.bateria },
          { label: 'Sistema Operativo', value: baseSpecs.so }
        ];

        let finalDescription = `${baseSpecs.descBase}\n\nEn **JB Imports** te ofrecemos garantía oficial y la seguridad de comprar un equipo original y sellado de fábrica.`;

        console.log(`Updating [${p.name}] as ${matchedKey}`);
        return {
          updateOne: {
            filter: { _id: p._id },
            update: { $set: { specifications: newSpecs, description: finalDescription } }
          }
        };
      }
      return null;
    }).filter(Boolean);

    if (operations.length > 0) {
      const result = await Product.bulkWrite(operations);
      console.log(`Successfully updated ${result.modifiedCount} products.`);
    } else {
      console.log('No products matched the enrichment criteria.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();

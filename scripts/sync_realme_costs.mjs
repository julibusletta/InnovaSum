
import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const realmeList = `
13714-0 REALME 14 RMX5070 5G 256GB/12RAM STORM TITANIUM / 260.00 |
15433-8 REALME C71 RMX3943 5G 8RAM/256GB BLACK / 171.00 |
15434-5 REALME C71 RMX3943 5G 8RAM/256GB GREEN / 171.00 |
14538-1 REALME C71 RMX5303 128GB/4RAM FOREST OWL / 125.00 |
14539-8 REALME C71 RMX5303 128GB/4RAM WHITE SWAN / 125.00 |
15368-3 REALME C71 RMX5303 256GB/4RAM FOREST OWL / 136.00 |
14356-1 REALME C71 RMX5303 256GB/8RAM FOREST OWL / 142.00 |
15832-9 REALME C71 RMX5303 256GB/8RAM VIOLET PARROT / 145.00 |
14357-8 REALME C71 RMX5303 256GB/8RAM WHITE SWAN / 142.00 |
12479-9 REALME C75 RMX3941 256GB/8RAM BLACK NFC / 181.00 |
12480-5 REALME C75 RMX3941 256GB/8RAM GOLD NFC / 181.00 |
13482-8 REALME C75X RMX5020 128GB/6RAM NFC BLUE ANATEL / 131.00 |
13485-9 REALME C75X RMX5020 256GB/8RAM NFC BLUE ANATEL / 178.00 |
13484-2 REALME C75X RMX5020 256GB/8RAM NFC PINK ANATEL / 178.00 |
15103-0 REALME C85 PRO RMX5555 256GB/8RAM NFC PARROT PURPLE / 217.00 |
15102-3 REALME C85 PRO RMX5555 256GB/8RAM NFC PEACOCK GREEN / 217.00 |
15532-8 REALME C85 RMX5566 128GB/6RAM NFC KINGFISHER BLUE / 175.00 |
15533-5 REALME C85 RMX5566 128GB/6RAM NFC SWAN BLACK / 175.00 |
15110-8 REALME C85 RMX5566 256GB/8RAM NFC KINGFISHER BLUE / 205.00 |
15111-5 REALME C85 RMX5566 256GB/8RAM NFC SWAN BLACK / 205.00 |
14090-4 REALME GT7 RMX5061 5G 512GB/16RAM DREAM EDITION ASTON M G/ 850.00 |
13774-4 REALME NOTE 60X RMX3938 128GB/4RAM BLACK ANATEL / 95.00 |
13775-1 REALME NOTE 60X RMX3938 128GB/4RAM GREEN ANATEL / 95.00 |
12757-8 REALME NOTE 60X RMX3938 64GB/3RAM BLACK ANATEL / 84.00 |
12758-5 REALME NOTE 60X RMX3938 64GB/3RAM GREEN ANATEL / 84.00 |
14413-1 REALME NOTE 70 RMX5313 128GB/4RAM BEACH GOLD / 114.00 |
14414-8 REALME NOTE 70 RMX5313 128GB/4RAM OBSIDIAN BLACK / 114.00 |
15864-0 REALME NOTE 70 RMX5313 256GB/4RAM BEACH GOLD / 125.00 |
15798-8 REALME NOTE 70 RMX5313 256GB/4RAM OBSIDIAN BLACK / 125.00 |
14415-5 REALME NOTE 70 RMX5313 256GB/8RAM BEACH GOLD / 130.00 |
14416-2 REALME NOTE 70 RMX5313 256GB/8RAM OBSIDIAN BLACK / 132.00 |
14154-3 REALME P3 ULTRA RMX5031 5G 512GB/12RAM NFC BLUE / 330.00 
`;

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
    id: { type: String, required: true },
    name: String,
    price: Number,
    costPrice: Number,
    category: String,
    image: String,
    description: String,
    specifications: Array,
    published: Boolean,
    stock: Number
  }, { strict: false }));

  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({ 
    slug: String, 
    markupPercent: Number, 
    markupFixed: String 
  }, { strict: false }));

  const cat = await Category.findOne({ slug: 'realme' }).lean();
  const rule = cat || { markupPercent: 30, markupFixed: '>500: +10% | <500: +$20 USD' };

  const calculateFinalPrice = (cost) => {
    let base = cost;
    if (cost >= 500) {
      base = cost * 1.10;
    } else {
      base = cost + 20;
    }
    const rate = 1500;
    const margin = 1 + (rule.markupPercent / 100);
    return Math.round(base * rate * margin / 100) * 100;
  };

  const dbProducts = await Product.find({ category: 'realme' }).lean();

  const items = realmeList.trim().split('\n').map(line => {
    const lastSlashIndex = line.lastIndexOf('/');
    if (lastSlashIndex === -1) return null;
    const priceStr = line.substring(lastSlashIndex + 1).split('|')[0].trim().replace(',', '');
    const price = parseFloat(priceStr);
    if (isNaN(price)) return null;
    let name = line.substring(0, lastSlashIndex).trim().replace(/^\d+-\d+\s+/, '');
    return { name, price };
  }).filter(Boolean);

  let updatedCount = 0;
  let createdCount = 0;

  for (const item of items) {
    const keywords = item.name.toLowerCase().replace(/[\/"]/g, ' ').split(' ').filter(w => w.length >= 3);
    const dbProduct = dbProducts.find(p => {
       const dbName = p.name.toLowerCase();
       // Try model code match (e.g. RMX5070)
       const rmxMatch = item.name.match(/RMX\d+/i);
       if (rmxMatch && dbName.includes(rmxMatch[0].toLowerCase())) return true;
       // Fallback broad match
       return keywords.slice(0, 3).every(kw => dbName.includes(kw));
    });

    if (dbProduct) {
      await Product.updateOne({ _id: dbProduct._id }, { $set: { costPrice: item.price } });
      updatedCount++;
    } else {
      const finalPrice = calculateFinalPrice(item.price);
      const newId = `realme-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      await Product.create({
        id: newId,
        name: item.name,
        price: finalPrice,
        costPrice: item.price,
        category: 'realme',
        image: '/images/categories/realme.png',
        description: `${item.name}. Smartphone Realme con tecnología avanzada.`,
        specifications: [
          { label: 'Marca', value: 'Realme' },
          { label: 'Modelo', value: item.name.match(/RMX\d+/i)?.[0] || 'N/A' },
          { label: 'Costo base (USD)', value: item.price.toString() }
        ],
        stock: 5,
        published: true
      });
      createdCount++;
    }
  }

  console.log(`\nResumen de Sincronización Realme:`);
  console.log(`- Actualizados (costo): ${updatedCount}`);
  console.log(`- Creados (nuevos modelos): ${createdCount}`);
  
  process.exit(0);
}

run();

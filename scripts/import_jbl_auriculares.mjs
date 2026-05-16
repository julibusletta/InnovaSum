import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';
const DB_NAME = 'test';

const CATEGORY_ID = 'auriculares';

const rawProducts = [
  { name: 'FONE JBL WAVE BEAM 2 BUDS ANC BLUETOOTH-BRANCO', usd: 40.00 },
  { name: 'FONE JBL WAVE BEAM 2 BUDS ANC BLUETOOTH-ROSA', usd: 37.00 },
  { name: 'FONE JBL WAVE BUDS 2 ANC BLUETOOTH-BRANCO', usd: 35.50 },
  { name: 'FONE JBL TUNE 720BT BLUETOOTH BLACK', usd: 39.00 },
  { name: 'FONE JBL TUNE 520BT BLUETOOTH AZUL', usd: 30.00 },
  { name: 'FONE JBL TUNE 520BT BLUETOOTH BRANCO', usd: 31.00 },
  { name: 'FONE JBL TUNE 520BT BLUETOOTH PRETO', usd: 29.00 }
];

function translateName(name) {
  let translated = name
    .replace('FONE ', 'Auricular ')
    .replace('-BRANCO', ' - Blanco')
    .replace(' BRANCO', ' - Blanco')
    .replace('-ROSA', ' - Rosa')
    .replace(' BLACK', ' - Negro')
    .replace(' PRETO', ' - Negro')
    .replace(' AZUL', ' - Azul');
  
  return translated;
}

function calculatePrice(usd) {
  // Formula: ((USD * 1500) + 10000) * 1.30
  const base = (usd * 1500) + 10000;
  return Math.ceil(base * 1.30);
}

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    console.log('Connected to MongoDB.');

    // 1. Insert Products
    const productsToInsert = rawProducts.map((p, index) => {
      const finalPrice = calculatePrice(p.usd);
      const translatedName = translateName(p.name);
      
      return {
        id: `jbl-aur-${Date.now()}-${index}`,
        name: translatedName,
        price: finalPrice,
        originalPrice: Math.ceil(finalPrice * 1.25), // Standard markup for display
        image: '/images/products/jbl-placeholder.png',
        images: [],
        category: CATEGORY_ID,
        description: `${translatedName}. Auriculares JBL de alta calidad con sonido Pure Bass y cancelación de ruido.`,
        stock: 15,
        published: true,
        specifications: [
          { label: 'Marca', value: 'JBL' },
          { label: 'Conectividad', value: 'Bluetooth' },
          { label: 'Precio USD (Ref)', value: `${p.usd}` }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    for (const p of productsToInsert) {
      console.log(`Importing: ${p.name} -> $${p.price.toLocaleString('es-AR')}`);
      await db.collection('products').updateOne(
        { name: p.name }, // Avoid duplicates if re-run
        { $set: p },
        { upsert: true }
      );
    }

    console.log(`Successfully imported/updated ${productsToInsert.length} JBL products.`);

  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';
const DB_NAME = 'test';

const CATEGORY_ID = 'apple-accesorios';

const rawProducts = [
  { name: 'APPLE AIRTAGS 1 PACK MX532LL/A', usd: 22.50 },
  { name: 'APPLE AIRTAGS PACK COM 4 MX542LL/A', usd: 77.00 },
  { name: 'APPLE CABO IPHONE 15 TIPO C 1M 60W BRANCO ORIGINAL', usd: 15.90 },
  { name: 'APPLE CABO IPHONE 15/15PROMAX TIPO C COM CAIXA', usd: 3.00 },
  { name: 'APPLE CABO IPHONE TIPO C TO LIGHTNING 1M BRANCO ORIGINAL', usd: 13.90 },
  { name: 'APPLE CABO IPHONE USB FOXCOM S/CAIXA', usd: 1.40 },
  { name: 'APPLE CABO IPHONE USB SYNCWIRE C/CAIXA 1M', usd: 1.00 },
  { name: 'APPLE CARREGADOR IPHONE 11/12 TIPO C 20W C/CAIXA', usd: 3.00 },
  { name: 'APPLE CARREGADOR IPHONE 11/12 TIPO C 50W C/2 ENTRADA COM CAIXA', usd: 5.00 },
  { name: 'APPLE CARREGADOR IPHONE 11/14 TIPO C 25W C/CABO C/CAIXA', usd: 3.25 },
  { name: 'APPLE CARREGADOR IPHONE 11/15 35W COM CAIXA', usd: 2.90 },
  { name: 'APPLE CARREGADOR IPHONE MHJG3BZ/A 20W ORIGINAL', usd: 18.00 },
  { name: 'APPLE FONE AIRPODS 4 MXP63LL/A WHITE NOVO ATIVADO', usd: 96.00 },
  { name: 'APPLE FONE AIRPODS 4 active noise cancellation', usd: 145.00 },
  { name: 'APPLE FONE AIRPODS PRO 2GN MTJV3LL/A C/MAGSAFE CASE WHITE', usd: 219.00 },
  { name: 'APPLE FONE AIRPODS PRO 3 MFHP4LL COM MAGSAFE CHARGING', usd: 230.00 },
  { name: 'APPLE FONE EARPODS MWTY3ZM/A LIGHTNING WHITE - ORIGINAL', usd: 9.00 },
  { name: 'APPLE PENCIL A1603 MYQW3AM/A IPAD MINI IPAD AIR IPAD PR', usd: 75.00 },
  { name: 'APPLE PENCIL PRO MX2D3AM/A A2538 IPAD PRO M4/AIR M2 BRANC', usd: 117.00 },
  { name: 'APPLE PENCIL USB-C MUWA3AM/A A3085', usd: 97.00 },
  { name: 'APPLE PENCIL USB-C MUWA3ZM/A A3085', usd: 97.00 },
  { name: 'RASTREADOR INTELIGENTE PET-TAG COMPATIVEL COM APPLE', usd: 10.00 }
];

function calculatePrice(usd) {
  if (usd > 200) {
    // (Price + 10) * 1500 * 1.20
    return Math.ceil((usd + 10) * 1500 * 1.20);
  } else {
    // ((Price * 1500) + 10000) * 1.10
    return Math.ceil(((usd * 1500) + 10000) * 1.10);
  }
}

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // 1. Ensure Category exists
    const categoryDoc = {
      id: CATEGORY_ID,
      name: 'Accesorios Apple',
      slug: CATEGORY_ID,
      image: '/images/categories/apple.png',
      isMain: false,
      description: 'Accesorios originales y complementos para tus dispositivos Apple',
      updatedAt: new Date(),
      createdAt: new Date()
    };
    await db.collection('categories').updateOne(
      { id: CATEGORY_ID },
      { $set: categoryDoc },
      { upsert: true }
    );
    console.log('Category synced.');

    // 2. Clear old products in this category (optional but often safer for imports)
    // await db.collection('products').deleteMany({ category: CATEGORY_ID });

    // 3. Insert Products
    const productsToInsert = rawProducts.map((p, index) => {
      const finalPrice = calculatePrice(p.usd);
      return {
        id: `apple-acc-${Date.now()}-${index}`,
        name: p.name,
        price: finalPrice,
        originalPrice: Math.ceil(finalPrice * 1.1), // Placeholder for original price
        image: '/images/products/apple-accessory-placeholder.png',
        images: [],
        category: CATEGORY_ID,
        description: `${p.name}. Accesorio original Apple importado.`,
        stock: 10,
        published: true,
        specifications: [
          { label: 'Marca', value: 'Apple' },
          { label: 'Modelo', value: p.name.split(' ').slice(2, 5).join(' ') },
          { label: 'Precio USD (Base)', value: `${p.usd}` }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    for (const p of productsToInsert) {
      await db.collection('products').updateOne(
        { name: p.name }, // Avoid duplicates if re-run
        { $set: p },
        { upsert: true }
      );
    }

    console.log(`Successfully imported/updated ${productsToInsert.length} products.`);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);

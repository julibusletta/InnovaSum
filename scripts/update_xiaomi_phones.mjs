import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";
const DB_NAME = "test"; // Standard for this project

async function updateXiaomiCatalog() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(DB_NAME);
    const productsCollection = db.collection('products');

    // Load data from JSON
    const rawData = JSON.parse(fs.readFileSync('./tmp/xiaomi_data.json', 'utf8'));
    console.log(`Loaded ${rawData.length} products from JSON`);

    // 1. DELETE existing Xiaomi phones
    const deleteResult = await productsCollection.deleteMany({ category: 'xiaomi' });
    console.log(`Deleted ${deleteResult.deletedCount} existing Xiaomi products`);

    // 2. Deduplicate and Prepare new products
    const uniqueProducts = [];
    const seenSlugs = new Set();

    rawData.forEach(p => {
      const slug = p.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      if (!seenSlugs.has(slug)) {
        uniqueProducts.push({ ...p, id: slug });
        seenSlugs.add(slug);
      } else {
        console.warn(`Skipping duplicate product: ${p.name}`);
      }
    });

    const newProducts = uniqueProducts.map((p) => {
      const usd = p.usdPrice;
      let finalPriceARS;

      if (usd > 500) {
        // Formula: (USD + 10%) * 1500 * 1.20
        finalPriceARS = Math.round((usd * 1.1) * 1500 * 1.20);
      } else {
        // Formula: ((USD * 1500) + 10,000) * 1.20
        finalPriceARS = Math.round(((usd * 1500) + 10000) * 1.20);
      }

      return {
        id: p.id,
        name: p.name,
        price: finalPriceARS,
        originalPrice: finalPriceARS,
        image: '/images/hero-xiaomi.png', // Generic Xiaomi Image
        images: ['/images/hero-xiaomi.png'],
        category: 'xiaomi',
        description: `${p.name} - Versión Global.`,
        stock: 5,
        published: true,
        specifications: [
          { label: "Marca", value: "Xiaomi" },
          { label: "Modelo", value: p.name.replace('XIAOMI ', '') }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // 3. INSERT new products
    if (newProducts.length > 0) {
      const insertResult = await productsCollection.insertMany(newProducts);
      console.log(`Successfully inserted ${insertResult.insertedCount} new Xiaomi products`);
    }

  } catch (error) {
    console.error("Error updating catalog:", error);
  } finally {
    await client.close();
  }
}

updateXiaomiCatalog();

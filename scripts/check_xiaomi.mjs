
import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const p = await mongoose.connection.collection('products').findOne({ category: 'xiaomi', costPrice: { $exists: true } });
    const cat = await mongoose.connection.collection('categories').findOne({ slug: 'xiaomi' });
    console.log(JSON.stringify({ 
      product: p.name, 
      cost: p.costPrice, 
      price: p.price,
      catMargin: cat.markupPercent,
      catFixed: cat.markupFixed
    }, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();

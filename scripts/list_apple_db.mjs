import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ name: String, category: String, specifications: Array }));
  const prods = await Product.find({ category: 'apple-accesorios' }).lean();
  
  console.log('--- PRODUCTOS EN DB (Apple Accesorios) ---');
  prods.forEach(p => {
    const usdPrice = p.specifications.find(s => s.label.includes('USD'))?.value;
    console.log(`[USD: ${usdPrice}] ${p.name}`);
  });
  
  process.exit(0);
}

run();

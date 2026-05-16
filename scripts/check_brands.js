const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  // Find all products that might be Motorola or Samsung
  const products = await Product.find({
    $or: [
      { category: { $regex: /motorola/i } },
      { name: { $regex: /motorola/i } },
      { category: { $regex: /samsung/i } },
      { name: { $regex: /samsung/i } }
    ]
  }).lean();
  
  const motoCount = { categories: {} };
  const samCount = { categories: {} };
  
  products.forEach(p => {
    const isMoto = p.category.toLowerCase().includes('motorola') || p.name.toLowerCase().includes('motorola') || p.name.toLowerCase().includes('moto ');
    const isSam = p.category.toLowerCase().includes('samsung') || p.name.toLowerCase().includes('samsung');
    
    if (isMoto) {
      motoCount.categories[p.category] = (motoCount.categories[p.category] || 0) + 1;
    }
    if (isSam) {
      samCount.categories[p.category] = (samCount.categories[p.category] || 0) + 1;
    }
  });
  
  console.log('Moto Categories:', motoCount.categories);
  console.log('Samsung Categories:', samCount.categories);

  process.exit();
}

run().catch(console.error);

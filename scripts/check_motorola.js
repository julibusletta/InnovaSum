const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  // Find all products that might be Motorola
  const motoProducts = await Product.find({
    $or: [
      { category: { $regex: /motorola/i } },
      { name: { $regex: /motorola/i } },
      { name: { $regex: /moto /i } }
    ]
  }).lean();
  
  console.log(`Found ${motoProducts.length} potential Motorola products.`);
  
  // Group by category
  const byCategory = {};
  motoProducts.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });
  console.log('Categories:', byCategory);

  process.exit();
}

run().catch(console.error);

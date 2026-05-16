const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  // Find all macbooks neo currently with category 'iphone' or anything other than 'macbook'
  const updateResult = await Product.updateMany(
    { name: { $regex: /macbook neo/i } },
    { $set: { category: 'macbook' } }
  );
  
  console.log(`Updated ${updateResult.modifiedCount} "Macbook NEO" products to category 'macbook'.`);
  
  process.exit(0);
}

run().catch(console.error);

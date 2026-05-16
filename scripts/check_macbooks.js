const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  // Search for macbook or neo
  const products = await Product.find({ name: { $regex: /macbook/i } }).lean();
  
  console.log(`Found ${products.length} Macbooks:`);
  products.forEach(p => {
    console.log(`- ${p.id} | ${p.name} | Category: ${p.category} | Stock: ${p.stock}`);
  });

  process.exit(0);
}

run().catch(console.error);

const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
      id: String, 
      name: String, 
      category: String
  }));

  const criteria = [
    { name: { $regex: /ipad/i } },
    { name: { $regex: /tab\s/i } },
    { name: { $regex: /pad/i, $not: { $regex: /ipad/i } } } // likely Xiaomi pads
  ];

  const products = await Product.find({ $or: criteria }, { name: 1, category: 1, _id: 0 });
  console.log("Matched Tablets:");
  products.forEach(p => console.log(`- ${p.name} (Cat: ${p.category})`));

  process.exit(0);
}

run().catch(console.error);

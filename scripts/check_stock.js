const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  const products = await Product.find({}).lean();
  const withStock = products.filter(p => p.stock > 0).length;
  const noStock = products.filter(p => !p.stock || p.stock <= 0).length;
  console.log(`With Stock > 0: ${withStock}`);
  console.log(`With Stock <= 0: ${noStock}`);
  
  const sampleEmpty = products.find(p => !p.stock || p.stock <= 0);
  if (sampleEmpty) console.log('Sample no stock:', { id: sampleEmpty.id, name: sampleEmpty.name, stock: sampleEmpty.stock });

  const sampleWith = products.find(p => p.stock > 0);
  if (sampleWith) console.log('Sample with stock:', { id: sampleWith.id, name: sampleWith.name, stock: sampleWith.stock });

  process.exit();
}

run().catch(console.error);

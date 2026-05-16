const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ id: String, name: String, category: String }, { strict: false }));
  
  const ofertas = await Product.find({ category: 'ofertas' });
  console.log('Products in category "ofertas":', ofertas.length);
  
  const featured = await Product.find({ id: { $in: ['378', '1339'] } });
  console.log('Featured products 378/1339 exist:', featured.length);

  process.exit();
}

run().catch(console.error);

const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

const ProductSchema = new mongoose.Schema({
  id: String, name: String, category: String, published: Boolean
}, { timestamps: true });

async function test() {
  await mongoose.connect(MONGODB_URI);
  const ProductModel = mongoose.model('Product', ProductSchema);

  const query = { category: { $in: ['starlink', 'accesorios-starlink', 'inversores-12-30v', 'soportes'] }, published: { $ne: false } };
  const products = await ProductModel.find(query);
  console.log("Starlink products:", products.length, products.map(p => ({ id: p.id, name: p.name, cat: p.category })));
  
  process.exit(0);
}

test();

const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ id: String, name: String, image: String, images: [String] }, { strict: false }));
  
  const featured = await Product.find({ id: { $in: ['378', '1339', 'jbl-charge-6-black', 'xiaomi-smart-robot-s40c'] } }); // The IDs changed recently via bulk_sync_final! Wait!
  console.log(featured.map(f => ({ id: f.id, name: f.name, image: f.image })));

  process.exit();
}

run().catch(console.error);

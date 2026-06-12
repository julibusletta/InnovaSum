const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/innovasum?appName=admin";
const DATA_DIR = path.join(__dirname, '..', 'data');

const ProductSchema = new mongoose.Schema({
  id: String, name: String, price: Number, originalPrice: Number, discount: Number, 
  image: String, category: String, description: String, stock: Number, badge: String
}, { timestamps: true });

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const ProductModel = mongoose.model('Product', ProductSchema);

    console.log('Migrating Products...');
    const productsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
    for (const prod of productsData) {
      await ProductModel.findOneAndUpdate({ id: prod.id }, prod, { upsert: true });
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();

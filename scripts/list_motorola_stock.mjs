import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  stock: Number,
  specifications: [{ label: String, value: String }]
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const motorolaProducts = await Product.find({ 
      category: 'motorola',
      stock: { $gt: 0 }
    }).lean();

    console.log(`Found ${motorolaProducts.length} Motorola products with stock.`);
    console.log(JSON.stringify(motorolaProducts.map(p => ({ id: p.id, name: p.name })), null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();

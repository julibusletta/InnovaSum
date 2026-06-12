const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

const ProductSchema = new mongoose.Schema({
  id: String, name: String, category: String
}, { timestamps: true });

async function deleteOtherAuriculares() {
  try {
    await mongoose.connect(MONGODB_URI);
    const ProductModel = mongoose.model('Product', ProductSchema);

    // Delete all products where category is 'auriculares' but ID is not 'ml-08'
    const result = await ProductModel.deleteMany({
      category: 'auriculares',
      id: { $ne: 'ml-08' }
    });

    console.log(`Deleted ${result.deletedCount} old 'auriculares' products from MongoDB.`);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

deleteOtherAuriculares();

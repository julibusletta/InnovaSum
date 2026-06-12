const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/innovasum?appName=admin";

const ProductSchema = new mongoose.Schema({
  id: String, badge: String
}, { timestamps: true });

async function updateBadge() {
  try {
    await mongoose.connect(MONGODB_URI);
    const ProductModel = mongoose.model('Product', ProductSchema);

    // Products uploaded: ml-01 to ml-10, st-mini-3522
    // We update them to have badge: 'Bomba' so they appear in 'Nuestros productos'
    const newProductIds = ['ml-01', 'ml-02', 'ml-03', 'ml-04', 'ml-05', 'ml-06', 'ml-07', 'ml-08', 'ml-09', 'ml-10', 'st-mini-3522'];

    const result = await ProductModel.updateMany(
      { id: { $in: newProductIds } },
      { $set: { badge: 'Bomba' } }
    );

    console.log(`Updated ${result.modifiedCount} products with 'Bomba' badge.`);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

updateBadge();

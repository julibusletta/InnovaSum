import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function listIphones() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const products = await Product.find({ name: /iPhone/i });
    console.log(`Found ${products.length} iPhone products:`);
    products.forEach(p => {
      console.log(`- ${p.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

listIphones();

import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function verifyStructure() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const product = await Product.findOne({ name: /JBL CHARGE 6/i });
    if (product) {
      console.log(`Product: ${product.name}`);
      console.log(`Specifications type: ${Array.isArray(product.specifications) ? 'ARRAY' : typeof product.specifications}`);
      console.log('Sample data:', JSON.stringify(product.specifications?.[0], null, 2));
    } else {
      console.log('Product not found');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

verifyStructure();

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

function getMongoUri() {
  const envPath = path.join(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI=(.*)/);
  return match ? match[1].trim() : null;
}

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
});

async function migrate() {
  try {
    const uri = getMongoUri();
    await mongoose.connect(uri);
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    // Update all MacBook products to 'macbook' category
    const result = await Product.updateMany(
      { name: /MACBOOK/i },
      { $set: { category: 'macbook' } }
    );

    console.log(`Successfully updated ${result.modifiedCount} products to 'macbook' category.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();

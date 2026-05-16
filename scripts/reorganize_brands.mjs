import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Only target products currently in 'celulares' or incorrectly categorized
    const products = await Product.find({ 
      $or: [
        { category: 'celulares' },
        { name: /SAMSUNG/i, category: { $ne: 'samsung' } },
        { name: /MOTOROLA/i, category: { $ne: 'motorola' } },
        { name: /XIAOMI/i, category: { $ne: 'xiaomi' } },
        { name: /REALME/i, category: { $ne: 'realme' } }
      ] 
    });

    console.log(`Found ${products.length} products to check for brand reorganization.`);

    const brandMapping = [
      { brand: 'SAMSUNG', category: 'samsung' },
      { brand: 'MOTOROLA', category: 'motorola' },
      { brand: 'XIAOMI', category: 'xiaomi' },
      { brand: 'REALME', category: 'realme' },
    ];

    const operations = products.map(p => {
      let newCategory = p.category;
      const upperName = p.name.toUpperCase();

      // Skip non-phone Xiaomi items if needed (already in aspiradoras-robot, etc.)
      if (upperName.includes('XIAOMI') && (upperName.includes('VACUUM') || upperName.includes('ROBOT') || upperName.includes('MOP'))) {
        return null;
      }

      for (const mapping of brandMapping) {
        if (upperName.includes(mapping.brand)) {
          newCategory = mapping.category;
          break;
        }
      }

      if (newCategory !== p.category) {
        console.log(`Updating [${p.name}]: ${p.category} -> ${newCategory}`);
        return {
          updateOne: {
            filter: { _id: p._id },
            update: { $set: { category: newCategory } }
          }
        };
      }
      return null;
    }).filter(Boolean);

    if (operations.length > 0) {
      const result = await Product.bulkWrite(operations);
      console.log(`Successfully updated ${result.modifiedCount} products.`);
    } else {
      console.log('No products needed updating.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();

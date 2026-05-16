import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

// Re-define Minimal Schema for Script
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

    const products = await Product.find({ 
      $or: [
        { name: /JBL/i },
        { category: 'jbl' }
      ] 
    });

    console.log(`Found ${products.length} JBL products to check.`);

    const parlantesKeywords = ['BOOMBOX', 'CHARGE', 'FLIP', 'GO', 'CLIP', 'XTREME', 'PARTY BOX', 'ENCORE', 'PULSE', 'CAIXA DE SOM', 'PARTYBOX'];
    const auricularesKeywords = ['FONE', 'TUNE', 'SENSE', 'LIVE', 'QUANTUM', 'REFLECT', 'WAVE', 'BUDS', 'TOUR', 'AURICULAR'];

    const operations = products.map(p => {
      let newCategory = p.category;
      const upperName = p.name.toUpperCase();

      if (parlantesKeywords.some(k => upperName.includes(k))) {
        newCategory = 'parlantes';
      } else if (auricularesKeywords.some(k => upperName.includes(k))) {
        newCategory = 'auriculares';
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

    // Optional: Clean up duplicates if needed
    // In this case, we just focus on category reorganization as requested.

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();

const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
     id: String,
     category: String,
     name: String,
     stock: Number,
     published: Boolean
  }, { strict: false }));
  
  // 1. Update categories
  let updateResultMoto = await Product.updateMany(
    { category: 'cat-motorola' },
    { $set: { category: 'motorola' } }
  );
  console.log(`Unified ${updateResultMoto.modifiedCount} products from 'cat-motorola' to 'motorola'.`);
  
  let updateResultSam = await Product.updateMany(
    { category: 'cat-samsung' },
    { $set: { category: 'samsung' } }
  );
  console.log(`Unified ${updateResultSam.modifiedCount} products from 'cat-samsung' to 'samsung'.\n`);
  
  // 2. Data check and Deduplication
  async function deduplicate(brandCategory) {
    const products = await Product.find({ category: brandCategory }).lean();
    const byName = {};
    
    products.forEach(p => {
      // normalize name
      const n = p.name.trim().toLowerCase().replace(/\s+/g, ' ');
      if (!byName[n]) byName[n] = [];
      byName[n].push(p);
    });
    
    let dupCount = 0;
    
    for (const [name, arr] of Object.entries(byName)) {
      if (arr.length > 1) {
        dupCount++;
        console.log(`Duplicate Group [${brandCategory}]: "${name}" (${arr.length} items)`);
        
        // Best: has stock > 0, published !== false
        arr.sort((a, b) => {
          if ((a.stock > 0) !== (b.stock > 0)) return a.stock > 0 ? -1 : 1;
          if ((a.published !== false) !== (b.published !== false)) return a.published !== false ? -1 : 1;
          return 0; // fallback
        });
        
        const keep = arr[0];
        const dupes = arr.slice(1);
        
        console.log(`  Keeping: [ID: ${keep.id}] Stock: ${keep.stock}, Published: ${keep.published !== false}`);
        
        for (const d of dupes) {
          console.log(`  Unpublishing: [ID: ${d.id}] Stock: ${d.stock}, Published: ${d.published !== false}`);
          await Product.updateOne({ id: d.id }, { $set: { published: false, stock: 0 } });
        }
      }
    }
    console.log(`Processed ${dupCount} duplicate groups for ${brandCategory}.\n`);
  }

  await deduplicate('motorola');
  await deduplicate('samsung');

  process.exit();
}

run().catch(console.error);

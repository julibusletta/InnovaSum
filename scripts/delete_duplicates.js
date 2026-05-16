const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

function getTokens(name) {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 0 && t !== 'con' && t !== 'para' && t !== 'los' && t !== 'del' && t !== 'las' && t !== 'que' && t !== 'un');
}

function calculateSimilarity(tokensA, tokensB) {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersection = 0;
  for (const t of setA) if (setB.has(t)) intersection++;
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  const allProducts = await Product.find({}).lean();
  
  // Group by category to find duplicates within the same category
  const categories = {};
  for (const p of allProducts) {
    if (!categories[p.category]) categories[p.category] = [];
    categories[p.category].push(p);
  }
  
  let deletedCount = 0;
  const toDeleteIds = [];
  
  for (const [cat, items] of Object.entries(categories)) {
    // Check all pairs
    const processed = new Set();
    
    for (let i = 0; i < items.length; i++) {
      if (processed.has(items[i].id)) continue;
      
      const tokensA = getTokens(items[i].name);
      const dupes = [items[i]];
      
      for (let j = i + 1; j < items.length; j++) {
        if (processed.has(items[j].id)) continue;
        
        const tokensB = getTokens(items[j].name);
        const sim = calculateSimilarity(tokensA, tokensB);
        
        // If similarity is 1.0 (exact same keywords) or exact name match
        if (sim === 1.0 || items[i].name.trim().toLowerCase() === items[j].name.trim().toLowerCase()) {
          dupes.push(items[j]);
          processed.add(items[j].id);
        }
      }
      
      if (dupes.length > 1) {
        console.log(`\nFound Duplicates in [${cat}]:`);
        
        // Sort: keep the one with stock > 0 and latest creation if possible, or published
        dupes.sort((a, b) => {
          if ((a.stock > 0) !== (b.stock > 0)) return a.stock > 0 ? -1 : 1;
          if ((a.published !== false) !== (b.published !== false)) return a.published !== false ? -1 : 1;
          // Prefer shorter ID if one is auto-generated long string
          if (a.id.length !== b.id.length) return a.id.length - b.id.length; 
          return 0;
        });
        
        const keep = dupes[0];
        console.log(`  [KEEP] ${keep.name} (Stock: ${keep.stock}) [ID: ${keep.id}]`);
        
        for (let k = 1; k < dupes.length; k++) {
          const dl = dupes[k];
          console.log(`  [DELETE] ${dl.name} (Stock: ${dl.stock}) [ID: ${dl.id}]`);
          toDeleteIds.push(dl.id);
          deletedCount++;
        }
      }
      processed.add(items[i].id);
    }
  }
  
  if (toDeleteIds.length > 0) {
    await Product.deleteMany({ id: { $in: toDeleteIds } });
    console.log(`\nSuccessfully DELETED ${deletedCount} duplicate products from the database.`);
  } else {
    console.log(`\nNo duplicates found to delete based on the similarity logic.`);
  }
  
  process.exit();
}

run().catch(console.error);

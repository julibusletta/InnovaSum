const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

function deduceCategory(name) {
  const n = name.toLowerCase();
  if (n.includes('aspiradora') || n.includes('vacuum')) return 'aspiradoras-robot';
  if (n.includes('watch') || n.includes('band') || n.includes('reloj')) return 'smart-watches';
  if (n.includes('auricular') || n.includes('buds') || n.includes('airpods') || n.includes('headset')) return 'auriculares';
  if (n.includes('tablet') || n.includes('pad')) return 'tablets';
  if (n.includes('macbook') || n.includes('notebook') || n.includes('laptop')) return 'notebooks';
  if (n.includes('parlante') || n.includes('speaker') || n.includes('boombox')) return 'parlantes';
  if (n.includes('camara') || n.includes('camera') || n.includes('security')) return 'camaras-seguridad';
  if (n.includes('iphone')) return 'iphone';
  if (n.includes('tv') || n.includes('stick') || n.includes('chromecast')) return 'smart-home';
  if (n.includes('starlink')) return 'accesorios-starlink';
  
  // Default for samsung, moto, xiaomi mostly is cellphones if nothing else matches
  if (n.includes('moto ') || n.includes('galaxy') || n.includes('redmi') || n.includes('poco') || n.includes('edge') || n.includes('samsung') || n.includes('motorola')) {
    return 'celulares';
  }
  
  return 'general';
}

function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
     id: String, category: String, name: String, stock: Number, published: Boolean
  }, { strict: false }));
  
  // Get entire catalog
  const allProducts = await Product.find({}).lean();
  
  const targetCategories = ['cat-xiaomi', 'xiaomi', 'cat-samsung', 'samsung', 'cat-motorola', 'motorola', 'cat-apple', 'apple'];
  
  const toMove = [];
  const toDelete = [];
  
  // Build a lookup of non-target (real) products by normalized name
  const realProducts = allProducts.filter(p => !targetCategories.includes(p.category));
  const realByName = {};
  for (const p of realProducts) {
    const n = normalizeName(p.name);
    if (!realByName[n]) realByName[n] = [];
    realByName[n].push(p);
  }
  
  // Analyze target (brand) products
  const brandProducts = allProducts.filter(p => targetCategories.includes(p.category));
  
  let duplicateGroupsCount = 0;
  
  for (const p of brandProducts) {
    const realCat = deduceCategory(p.name);
    const n = normalizeName(p.name);
    
    // Does it exist in real products?
    if (realByName[n] && realByName[n].length > 0) {
      // It's a duplicate! We should delete this brand one.
      toDelete.push({ id: p.id, name: p.name, oldCat: p.category, realCat, duplicateOf: realByName[n][0].id });
      duplicateGroupsCount++;
    } else {
      // Not a duplicate by name, we just need to RE-CATEGORIZE it
      // Wait, is there a duplicate WITHIN the brand products themselves?
      toMove.push({ id: p.id, name: p.name, oldCat: p.category, newCat: realCat });
    }
  }
  
  console.log(`=== Analysis Results ===`);
  console.log(`Found ${brandProducts.length} items in brand/cat-brand categories.`);
  console.log(`Items to DELETE (exact name duplicates found in real categories): ${toDelete.length}`);
  console.log(`Items to MOVE (re-categorize to generic categories): ${toMove.length}`);
  
  console.log(`\nSample of Items to MOVE:`);
  toMove.slice(0, 5).forEach(m => console.log(` - [${m.oldCat} -> ${m.newCat}] ${m.name}`));
  
  console.log(`\nSample of Items to DELETE:`);
  toDelete.slice(0, 5).forEach(d => console.log(` - [${d.oldCat}] ${d.name} (Dup of ${d.duplicateOf})`));
  
  process.exit();
}

run().catch(console.error);

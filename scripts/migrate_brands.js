const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

function deduceCategory(name) {
  const n = name.toLowerCase();
  
  if (n.includes('aspiradora') || n.includes('vacuum') || n.includes('robot')) return 'aspiradoras-robot';
  if (n.includes('watch') || n.includes('band') || n.includes('reloj') || n.includes('fit')) return 'smart-watches';
  if (n.includes('auricular') || n.includes('buds') || n.includes('airpods') || n.includes('headset') || n.includes('ear') || n.includes('pods')) return 'auriculares';
  if (n.includes('tablet') || n.includes('pad') || n.includes('tab ')) return 'tablets';
  if (n.includes('macbook') || n.includes('notebook') || n.includes('laptop')) return 'notebooks';
  if (n.includes('parlante') || n.includes('speaker') || n.includes('boombox') || n.includes('jbl')) return 'parlantes';
  if (n.includes('camara') || n.includes('camera') || n.includes('security')) return 'camaras-seguridad';
  if (n.includes('tv ') || n.includes('stick') || n.includes('chromecast') || n.includes('alexa') || n.includes('echo')) return 'smart-home';
  if (n.includes('starlink')) return 'accesorios-starlink';
  
  // Apple specific
  if (n.includes('iphone')) return 'iphone';
  if (n.includes('ipad')) return 'ipad';
  
  // Default for phones
  if (
    n.includes('moto ') || n.includes('motorola') || 
    n.includes('galaxy') || n.includes('samsung') || 
    n.includes('redmi') || n.includes('poco') || n.includes('xiaomi') ||
    n.includes('celular') || n.includes('smartphone') || n.includes('edge') || n.includes('pro')
  ) {
    return 'celulares';
  }
  
  return 'general';
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
     id: String, category: String, name: String
  }, { strict: false }));
  
  const targetCategories = ['cat-xiaomi', 'xiaomi', 'cat-samsung', 'samsung', 'cat-motorola', 'motorola', 'cat-apple', 'apple', 'iphone', 'ipad', 'macbook'];
  
  const allProducts = await Product.find({}).lean();
  let movedCount = 0;
  
  for (const p of allProducts) {
    // We target brand categories or if a product needs fixing
    if (targetCategories.includes(p.category)) {
      const realCat = deduceCategory(p.name);
      
      // If it's already in the correct structural category, skip (like iphone -> iphone)
      if (p.category === realCat) continue;
      
      console.log(`[${p.category} -> ${realCat}] ${p.name}`);
      await Product.updateOne({ id: p.id }, { $set: { category: realCat } });
      movedCount++;
    }
  }
  
  console.log(`\nSuccessfully migrated ${movedCount} products from brand-categories to structural categories.`);
  
  process.exit();
}

run().catch(console.error);

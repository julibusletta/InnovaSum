
import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
    price: Number,
    costPrice: Number,
    category: String
  }, { strict: false }));

  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({ 
    slug: String, 
    markupPercent: Number, 
    markupFixed: String 
  }, { strict: false }));

  const categories = await Category.find({}).lean();
  const catMap = categories.reduce((acc, c) => { acc[c.slug] = c; return acc; }, {});

  // Update logic helper
  const calculateFinalPrice = (cost, rule) => {
    if (!cost || isNaN(cost)) return null;
    let base = cost;
    if (rule.markupFixed) {
      if (cost >= 500) {
        base = cost * 1.10; // +10%
      } else {
        const fixedMatch = rule.markupFixed.match(/<500: \+\$(\d+) USD/);
        const fixedVal = fixedMatch ? parseFloat(fixedMatch[1]) : 20;
        base = cost + fixedVal;
      }
    }
    const rate = 1500;
    const margin = 1 + ((rule.markupPercent || 30) / 100);
    return Math.round(base * rate * margin / 100) * 100;
  };

  const prods = await Product.find({ costPrice: { $gt: 0 } }).lean();
  console.log(`Reconciliando ${prods.length} productos...`);

  let count = 0;
  for (const p of prods) {
    const rule = catMap[p.category] || { markupPercent: 30, markupFixed: '>500: +10% | <500: +$20 USD' };
    const newRetailPrice = calculateFinalPrice(p.costPrice, rule);
    
    if (newRetailPrice && newRetailPrice !== p.price) {
      await Product.updateOne({ _id: p._id }, { $set: { price: newRetailPrice } });
      count++;
    }
  }

  console.log(`Finalizado. Se actualizaron ${count} precios de venta.`);
  process.exit(0);
}

run();

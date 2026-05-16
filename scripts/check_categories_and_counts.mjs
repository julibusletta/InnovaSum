import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ category: String }));
  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({ id: String, slug: String, name: String }));

  const cats = await Category.find().lean();
  const counts = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  console.log('--- CATEGORÍAS EN DB ---');
  console.log(JSON.stringify(cats, null, 2));
  
  console.log('--- CONTEO POR PRODUCTO ---');
  console.log(JSON.stringify(counts, null, 2));

  process.exit(0);
}

run();

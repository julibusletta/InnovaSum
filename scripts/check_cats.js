const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
  
  const cats = await Category.find({ isMain: true });
  console.log(cats);

  process.exit();
}

run().catch(console.error);

const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function moveTablets() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
      id: String, 
      name: String, 
      category: String
  }));

  const criteria = [
    { name: { $regex: /ipad/i } },
    { name: { $regex: /tab\s/i } },
    { name: { $regex: /pad/i, $not: { $regex: /ipad/i } } },
    { name: { $regex: /tablet/i } }
  ];

  const products = await Product.find({ $or: criteria });
  console.log(`Found ${products.length} tablets to move.`);
  
  let count = 0;
  for(const p of products) {
     if (p.category !== 'tablets') {
       console.log(`Moving ${p.name} from ${p.category} to tablets`);
       p.category = 'tablets';
       await p.save();
       count++;
     }
  }

  console.log(`Moved ${count} products to tablets category. Categorization complete.`);
  process.exit(0);
}

moveTablets().catch(console.error);

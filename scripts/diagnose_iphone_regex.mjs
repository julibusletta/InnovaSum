import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function diagnose() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  const airMatches = await Product.find({ name: /AIR/i });
  console.log("Matches for /AIR/i:");
  airMatches.forEach(p => console.log(`- ${p.name}`));

  const seventeenMatches = await Product.find({ 
      name: { $regex: /IPHONE 17/i },
      $and: [
          { name: { $not: /PRO/i } },
          { name: { $not: /MAX/i } },
          { name: { $not: /17E/i } },
          { name: { $not: /AIR/i } }
      ]
  });
  console.log("\nMatches for iPhone 17 (Regular):");
  seventeenMatches.forEach(p => console.log(`- ${p.name}`));

  process.exit(0);
}

diagnose();

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

function getMongoUri() {
  const envPath = path.join(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI=(.*)/);
  return match ? match[1].trim() : null;
}

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
});

async function check() {
  try {
    const uri = getMongoUri();
    await mongoose.connect(uri);
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    // Find products in 'notebooks' category
    const notebooks = await Product.find({ category: 'notebooks' });
    
    const appleNotebooks = notebooks.filter(p => /APPLE|MACBOOK/i.test(p.name));
    const otherNotebooks = notebooks.filter(p => !(/APPLE|MACBOOK/i.test(p.name)));

    console.log(`Summary:`);
    console.log(`- Apple Macbooks in 'notebooks': ${appleNotebooks.length}`);
    console.log(`- Other brands in 'notebooks': ${otherNotebooks.length}`);
    
    if (otherNotebooks.length > 0) {
      console.log('\nOther brands:');
      otherNotebooks.forEach(o => console.log(`- ${o.name}`));
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();

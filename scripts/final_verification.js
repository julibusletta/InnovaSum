const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function verify() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
        id: String, 
        name: String, 
        price: Number, 
        stock: Number, 
        image: String, 
        category: String 
    }));
    
    const idsToCheck = [
        'iphone-17-256gb-a3258-ll-a-esim-black',
        'iphone-15-128gb-a2846-128gb-black-esim',
        'jbl-boombox-4-black',
        'samsung-a56-a566e-5g-12-256gb-light-gray',
        'realme-p3-ultra-rmx5031-5g-512gb-12ram-nfc-blue'
    ];
    
    const items = await Product.find({ id: { $in: idsToCheck } });
    console.log(JSON.stringify(items, null, 2));
    
    // Check total stock count for a category
    const stockCount = await Product.countDocuments({ category: 'iphone', stock: { $gt: 0 } });
    console.log(`Total Iphones con stock: ${stockCount}`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

verify();

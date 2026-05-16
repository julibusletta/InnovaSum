const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
        id: String, 
        name: String, 
        category: String, 
        price: Number, 
        properties: Object, 
        stock: Number 
    }));
    
    // Find iPhone 15 128GB
    const product = await Product.findOne({ 
        name: { $regex: /iphone 15/i, $regex: /128gb/i }
    });
    
    if (product) {
        console.log(`FOUND: ${product.name} - Price: ${product.price}`);
    } else {
        const anyIphone = await Product.findOne({ category: 'iphone' });
        if (anyIphone) console.log(`ANY IPHONE: ${anyIphone.name} - Price: ${anyIphone.price}`);
        else console.log("No Iphones found at all");
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();

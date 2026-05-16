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
    
    // Find iPhone 13 256GB to compare price
    const product = await Product.findOne({ 
        name: { $regex: /iphone 13/i, $regex: /256gb/i }
    });
    
    if (product) {
        console.log(`FOUND: ${product.name} - Price: ${product.price}`);
    } else {
        console.log("Product not found");
        // List some others to see
        const others = await Product.find({ category: 'iphone' }).limit(5);
        others.forEach(p => console.log(`${p.name}: ${p.price}`));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();

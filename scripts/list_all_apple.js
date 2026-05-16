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
    
    // List all products in apple related categories
    const categories = ['iphone', 'ipad', 'macbook', 'apple', 'watch'];
    const products = await Product.find({ 
        category: { $in: categories } 
    });
    
    console.log(`TOTAL APPLE PRODUCTS IN DB: ${products.length}`);
    products.forEach(p => {
        console.log(`[${p.id}] ${p.name} - Price: ${p.price} - Category: ${p.category} - Color: ${p.properties?.color}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();

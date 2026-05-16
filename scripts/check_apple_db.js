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
    
    // Find all Apple related stuff
    const products = await Product.find({ 
        $or: [
            { name: { $regex: /iphone|ipad|macbook|apple/i } },
            { category: { $in: ['watch', 'celulares', 'iphone', 'macbook', 'ipad'] } }
        ]
    }).limit(10);
    
    console.log(JSON.stringify(products, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();

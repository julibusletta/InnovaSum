const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Configuration
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";
const DATA_DIR = path.join(__dirname, '..', 'data');

// Schema Definitions (Simple versions for migration)
const CategorySchema = new mongoose.Schema({
  id: String, name: String, image: String, isMain: Boolean, slug: String, description: String
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  id: String, name: String, price: Number, originalPrice: Number, discount: Number, 
  image: String, category: String, description: String, stock: Number, badge: String
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  id: String, userEmail: String, userName: String, items: Array, total: Number, 
  status: String, navePaymentId: String, shippingAddress: Object
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  email: String, firstName: String, lastName: String, dni: String, role: String, address: Object
}, { timestamps: true });

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const CategoryModel = mongoose.model('Category', CategorySchema);
    const ProductModel = mongoose.model('Product', ProductSchema);
    const OrderModel = mongoose.model('Order', OrderSchema);
    const UserModel = mongoose.model('User', UserSchema);

    // 1. Migrate Categories
    console.log('Migrating Categories...');
    const categoriesMockPath = path.join(__dirname, '..', 'lib', 'api', 'mockCategories.ts');
    // For categories, we take them from the mock list in the code because there is no json
    const categories = [
      { id: 'celulares', name: 'Celulares', image: '/images/categories/celulares.png', isMain: false, slug: 'celulares', description: 'Los últimos modelos de las mejores marcas' },
      { id: 'auriculares', name: 'Auriculares', image: '/images/categories/auriculares.png', isMain: false, slug: 'auriculares', description: 'Sonido de alta fidelidad y cancelación de ruido' },
      { id: 'parlantes', name: 'Parlantes', image: '/images/categories/parlantes.png', isMain: false, slug: 'parlantes', description: 'Potencia y claridad en cada nota' },
      { id: 'apple', name: 'Apple', image: '/images/categories/apple.png', isMain: false, slug: 'apple', description: 'El ecosistema completo de Apple en tus manos' },
      { id: 'notebooks', name: 'Notebooks', image: '/images/categories/notebooks.png', isMain: false, slug: 'notebooks', description: 'Potencia portátil para trabajo y diseño' },
      { id: 'iphone', name: 'iPhone', image: '/images/categories/iphone.png', isMain: false, slug: 'iphone', description: 'El teléfono más avanzado con el chip más potente' },
      { id: 'macbook', name: 'Macbook', image: '/images/categories/macbook.png', isMain: false, slug: 'macbook', description: 'Rendimiento excepcional para profesionales' },
      { id: 'watch', name: 'Apple Watch', image: '/images/categories/watch.png', isMain: false, slug: 'watch', description: 'Lleva tu salud y conectividad en tu muñeca' }
    ];
    
    for (const cat of categories) {
      await CategoryModel.findOneAndUpdate({ id: cat.id }, cat, { upsert: true });
    }

    // 2. Migrate Products
    console.log('Migrating Products...');
    const productsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf8'));
    for (const prod of productsData) {
      await ProductModel.findOneAndUpdate({ id: prod.id }, prod, { upsert: true });
    }

    // 3. Migrate Users
    console.log('Migrating Users...');
    if (fs.existsSync(path.join(DATA_DIR, 'users.json'))) {
      const users = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'users.json'), 'utf8'));
      for (const user of users) {
        await UserModel.findOneAndUpdate({ email: user.email }, user, { upsert: true });
      }
    }

    // 4. Migrate Orders
    console.log('Migrating Orders...');
    if (fs.existsSync(path.join(DATA_DIR, 'orders.json'))) {
      const orders = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'orders.json'), 'utf8'));
      for (const order of orders) {
        await OrderModel.findOneAndUpdate({ id: order.id }, order, { upsert: true });
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();

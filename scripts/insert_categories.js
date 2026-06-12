const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/innovasum?appName=admin";

const CategorySchema = new mongoose.Schema({
  id: String, name: String, image: String, isMain: Boolean, slug: String, description: String
}, { timestamps: true });

async function insertCategories() {
  try {
    await mongoose.connect(MONGODB_URI);
    const CategoryModel = mongoose.model('Category', CategorySchema);

    const categories = [
      { id: 'starlink', name: 'Starlink', image: '/images/categories/starlink.png', isMain: true, slug: 'starlink', description: 'Conectividad Starlink y Accesorios' },
      { id: 'accesorios-starlink', name: 'Accesorios Starlink', image: '/images/categories/starlink.png', isMain: false, slug: 'accesorios-starlink', description: 'Accesorios para tu Antena Starlink' },
      { id: 'inversores-12-30v', name: 'Inversores 12-30V', image: '/images/products/starlink-mini-cable.webp', isMain: false, slug: 'inversores-12-30v', description: 'Conversores e inversores de voltaje' },
      { id: 'soportes', name: 'Soportes', image: '/images/products/soporte-techo-imanes.webp', isMain: false, slug: 'soportes', description: 'Soportes magnéticos y de techo' },
      { id: 'detectores-monoxido', name: 'Detectores de Monóxido', image: '/images/products/detector-monoxido.webp', isMain: true, slug: 'detectores-monoxido', description: 'Sensores y alarmas de seguridad' },
      { id: 'smarthome', name: 'Smart Home', image: '/images/categories/smart-home.png', isMain: true, slug: 'smarthome', description: 'Hogar Inteligente y Domótica' },
      { id: 'auriculares', name: 'Auriculares', image: '/images/categories/auriculares.png', isMain: true, slug: 'auriculares', description: 'Auriculares Traductores y Audio' }
    ];

    for (const cat of categories) {
      await CategoryModel.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
    }

    console.log('Categories inserted!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

insertCategories();

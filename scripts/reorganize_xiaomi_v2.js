const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function reorganize() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado!');

    const allProducts = await Product.find({ 
      $or: [
        { name: /Xiaomi/i },
        { category: /xiaomi/i }
      ]
    });

    console.log(`Encontrados ${allProducts.length} productos Xiaomi para procesar.`);

    let vacuumCount = 0;
    let watchCount = 0;
    let phoneCount = 0;

    for (const prod of allProducts) {
      let newCategory = prod.category;
      const name = prod.name.toLowerCase();

      if (name.includes('aspiradora') || name.includes('robot') || name.includes('vacuum')) {
        newCategory = 'aspiradoras-robot';
        vacuumCount++;
      } else if (name.includes('watch') || name.includes('reloj') || name.includes('smartwatch') || name.includes('band')) {
        newCategory = 'xiaomi-watches';
        watchCount++;
      } else {
        // Por defecto, si es Xiaomi y no es aspiradora ni reloj, lo categorizamos como 'xiaomi' (celulares)
        newCategory = 'xiaomi';
        phoneCount++;
      }

      if (newCategory !== prod.category) {
        await Product.updateOne({ _id: prod._id }, { $set: { category: newCategory } });
        console.log(`Actualizado: [${prod.name}] -> ${newCategory}`);
      }
    }

    console.log('\nResumen de Reorganización:');
    console.log(`- Aspiradoras: ${vacuumCount}`);
    console.log(`- Relojes: ${watchCount}`);
    console.log(`- Celulares/Otros: ${phoneCount}`);
    console.log('\nProceso completado con éxito.');
    process.exit(0);
  } catch (err) {
    console.error('Error durante la migración:', err);
    process.exit(1);
  }
}

reorganize();

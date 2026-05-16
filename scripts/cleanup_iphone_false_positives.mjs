import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function cleanup() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  // Find products that have the "iPhone Air" spec but aren't named "IPHONE AIR"
  const falsePositives = await Product.find({
    name: { $not: /IPHONE AIR/i },
    "specifications.value": "Diseño de Titanio ultra delgado (5.64mm) en Negro Espacial, Blanco Nube, Oro Claro y Azul Cielo."
  });

  console.log(`Encontrados ${falsePositives.length} falsos positivos para limpiar.`);
  
  if (falsePositives.length > 0) {
    const result = await Product.updateMany(
      { _id: { $in: falsePositives.map(p => p._id) } },
      { $unset: { specifications: "" } }
    );
    console.log(`Limpiados ${result.modifiedCount} productos.`);
  }

  process.exit(0);
}

cleanup();

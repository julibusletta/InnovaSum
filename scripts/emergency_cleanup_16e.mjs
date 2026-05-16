import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function emergencyCleanup() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  // Find products that have the "iPhone 16E" SPECIFIC spec but aren't named "IPHONE 16E"
  const falsePositives = await Product.find({
    name: { $not: /IPHONE 16E/i },
    "specifications.value": "Super Retina XDR OLED de 6.1\", Dynamic Island, 1600 nits pico."
  });

  console.log(`Encontrados ${falsePositives.length} falsos positivos de 16E para limpiar.`);
  
  if (falsePositives.length > 0) {
    const result = await Product.updateMany(
      { _id: { $in: falsePositives.map(p => p._id) } },
      { $unset: { specifications: "" } }
    );
    console.log(`Limpiados ${result.modifiedCount} productos.`);
  }

  process.exit(0);
}

emergencyCleanup();

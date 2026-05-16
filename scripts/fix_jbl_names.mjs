import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function fixJBLNames() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const replacements = [
      { from: /JBL CHARGE 5/i, to: 'JBL CHARGE 6' },
      { from: /JBL FLIP 6/i, to: 'JBL FLIP 7' },
      { from: /JBL BOOMBOX 3/i, to: 'JBL BOOMBOX 4' }
    ];

    let totalUpdated = 0;

    for (const replacement of replacements) {
      const products = await Product.find({ name: replacement.from });
      console.log(`Found ${products.length} products matching ${replacement.from}`);
      
      for (const prod of products) {
        const newName = prod.name.replace(replacement.from, replacement.to);
        await Product.updateOne({ _id: prod._id }, { $set: { name: newName } });
        console.log(`Renamed: "${prod.name}" -> "${newName}"`);
        totalUpdated++;
      }
    }

    console.log(`Successfully renamed ${totalUpdated} JBL products.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

fixJBLNames();

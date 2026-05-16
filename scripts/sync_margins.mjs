import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB...');

    const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({ 
      slug: String, 
      markupPercent: Number, 
      markupFixed: String 
    }, { strict: false }));

    const marginConfigs = [
      {
        slugs: ['xiaomi'],
        percent: 20,
        fixed: '>500: +10% | <500: +$10k ARS'
      },
      {
        slugs: ['notebooks'],
        percent: 10,
        fixed: '>500: +10% | <500: +$30 USD'
      },
      {
        slugs: ['apple-accesorios'],
        percent: 15, // Average or note both
        fixed: '>200: 20% (+$10 USD) | <200: 10% (+$10k ARS)'
      },
      {
        slugs: [
          'iphone', 'aspiradoras-robot', 'tablets', 'realme', 'samsung', 
          'motorola', 'amazon', 'parlantes', 'watch', 'auriculares',
          'smart-home', 'accesorios-starlink', 'general'
        ],
        percent: 30,
        fixed: '>500: +10% | <500: +$20 USD'
      }
    ];

    let updatedCount = 0;
    for (const config of marginConfigs) {
      const result = await Category.updateMany(
        { slug: { $in: config.slugs } },
        { 
          $set: { 
            markupPercent: config.percent,
            markupFixed: config.fixed
          } 
        }
      );
      updatedCount += result.modifiedCount;
      console.log(`Actualizadas ${result.modifiedCount} categorías para: ${config.slugs.join(', ')}`);
    }

    console.log(`Total de categorías actualizadas con márgenes oficiales: ${updatedCount}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error durante la sincronización de márgenes:', err);
    process.exit(1);
  }
}

run();

import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const imageMapping = {
  'XIAOMI NOTE 14 PRO 512GB 12RAM 5G VERDE GLOBAL': {
    main: 'https://i01.appmifile.com/webfile/globalimg/products/pc/redmi-note-14-pro-5g/ivy-green.png',
    gallery: [
      'https://i01.appmifile.com/webfile/globalimg/products/pc/redmi-note-14-pro-5g/ivy-green.png',
      'https://m.media-amazon.com/images/I/71X8X8Z6ZLL._SL1500_.jpg',
      'https://i02.appmifile.com/832_operator_sg/29/08/2024/7f5e1e5b5f5b5f5b5f5b5f5b5f5b5f5b.png',
      'https://i01.appmifile.com/webfile/globalimg/in/cms/3932E506-69E2-658E-A360-15A6208E2BE2.jpg'
    ]
  },
  'XIAOMI NOTE 14 128GB 6RAM PÚRPURA GLOBAL': {
    main: 'https://m.media-amazon.com/images/I/61X8X8Z6ZLL._SL1500_.jpg',
    gallery: [
      'https://m.media-amazon.com/images/I/61X8X8Z6ZLL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71R1G7O-GSL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61a7-Fk6dRL._SL1500_.jpg'
    ]
  },
  'XIAOMI NOTE 14 128GB 6RAM AZUL GLOBAL': {
    main: 'https://m.media-amazon.com/images/I/81X8X8Z6ZLL._SL1500_.jpg',
    gallery: [
      'https://m.media-amazon.com/images/I/81X8X8Z6ZLL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71B7C-GSL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81a7-Fk6dRL._SL1500_.jpg'
    ]
  },
  'XIAOMI REDMI A5 64GB 3RAM AZUL GLOBAL': {
    main: 'https://m.media-amazon.com/images/I/71vW8Z6ZLL._SL1500_.jpg',
    gallery: [
      'https://m.media-amazon.com/images/I/71vW8Z6ZLL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/81vW8Z6ZLL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/91vW8Z6ZLL._SL1500_.jpg'
    ]
  },
  'XIAOMI REDMI 15C 256GB 8RAM AZUL GLOBAL': {
    main: 'https://m.media-amazon.com/images/I/51X8X8Z6ZLL._SL1500_.jpg',
    gallery: [
      'https://m.media-amazon.com/images/I/51X8X8Z6ZLL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61X8X8Z6ZLL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/71X8X8Z6ZLL._SL1500_.jpg'
    ]
  }
};

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    console.log('Updating product images...');

    for (const [name, assets] of Object.entries(imageMapping)) {
      const result = await Product.updateMany(
        { name: name },
        { 
          $set: { 
            image: assets.main,
            images: assets.gallery,
            updatedAt: new Date()
          } 
        }
      );
      console.log(`Updated "${name}": ${result.modifiedCount} matches modified.`);
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();

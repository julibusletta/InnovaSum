
import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}), 'products');
    
    const samsungProds = await Product.find({ 
      $or: [
        { category: 'samsung' }, 
        { name: { $regex: /SAMSUNG/i } }
      ] 
    }).lean();

    console.log(`Total Samsung products: ${samsungProds.length}`);
    
    const models = new Set();
    samsungProds.forEach(p => {
      let name = p.name.toUpperCase().replace('SAMSUNG ', '').trim();
      
      // Look for S series, A series, Tab, Flip, Fold
      let model = '';
      if (name.includes('S24') || name.includes('S25') || name.includes('S23')) {
          const match = name.match(/S\d+\s*(ULTRA|PLUS|\+)?/i);
          if (match) model = match[0];
      } else if (name.includes('A\d+') || name.includes('A\d+')) {
          const match = name.match(/A\d+\s*(\d+)?/i);
          if (match) model = match[0];
      } else if (name.includes('TAB')) {
          const match = name.match(/TAB\s*[A-Z0-9\s]+/i);
          if (match) model = match[0];
      } else if (name.includes('FLIP') || name.includes('FOLD')) {
          const match = name.match(/(GALAXY\s*)?(Z\s*)?(FLIP|FOLD)\s*\d+/i);
          if (match) model = match[0];
      } else {
          // Fallback splitting
          model = name.split(/\s+\d+GB|\d+RAM|GLOBAL|AZUL|NEGRO|VERDE|PÚRPURA|TITANIUM|TITANIO|GOLD|DORADO|SILVER|PLATA|LAVENDER|PINK|WHITE|GRAY|GREY|CREAM|CREME|BLACK|BLUE|GREEN|PURPLE|VIOLET|\//i)[0].trim();
      }
      
      if (model && model.length > 1) {
        models.add(model.toUpperCase().replace('SAMSUNG ', '').trim());
      }
    });

    console.log('List of Models:');
    console.log(JSON.stringify(Array.from(models).sort(), null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();

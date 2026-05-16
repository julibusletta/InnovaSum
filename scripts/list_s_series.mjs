
import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    const prods = await mongoose.connection.collection('products').find({ 
      name: { $regex: /S2[3-5]/i }
    }).toArray();

    const names = prods.map(p => p.name);
    console.log(JSON.stringify(names, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();

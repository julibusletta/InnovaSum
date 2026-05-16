const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function findBanners() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    for (const col of collections) {
      const collection = db.collection(col.name);
      
      const doc = await collection.findOne({
        $or: [
          { "heroSlides.alt": "Tecnología" },
          { "heroSlides.link": "/category/celulares" },
          { "alt": "Tecnología" },
          { "link": "/category/celulares" },
          { "image": /bannerof/ }
        ]
      });

      if (doc) {
        console.log(`Encontrado en colección: ${col.name}`);
        console.log(JSON.stringify(doc, null, 2));
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findBanners();

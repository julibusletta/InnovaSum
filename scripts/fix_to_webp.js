const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function fixToWebp() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    const settings = await db.collection('homesettings').findOne({});
    if (settings && settings.heroSlides) {
        const updatedSlides = settings.heroSlides.map(s => {
            if (s.image.includes('bannerof2')) {
                return { ...s, image: "/images/bannerof2.webp" };
            }
            return s;
        });

        await db.collection('homesettings').updateOne(
            { _id: settings._id },
            { $set: { heroSlides: updatedSlides } }
        );
        console.log("¡DB actualizada a .webp!");
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixToWebp();

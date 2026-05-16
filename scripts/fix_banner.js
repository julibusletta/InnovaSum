const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function fixBanner() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    const settings = await db.collection('homesettings').findOne({});
    if (!settings) {
        console.log("No se encontró la colección homesettings.");
        process.exit(1);
    }

    if (settings.heroSlides) {
        // Fix image extension
        let updatedSlides = settings.heroSlides.map(s => {
            if (s.image === "/images/bannerof2") {
                return { ...s, image: "/images/bannerof2.png" };
            }
            return s;
        });

        // Fix ordering (ensure sequential from 0)
        updatedSlides.sort((a, b) => (a.order || 0) - (b.order || 0));
        updatedSlides = updatedSlides.map((s, idx) => ({ ...s, order: idx }));

        await db.collection('homesettings').updateOne(
            { _id: settings._id },
            { $set: { heroSlides: updatedSlides } }
        );
        console.log("¡Ruta del banner y orden corregidos satisfactoriamente!");
        console.log("Número total de slides en DB:", updatedSlides.length);
        updatedSlides.forEach(s => console.log(`- [${s.order}] ${s.image}`));
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixBanner();

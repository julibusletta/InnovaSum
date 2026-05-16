const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(MONGODB_URI);
  const HomeSettings = mongoose.models.HomeSettings || mongoose.model('HomeSettings', new mongoose.Schema({}, { strict: false }));
  
  const hd = await HomeSettings.findOne();
  console.log(JSON.stringify(hd.weeklyOffers, null, 2));

  process.exit();
}

run().catch(console.error);

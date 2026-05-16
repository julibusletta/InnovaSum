import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const GlobalSettings = mongoose.models.GlobalSettings || mongoose.model('GlobalSettings', new mongoose.Schema({
    exchangeRate: Number,
    lastUpdated: Date
  }, { timestamps: true }));

  const existing = await GlobalSettings.findOne();
  if (!existing) {
    await GlobalSettings.create({ exchangeRate: 1500 });
    console.log('Initialized GlobalSettings with exchangeRate: 1500');
  } else {
    console.log(`GlobalSettings already exists. Current rate: ${existing.exchangeRate}`);
  }

  process.exit(0);
}

run().catch(console.error);

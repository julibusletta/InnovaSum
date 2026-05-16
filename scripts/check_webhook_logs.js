
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env manually
const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf-8');
const envLines = envContent.split(/\r?\n/);
envLines.forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
});

const MONGODB_URI = process.env.MONGODB_URI;

const WebhookLogSchema = new mongoose.Schema({
  service: String,
  payload: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
  orderId: String,
  status: String,
});

const WebhookLog = mongoose.models.WebhookLog || mongoose.model('WebhookLog', WebhookLogSchema);

async function checkLogs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const logs = await WebhookLog.find({}).sort({ timestamp: -1 }).limit(20).lean();

    if (logs.length === 0) {
      console.log('NO WEBHOOK LOGS FOUND. Nave is NOT hitting the endpoint.');
    } else {
      console.log('LATEST WEBHOOK LOGS:');
      console.log(JSON.stringify(logs, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }
}

checkLogs();

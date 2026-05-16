
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
    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

const OrderSchema = new mongoose.Schema({
  id: String,
  userEmail: String,
  userName: String,
  status: String,
  navePaymentId: String,
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

async function checkOrders() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    console.log('Fetching last 10 orders...');
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(10).lean();

    console.log('ORDERS FOUND:');
    orders.forEach(o => {
      console.log(`- ID: ${o.id} | Email: ${o.userEmail} | Status: ${o.status} | NaveID: ${o.navePaymentId || 'N/A'} | Created: ${o.createdAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }
}

checkOrders();

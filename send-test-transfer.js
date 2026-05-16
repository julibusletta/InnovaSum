const fs = require('fs');
const path = require('path');

// Cargar manualmente el archivo .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
}

// Ahora requerir el mailer
const { mailer } = require('./lib/mailer');

async function sendTest() {
  const mockOrder = {
    id: 'JB-TEST-123456',
    userEmail: 'germanmcdonalds59@gmail.com',
    total: 843241.5,
    items: [
      { name: 'XIAOMI 14T PRO 512GB 12GB RAM 5G', quantity: 1, price: 936935 }
    ],
    shippingAddress: {
      shippingMethod: 'RETIRO EN SUCURSAL ANDREANI',
      zip: '1852'
    }
  };

  console.log('Enviando mail de prueba a germanmcdonalds59@gmail.com...');
  try {
    await mailer.sendTransferOrderReceived('germanmcdonalds59@gmail.com', 'German McDonalds', mockOrder);
    console.log('¡Mail enviado con éxito!');
  } catch (error) {
    console.error('Error al enviar el mail:', error.message);
  }
}

sendTest();

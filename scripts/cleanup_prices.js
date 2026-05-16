const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

function getMongoUri() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.startsWith('MONGODB_URI=')) {
        return line.split('MONGODB_URI=')[1].trim();
      }
    }
  }
  return null;
}

async function cleanup() {
  const uri = getMongoUri();
  if (!uri) {
    console.error('No MONGODB_URI found in .env');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('--- Conectado a MongoDB ---');
    const db = client.db();
    const collection = db.collection('products');

    // Criterio: Productos sin descuento (null, 0 o undefined)
    const query = {
      $or: [
        { discount: { $exists: false } },
        { discount: null },
        { discount: 0 }
      ]
    };

    // Acción: Quitar el originalPrice
    const update = {
      $unset: { originalPrice: "" }
    };

    console.log('Buscando productos para limpiar...');
    const result = await collection.updateMany(query, update);

    console.log(`--- Limpieza Completada ---`);
    console.log(`Productos actualizados: ${result.modifiedCount}`);
    
  } catch (err) {
    console.error('Error durante la limpieza:', err);
  } finally {
    await client.close();
  }
}

cleanup();

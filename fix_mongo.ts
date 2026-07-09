import { MongoClient } from 'mongodb';
import * as fs from 'fs';

async function run() {
  const envContent = fs.readFileSync('.env', 'utf-8');
  let uri = '';
  for (const line of envContent.split('\n')) {
    if (line.startsWith('MONGODB_URI=')) {
      uri = line.split('=')[1].trim().replace(/^"|"$/g, '');
      if (uri.includes('?')) {
        const parts = uri.split('?');
        const searchParams = new URLSearchParams(parts[1]);
        if (searchParams.has('appName') && !searchParams.get('appName')) {
          searchParams.delete('appName');
        }
        uri = parts[0] + '?' + searchParams.toString();
      }
    }
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  
  const res1 = await db.collection('products').updateMany(
    { image: '/images/products/xiaomi-vacuum.png' },
    { $set: { image: '/images/no-image.svg' } }
  );
  
  const res2 = await db.collection('products').updateMany(
    { image: '/images/placeholder.jpg' },
    { $set: { image: '/images/no-image.svg' } }
  );
  
  const res3 = await db.collection('products').updateMany(
    { image: '/images/placeholder.png' },
    { $set: { image: '/images/no-image.svg' } }
  );
  
  const res4 = await db.collection('products').updateMany(
    { image: "" },
    { $set: { image: '/images/no-image.svg' } }
  );
  
  const res5 = await db.collection('products').updateMany(
    { image: null },
    { $set: { image: '/images/no-image.svg' } }
  );

  console.log('Vacuum updates:', res1.modifiedCount);
  console.log('Placeholder JPG updates:', res2.modifiedCount);
  console.log('Placeholder PNG updates:', res3.modifiedCount);
  console.log('Empty string updates:', res4.modifiedCount);
  console.log('Null updates:', res5.modifiedCount);
  
  await client.close();
}
run().catch(console.error);

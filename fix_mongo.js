require('dotenv').config({path: '.env.local'});
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected');
  const res1 = await mongoose.connection.collection('products').updateMany({image: '/images/products/xiaomi-vacuum.png'}, {$set: {image: '/images/no-image.svg'}});
  const res2 = await mongoose.connection.collection('products').updateMany({image: '/images/placeholder.jpg'}, {$set: {image: '/images/no-image.svg'}});
  console.log('Xiaomi Vacuum fixes:', res1);
  console.log('Placeholder JPG fixes:', res2);
  mongoose.connection.close();
}).catch(console.error);

const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  isMain: { type: Boolean, default: false },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
});

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

  // Tablets
  await Category.findOneAndUpdate(
    { slug: 'tablets' },
    {
      id: 'cat-tablets',
      name: 'Tablets',
      image: '/images/categories/ipad.png', // Try a semi-valid image name like ipad or notebooks
      isMain: false,
      slug: 'tablets',
      description: 'Tablets Apple, Samsung y Xiaomi'
    },
    { upsert: true }
  );

  // Notebooks y Tablets
  await Category.findOneAndUpdate(
    { slug: 'notebooks-y-tablets' },
    {
      id: 'cat-notebooks-y-tablets',
      name: 'Notebooks y Tablets',
      image: '/images/categories/notebooks.png',
      isMain: false,
      slug: 'notebooks-y-tablets',
      description: 'Navegación de Notebooks y Tablets'
    },
    { upsert: true }
  );

  console.log("Categorias creadas/actualizadas exitosamente.");
  process.exit(0);
}

run().catch(console.error);

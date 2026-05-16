import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB...');

    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ category: String }, { strict: false }));
    const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({ id: String, slug: String, name: String }, { strict: false }));

    const products = await Product.find({});
    console.log(`Procesando ${products.length} productos...`);

    const normalizeSlug = (slug) => {
      if (!slug) return 'general';
      let clean = slug.toLowerCase().trim();
      // Remove 'cat-cat-' and 'cat-' prefixes
      while (clean.startsWith('cat-')) {
        clean = clean.replace(/^cat-/, '');
      }
      
      // Known unifications
      if (clean === 'iphones usados,productos apple') return 'iphone';
      if (clean === 'parlantes y auriculares') return 'auriculares'; // Or split? For now keep it simple
      if (clean === 'notebooks-y-tablets') return 'notebooks';
      if (clean.includes('consolas')) return 'general';
      
      return clean;
    };

    let updatedProducts = 0;
    for (const p of products) {
      const newCat = normalizeSlug(p.category);
      if (newCat !== p.category) {
        await Product.updateOne({ _id: p._id }, { $set: { category: newCat } });
        updatedProducts++;
      }
    }
    console.log(`${updatedProducts} productos actualizados con categorías normalizadas.`);

    // Now cleanup categories collection
    const categories = await Category.find({});
    const seenSlugs = new Set();
    let deletedCategories = 0;

    for (const cat of categories) {
      const cleanSlug = normalizeSlug(cat.slug);
      
      // If the slug was changed by normalization, update the record or delete if already exists
      const targetId = `cat-${cleanSlug}`;
      const alreadyExists = await Category.findOne({ $or: [{ id: targetId }, { slug: cleanSlug }] });

      if ((alreadyExists && alreadyExists._id.toString() !== cat._id.toString()) || seenSlugs.has(cleanSlug)) {
          // Already have a record for this clean slug, delete this duplicate
          await Category.deleteOne({ _id: cat._id });
          deletedCategories++;
          console.log(`Borrada categoría duplicada: ${cat.slug}`);
      } else {
          // Update this record to the clean slug
          await Category.updateOne({ _id: cat._id }, { 
            $set: { 
              slug: cleanSlug, 
              id: targetId,
              name: cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1).replace(/-/g, ' ')
            } 
          });
          seenSlugs.add(cleanSlug);
          console.log(`Normalizado slug de categoría: ${cat.slug} -> ${cleanSlug}`);
      }
    }
    
    console.log(`${deletedCategories} categorías duplicadas eliminadas.`);

    // Ensure all categories used by products exist
    const distinctProductCats = await Product.distinct('category');
    for (const catSlug of distinctProductCats) {
      const exists = await Category.findOne({ slug: catSlug });
      if (!exists) {
        console.log(`Creando categoría faltante para productos: ${catSlug}`);
        await Category.create({
          id: `cat-${catSlug}`,
          slug: catSlug,
          name: catSlug.charAt(0).toUpperCase() + catSlug.slice(1).replace(/-/g, ' '),
          image: `/images/categories/${catSlug}.png`,
          isMain: false,
          description: `Sección de ${catSlug}`
        });
      }
    }

    console.log('--- LIMPIEZA COMPLETADA ---');
    process.exit(0);
  } catch (err) {
    console.error('Error durante la limpieza:', err);
    process.exit(1);
  }
}

run();

import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';
const DRY_RUN = true;

function normalizeName(name) {
  let n = name.toLowerCase();
  n = n.replace(/xiaomi/g, '');
  n = n.replace(/global/g, '');
  n = n.replace(/5g/g, '');
  n = n.replace(/4g/g, '');
  
  // Normalize storage and ram
  n = n.replace(/(\d+)gb\s+(\d+)ram/g, '$1 $2');
  n = n.replace(/(\d+)\s+(\d+)ram/g, '$1 $2');
  n = n.replace(/(\d+)\/(\d+)gb/g, '$1 $2');
  n = n.replace(/(\d+)\/(\d+)/g, '$1 $2');
  
  n = n.replace(/\s+/g, ' ').trim();
  
  return n;
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const products = await Product.find({ category: 'xiaomi' }).lean();
    
    console.log(`Analyzing ${products.length} products in Xiaomi category...`);

    const groups = new Map();

    for (const p of products) {
      const norm = normalizeName(p.name);
      if (!groups.has(norm)) {
        groups.set(norm, []);
      }
      groups.get(norm).push(p);
    }

    const toDelete = [];
    const toKeep = [];

    for (const [norm, members] of groups.entries()) {
      if (members.length > 1) {
        // Sort to pick the best one
        // Priority: 1. has costPrice, 2. higher price, 3. longer name (usually more detailed)
        members.sort((a, b) => {
          const hasA = (a.costPrice !== undefined && a.costPrice !== null);
          const hasB = (b.costPrice !== undefined && b.costPrice !== null);
          if (hasA !== hasB) return hasA ? -1 : 1;
          
          if (a.price !== b.price) return b.price - a.price;
          
          return b.name.length - a.name.length;
        });

        const keep = members[0];
        toKeep.push(keep);
        
        for (let i = 1; i < members.length; i++) {
          toDelete.push(members[i]);
        }
      }
    }

    console.log(`\nFound ${toDelete.length} duplicates to delete.`);

    if (toDelete.length > 0) {
      console.log('\n--- DUPLICATES IDENTIFIED ---');
      toDelete.forEach((p, index) => {
        const groupKey = normalizeName(p.name);
        const keep = toKeep.find(k => normalizeName(k.name) === groupKey);
        console.log(`${index + 1}. [DELETE] "${p.name}" (Price: ${p.price}, Cost: ${p.costPrice || 'N/A'}, ID: ${p._id})`);
        console.log(`    [KEEP]   "${keep.name}" (Price: ${keep.price}, Cost: ${keep.costPrice || 'N/A'}, ID: ${keep._id})`);
      });

      if (!DRY_RUN) {
        const ids = toDelete.map(p => p._id);
        const result = await Product.deleteMany({ _id: { $in: ids } });
        console.log(`\nSuccessfully deleted ${result.deletedCount} products.`);
      } else {
        console.log('\n[DRY RUN] No products were deleted.');
      }
    } else {
      console.log('\nNo obvious duplicates found.');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();

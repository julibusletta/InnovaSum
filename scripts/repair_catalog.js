const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

// 1. Formula Constants
const PRICE_LIMIT = 500;
const SMALL_ADJUST = 20;
const LARGE_RATE = 1.10;
const USD_ARS = 1500;
const PROFIT_MARGIN = 1.30;

function calculatePrice(usdPrice) {
    let base = usdPrice < PRICE_LIMIT ? (usdPrice + SMALL_ADJUST) : (usdPrice * LARGE_RATE);
    return Math.round((base * USD_ARS) * PROFIT_MARGIN);
}

// 2. Category Map (Correct IDs for innovasum)
const CATEGORY_MAP = {
    'IPHONE': 'iphone',
    'APPLEWATCH': 'watch',
    'JBL': 'cat-parlantes y auriculares',
    'MOTOROLA': 'cat-motorola',
    'SAMSUNG': 'cat-samsung',
    'REALME': 'cat-realme',
    'AMAZON': 'cat-amazon',
    'XIAOMI': 'cat-xiaomi'
};

async function repairAndSync() {
  try {
    console.log('--- INICIANDO FASE DE REPARACIÓN Y SINCRONIZACIÓN ---');
    await mongoose.connect(MONGODB_URI);
    
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
        id: { type: String, unique: true }, 
        name: String, 
        category: String, 
        price: Number, 
        originalPrice: Number,
        properties: Object, 
        stock: Number,
        image: String,
        images: [String]
    }));

    // 3. Load Existing Images Whitelist
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'products');
    const existingImages = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];
    console.log(`Imágenes encontradas en local: ${existingImages.length}`);

    // 4. Load Data from OCR
    const ocrPath = path.join(process.cwd(), 'scripts', 'full_stock_ocr.json');
    const ocrData = JSON.parse(fs.readFileSync(ocrPath, 'utf8'));

    const productsToSync = [];

    function cleanName(name) {
        return name
            .replace(/CAIXA DE SOM/gi, '')
            .replace(/FONE/gi, '')
            .replace(/ROBOT/gi, 'Aspiradora')
            .replace(/TABLET/gi, 'Tablet')
            .replace(/\//g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getLocalImage(name) {
        const clean = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        // Check for direct match
        let found = existingImages.find(img => img.toLowerCase().includes(clean));
        if (found) return `/images/products/${found}`;
        
        // Brand placeholders
        if (name.toUpperCase().includes('IPHONE')) return '/images/products/iphone-16.png';
        if (name.toUpperCase().includes('WATCH')) return '/images/products/apple-watch-s10.webp';
        if (name.toUpperCase().includes('JBL')) return '/images/products/jbl-flip-7.webp';
        if (name.toUpperCase().includes('SAMSUNG')) return '/images/products/samsung-a56-a566e-5g.webp';
        
        return '/images/products/default-product.png'; // Make sure this shows something even if empty
    }

    // 5. Build Sync Queue
    Object.keys(ocrData).forEach(brand => {
        const lines = ocrData[brand].split('\n');
        lines.forEach(line => {
            const match = line.match(/^\d+-\d+\s+(.*?)\s+(\d+[\.,]\s?\d{2})\s*$/) || 
                          line.match(/^\d+-\d+\s+(.*?)\/(\d+[\.,]\s?\d{2})\s*$/);
            if (match) {
                const rawName = match[1].trim();
                const priceUsd = parseFloat(match[2].replace(',', '').replace(/\s/g, ''));
                const cleanedName = cleanName(rawName);
                
                // Grouping by cleaned name to sum stock
                const existing = productsToSync.find(p => p.name === cleanedName);
                if (existing) {
                    existing.stock += 1;
                } else {
                    productsToSync.push({
                        name: cleanedName,
                        price: calculatePrice(priceUsd),
                        category: CATEGORY_MAP[brand] || brand.toLowerCase(),
                        image: getLocalImage(cleanedName),
                        stock: 1,
                        properties: { condition: rawName.includes('CPO') ? 'CPO' : 'NEW' }
                    });
                }
            }
        });
    });

    // 6. Deduplication and Cleanup Phase
    console.log(`Deduplicando ${productsToSync.length} productos contra la DB...`);
    
    for (const p of productsToSync) {
        // Find by name similarity
        const existingInDb = await Product.findOne({
            $or: [
                { name: new RegExp('^' + p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
                { id: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
            ]
        });

        if (existingInDb) {
            // Update existing product
            await Product.updateOne(
                { _id: existingInDb._id },
                { 
                    $set: { 
                        price: p.price, 
                        stock: p.stock, 
                        category: p.category, 
                        image: p.image 
                    } 
                }
            );
        } else {
            // Create new with slug ID
            const newId = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await Product.updateOne(
                { id: newId },
                { $set: { ...p, id: newId } },
                { upsert: true }
            );
        }
    }

    // 7. Cleanup OLD duplicates (those I created with bad names)
    console.log('Borrando productos con "/" en el nombre creados anteriormente...');
    await Product.deleteMany({ name: /\/$/ });

    // 8. Stock 0 for missing items in affected categories
    const affectedCategories = Object.values(CATEGORY_MAP);
    const syncedNames = productsToSync.map(p => p.name);
    await Product.updateMany(
        { 
            category: { $in: affectedCategories },
            name: { $nin: syncedNames }
        },
        { stock: 0 }
    );

    console.log('--- REPARACIÓN COMPLETADA ---');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

repairAndSync();

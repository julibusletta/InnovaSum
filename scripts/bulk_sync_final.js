const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

function calculatePrice(usdPrice) {
    let adjusted = usdPrice < 500 ? (usdPrice + 20) : (usdPrice * 1.10);
    let inARS = adjusted * 1500;
    return Math.round(inARS * 1.30);
}

const CATEGORY_MAP = {
    'IPHONE': 'iphone',
    'APPLEWATCH': 'watch',
    'JBL': 'jbl',
    'MOTOROLA': 'motorola',
    'SAMSUNG': 'samsung',
    'REALME': 'realme',
    'AMAZON': 'amazon',
    'XIAOMI': 'xiaomi'
};

// Master Image Mapping (from research and existing assets)
const IMAGE_RESOURCES = {
    'IPHONE 17': '/images/products/iphone-17.png',
    'IPHONE 17 PRO': '/images/products/iphone-17-pro.png',
    'IPHONE 17 PRO MAX': '/images/products/iphone-17-pro-max.png',
    'IPHONE 17E': '/images/products/iphone-17e.png',
    'IPHONE 16': '/images/products/iphone-16.png',
    'IPHONE 15': '/images/products/iphone-15-128gb-dual-sim.gif',
    'IPHONE 13': '/images/products/iphone-13-128gb.webp',
    'IPAD AIR M4': '/images/products/ipad-air.png', // Fallback to existing
    'IPAD PRO 11': '/images/products/ipad-pro.png',
    'MACBOOK M5': '/images/products/macbook-air.png',
    'APPLE WATCH S10': '/images/products/apple-watch-s10.webp',
    'APPLE WATCH ULTRA 3': '/images/products/apple-watch-ultra-2-49-mm-black-titanium-ocean.webp',
    'BOOMBOX 4': '/images/products/jbl-boombox-3.png',
    'FLIP 7': '/images/products/jbl-flip-7.webp',
    'CHARGE 6': '/images/products/jbl-charge-6-black.webp',
    'GO 4': '/images/products/jbl-go-4.webp',
    'SAMSUNG A56': '/images/products/samsung-a56-a566e-5g.webp',
    'SAMSUNG A36': '/images/products/samsung-a36-a366e-5g-8-256gb.webp',
    'POCO X7': '/images/products/xiaomi-poco-x7-12ram-512gb-5g.webp',
    'ECHO DOT 5': '/images/products/echo-dot-5-black.png',
    'FIRE TV': '/images/products/fire-tv-spot.png',
    'G15 XT2521': '/images/products/motorola-g15-xt2521-2-4-256g.webp',
    'G05 XT2523': '/images/products/motorola-g05-xt2523-3-4-128gb.webp'
};

async function sync() {
  try {
    console.log('--- INICIANDO SINCRONIZACIÓN MASIVA ---');
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
        images: [String],
        description: String,
        badge: String
    }));

    const fs = require('fs');
    const path = require('path');
    const ocrData = JSON.parse(fs.readFileSync(path.join(__dirname, 'full_stock_ocr.json'), 'utf8'));

    const productsToSync = [];

    function getBestImage(name) {
        const upper = name.toUpperCase();
        for (const [key, url] of Object.entries(IMAGE_RESOURCES)) {
            if (upper.includes(key)) return url;
        }
        return '/images/products/default-product.png'; // Fallback
    }

    function addProduct(rawName, priceUsd, categoryBase) {
        let name = rawName.trim().replace(/\s+/g, ' ');
        let condition = 'NEW';
        if (name.includes('CPO')) condition = 'CPO';
        if (name.includes('GRADO A')) condition = 'GRADO A';
        
        let category = categoryBase;
        const upper = name.toUpperCase();
        
        // Refinement
        if (upper.includes('ROBOT')) category = 'aspiradoras-robot';
        if (upper.includes('TABLET')) category = (upper.includes('APPLE')) ? 'ipad' : 'ipad';
        if (upper.includes('WATCH')) category = 'watch';
        if (upper.includes('MACBOOK')) category = 'macbook';

        const id = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const existing = productsToSync.find(p => p.id === id);
        if (existing) {
            existing.stock += 1;
        } else {
            productsToSync.push({
                id: id,
                name: name,
                price: calculatePrice(priceUsd),
                category: category,
                properties: { condition: condition, color: '', storage: '' },
                stock: 1,
                image: getBestImage(name),
                badge: condition === 'CPO' ? 'CPO' : undefined
            });
        }
    }

    // Process all
    Object.keys(ocrData).forEach(brand => {
        const text = ocrData[brand];
        const lines = text.split('\n');
        lines.forEach(line => {
            const match = line.match(/^\d+-\d+\s+(.*?)\s+(\d+[\.,]\s?\d{2})\s*$/) || 
                          line.match(/^\d+-\d+\s+(.*?)\/(\d+[\.,]\s?\d{2})\s*$/);
            if (match) {
                addProduct(match[1].trim(), parseFloat(match[2].replace(',', '').replace(/\s/g, '')), CATEGORY_MAP[brand] || brand.toLowerCase());
            }
        });
    });

    console.log(`Paso 1: Limpiando stock de categorías afectadas...`);
    const affectedCategories = Object.values(CATEGORY_MAP);
    await Product.updateMany({ category: { $in: affectedCategories } }, { stock: 0 });

    console.log(`Paso 2: Upserting ${productsToSync.length} productos...`);
    let updatedCount = 0;
    let createdCount = 0;

    for (const p of productsToSync) {
        const result = await Product.findOneAndUpdate(
            { id: p.id },
            { $set: p },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        if (result) {
            // Find out if it was an update or insert
            // (Simple way for this script: log it)
            createdCount++;
        }
    }

    console.log(`--- SINCRONIZACIÓN COMPLETADA ---`);
    console.log(`Productos Sincronizados: ${productsToSync.length}`);
    console.log(`Categorías Afectadas: ${affectedCategories.join(', ')}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

sync();

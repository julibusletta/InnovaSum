const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

function calculatePrice(usdPrice) {
    let adjusted = usdPrice < 500 ? (usdPrice + 20) : (usdPrice * 1.10);
    let inARS = adjusted * 1500;
    return Math.round(inARS * 1.30);
}

const CATEGORY_MAP = {
    'IPHONE': 'iphone',
    'WATCH': 'watch',
    'JBL': 'jbl',
    'MOTOROLA': 'motorola',
    'SAMSUNG': 'samsung',
    'REALME': 'realme',
    'AMAZON': 'amazon',
    'XIAOMI': 'xiaomi',
    'ROBOT XIAOMI': 'aspiradoras-robot',
    'TABLET XIAOMI': 'xiaomi',
};

async function sync() {
  try {
    const fs = require('fs');
    const path = require('path');
    const ocrData = JSON.parse(fs.readFileSync(path.join(__dirname, 'full_stock_ocr.json'), 'utf8'));

    const productsToSync = [];

    function addProduct(rawName, priceUsd, categoryBase) {
        let name = rawName.trim().replace(/\s+/g, ' ');
        let condition = 'NEW';
        if (name.includes('CPO')) condition = 'CPO';
        if (name.includes('GRADO A')) condition = 'GRADO A';
        
        let category = categoryBase;
        const upper = name.toUpperCase();
        
        if (upper.includes('ROBOT')) category = 'aspiradoras-robot';
        if (upper.includes('TABLET')) category = 'ipad';
        if (upper.includes('WATCH')) category = 'watch';
        if (upper.includes('MACBOOK') || upper.includes('AIR 256GB')) category = 'macbook';
        if (upper.includes('ECHO') || upper.includes('ALEXA') || upper.includes('FIRE TV')) category = 'amazon';
        if (upper.includes('POCO') || upper.includes('REDMI')) category = 'xiaomi';

        const existing = productsToSync.find(p => p.name === name);
        if (existing) {
            existing.stock += 1;
        } else {
            productsToSync.push({
                name: name,
                price: calculatePrice(priceUsd),
                category: category,
                condition: condition,
                stock: 1,
                usdBase: priceUsd
            });
        }
    }

    Object.keys(ocrData).forEach(brand => {
        const text = ocrData[brand];
        const lines = text.split('\n');
        lines.forEach(line => {
            const match = line.match(/^\d+-\d+\s+(.*?)\s+(\d+[\.,]\s?\d{2})\s*$/) || line.match(/^\d+-\d+\s+(.*?)\/(\d+[\.,]\s?\d{2})\s*$/) || line.match(/^\w+\s+(.*?)\s+(\d+[\.,]\s?\d{2})\s*$/);
            if (match) {
                const desc = match[1].trim();
                const price = parseFloat(match[2].replace(',', '').replace(/\s/g, ''));
                if (!isNaN(price)) {
                    addProduct(desc, price, CATEGORY_MAP[brand] || brand.toLowerCase());
                }
            }
        });
    });

    console.log(`--------------------------------------------------`);
    console.log(`REPORTE DE INGESTA (DRY RUN)`);
    console.log(`Total productos únicos encontrados: ${productsToSync.length}`);
    console.log(`--------------------------------------------------`);
    
    productsToSync.slice(0, 20).forEach(p => {
        console.log(`[${p.condition}] ${p.name.padEnd(50)} | Stock: ${p.stock} | Price: ARS ${p.price.toLocaleString()} (USD ${p.usdBase})`);
    });

    if (productsToSync.length > 20) console.log(`... y ${productsToSync.length - 20} productos más.`);
    
    console.log(`--------------------------------------------------`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

sync();

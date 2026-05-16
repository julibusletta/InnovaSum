const userList = `
12322-8 APPLE AIRTAGS 1 PACK MX532LL/A / 22.50 |
12011-1 APPLE AIRTAGS PACK COM 4 MX542LL/A / 77.00 |
10767-9 APPLE CABO IPHONE 15 TIPO C MQKJ3FE/ 1M 60W BRANCO ORGINA/ 15.90 |
10366-4 APPLE CABO IPHONE 15/15PROMAX TIPO C COM CAIXA / 3.00 |
15030-9 APPLE CABO IPHONE TIPO C TO LIGHTNING 1M BRANCO ORGINAL / 13.90 |
2280-4 APPLE CABO IPHONE USB FOXCOM S/CAIXA / 1.40 |
11332-8 APPLE CABO IPHONE USB SYNCWIRE C/CAIXA 1M / 1.00 |
3357-2 APPLE CARREGADOR IPHONE 11/12 TIPO C 20W C/CAIXA / 3.00 |
8913-5 APPLE CARREGADOR IPHONE 11/12 TIPO C 50W C/2 ENTRADA COM / 5.00 |
7903-7 APPLE CARREGADOR IPHONE 11/14 TIPO C 25W C/CABO C/CAIXA / 3.25 |
10922-2 APPLE CARREGADOR IPHONE 11/15 35W COM CAIXA / 2.90 |
12364-8 APPLE CARREGADOR IPHONE MHJG3BZ/A 20W ORIGINAL / 18.00 |
14993-8 APPLE FONE AIRPODS 4 MXP63LL/A WHITE NOVO ATIVADO / 96.00 |
11661-9 APPLE FONE AIRPODS 4 MXP93LL/A ACTIVE NOICE CANCELLATION / 145.00 |
11219-2 APPLE FONE AIRPODS PRO 2GN MTJV3LL/A C/MAGSAFE CASE WHITE/ 219.00 |
14871-9 APPLE FONE AIRPODS PRO 3 MFHP4LL COM MAGSAFE CHARGING / 230.00 |
14774-3 APPLE FONE EARPODS MWTY3ZM/A LIGHTNING WHITE - ORIGINAL / 9.00 |
15418-5 APPLE PENCIL A1603 MYQW3AM/A IPAD MINI IPAD AIR IPAD PR/ 75.00 |
11479-0 APPLE PENCIL PRO MX2D3AM/A A2538 IPAD PRO M4/AIR M2 BRANC/ 117.00 |
10595-8 APPLE PENCIL USB-C MUWA3AM/A A3085 / 97.00 |
15543-4 APPLE PENCIL USB-C MUWA3ZM/A A3085 / 97.00 |
14842-9 RASTREADOR INTELIGENTE PET-TAG COMPATIVEL COM APPLE / 10.00
`;

import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ id: String, name: String, specifications: Array, category: String, costPrice: Number, description: String }));
  const dbProducts = await Product.find({ category: 'apple-accesorios' }).lean();

  const userItems = userList.trim().split('\n').map(line => {
    const parts = line.split('/');
    if (parts.length < 2) return null;
    let namePart = parts[0].trim();
    // Remove the numeric code from the start
    namePart = namePart.replace(/^\d+-\d+\s+/, '');
    const pricePart = parts[1].split('|')[0].trim();
    return { fullName: parts[0].trim(), name: namePart, price: parseFloat(pricePart) };
  }).filter(Boolean);

  console.log('| Producto (Sugerido por Usuario) | Precio DB (USD) | Estado |');
  console.log('| :--- | :--- | :--- |');

  userItems.forEach(u => {
    const normalizedUser = u.name.toLowerCase().replace(/\s+/g, ' ');
    
    // Find best match
    const match = dbProducts.find(p => {
       const dbName = p.name.toLowerCase();
       const dbDesc = (p.description || '').toLowerCase();
       // Try matching specific model codes (e.g. MX532LL/A)
       const modelCodeMatch = u.name.match(/[A-Z0-9\/]{5,15}/);
       if (modelCodeMatch && (dbName.includes(modelCodeMatch[0].toLowerCase()) || dbDesc.includes(modelCodeMatch[0].toLowerCase()))) {
          return true;
       }
       // Fallback to keyword match
       const keywords = u.name.split(' ').filter(w => w.length > 2);
       return keywords.every(kw => dbName.includes(kw.toLowerCase()) || dbDesc.includes(kw.toLowerCase()));
    });

    if (match) {
      const dbPriceSpec = match.specifications.find(s => s.label.includes('USD'))?.value;
      const dbPrice = match.costPrice || parseFloat(dbPriceSpec);
      const status = Math.abs(dbPrice - u.price) < 0.1 ? '✅ OK' : `❌ Diferente (${dbPrice} vs ${u.price})`;
      console.log(`| ${u.name} | ${dbPrice || 'N/A'} | ${status} |`);
    } else {
      console.log(`| ${u.name} | N/A | ⚠️ No encontrado |`);
    }
  });

  process.exit(0);
}

run();

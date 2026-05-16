const userList = `
15939-5 NOTEBOOK ACER ASPIRE A14-52M-72FH ULTRA7-256V 16/1TB/14" / 695.00 |
15940-1 NOTEBOOK ACER ASPIRE GO AG15-71PT-72GA TOUCH-CORE I7 16/5/ 659.00 |
15941-8 NOTEBOOK ACER NITRO V 16 ANV16-72-7809 I7-240H 32/512GB R/ 1173.00 |
15384-3 NOTEBOOK ASUS ROG STRIX G16 16" FHD I7-14650HS 16/1TB SSD/ 1395.00 |
15811-4 NOTEBOOK ASUS VIVOBOOK 14 F1404ZA-TS52 INTEL CORE I5 8/51/ 415.00 |
15601-1 NOTEBOOK ASUS VIVOBOOK 16 F1605VA-BS74 I7-13620H 16/512GB/ 690.00 |
15643-1 NOTEBOOK ASUS VIVOBOOK 16 F1605VA-WS74 I7-1355U 16/512GB / 588.00 |
15942-5 NOTEBOOK ASUS VIVOBOOK GO E1504FA-AS52 R5-7520U 8/512GB S/ 395.00 |
15298-3 NOTEBOOK ASUS VIVOBOOK X1404VAP-V14.C58256 14" I5 8/256SS/ 379.00 |
15639-4 NOTEBOOK ASUS VIVOBOOK X1404ZA-I38128 INTEL CORE I3 8/128/ 299.00 |
15481-9 NOTEBOOK ASUS ZENBOOK 14 UX3405CA-U7512 ULTRA 7 16/512SSD/ 852.00 |
15943-2 NOTEBOOK DELL I5441-SX8685 SNAPDRAGON X PLUS 16/1TB SSD 1/ 635.00 |
15735-3 NOTEBOOK DELL LDC15255-7322 15.6" AMD RYZEN 7,7730U 16/1T/ 605.00 |
15809-1 NOTEBOOK HP 14-CF2111WM INTEL CELERON 4/64GB EMMC BLUE / 220.00 |
15301-0 NOTEBOOK HP 14-DQ6011DX 14" INTEL N150 4/128GB UFS SILVER/ 183.00 |
15300-3 NOTEBOOK HP 14-DQ6015DX 14" INTEL N150 4/128GB UFS ROSE G/ 183.00 |
15782-7 NOTEBOOK HP 15-FA2093DX INTEL CORE I7-13620H 16/1TBGB SSD/ 1190.00 |
15556-4 NOTEBOOK HP 15-FD0131WM INTEL CORE I3 8GB DDR4 256 GB SSD/ 363.00 |
15813-8 NOTEBOOK HP 15-FD0182WM 15.6'' INTEL CORE I7 16/512GB SSD/ 725.00 |
15554-0 NOTEBOOK HP 15T-FD000 CORE I7-1355U 12/256GB SSD FHD BLAC/ 538.00 |
15810-7 NOTEBOOK HP 16-AG0070WM AMD RYZEN 7 8/512 GB SSD SILVER / 493.00 |
15808-4 NOTEBOOK HP OMNIBOOK 5 16-AF1017WM ULTRA 7 TOUCH 16/1TB S/ 715.00 |
15638-7 NOTEBOOK HP OMNIBOOK X FLIP 14-FM0023DX TOUCH ULTRA 7 16// 849.00 |
15480-2 NOTEBOOK LENOVO IDEAPAD 1 82VG00WXUS AMD RYZEN 5 8/256GB / 359.00 |
15783-4 NOTEBOOK LENOVO IDEAPAD SLIM 3 82XB00HVUS INTEL N100 4/12/ 193.00 |
15945-6 NOTEBOOK LENOVO IDEAPAD SLIM 5 83FW0001US I7-150U 16/1TB / 789.00 |
15307-2 NOTEBOOK LENOVO YOGA 7 83DL0002US 16" ULTRA7 155U 16/1TB / 757.00 |
5969-5 NOTEBOOK TOSH DYNABOOK A40-G 128G BLACK / 200.00
`;

import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
    id: String, 
    name: String, 
    specifications: Array, 
    category: String,
    costPrice: Number
  }, { strict: false }));

  const dbProducts = await Product.find({ category: 'notebooks' }).lean();

  const userItems = userList.trim().split('\n').map(line => {
    const parts = line.split('/');
    if (parts.length < 2) return null;
    const namePart = parts[0].trim().replace(/^\d+-\d+\s+/, '');
    const priceStr = parts[1].split('|')[0].trim().replace(',', '');
    return { fullName: parts[0].trim(), cleanName: namePart, price: parseFloat(priceStr) };
  }).filter(Boolean);

  console.log('| Notebook (Usuario) | Costo DB (USD) | Estado |');
  console.log('| :--- | :--- | :--- |');

  for (const u of userItems) {
    const keywords = u.cleanName.toLowerCase().split(' ').filter(w => w.length > 2);
    
    // Try to find the match
    const match = dbProducts.find(p => {
       const dbName = p.name.toLowerCase();
       // Check if code matches (after '15939-5 ')
       const idMatch = u.fullName.split(' ')[0];
       if (dbName.includes(idMatch.toLowerCase())) return true;
       // Or model name keyword
       return keywords.every(kw => dbName.includes(kw.toLowerCase()));
    });

    if (match) {
      const costSpec = (match.specifications || []).find(s => s.label.toLowerCase().includes('costo'))?.value;
      const dbPrice = parseFloat(costSpec) || match.costPrice;
      const status = Math.abs(dbPrice - u.price) < 1 ? '✅ OK' : '❌ Diferente (' + dbPrice + ' vs ' + u.price + ')';
      
      await Product.updateOne({ _id: match._id }, { $set: { costPrice: u.price } });
      console.log('| ' + u.cleanName + ' | ' + (dbPrice || 'N/A') + ' | ' + status + ' |');
    } else {
      console.log('| ' + u.cleanName + ' | N/A | ⚠️ No encontrado |');
    }
  }

  process.exit(0);
}

run();


import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const appleWatchList = `
11878-1 APPLE WATCH S10 42MM MWWG3LW/A JET BLACK SPORT LOOP / 310.00 |
11877-4 APPLE WATCH S10 42MM MWWK3LW/A ROSE GOLD AL PLUM SL GPS / 311.00 |
11876-7 APPLE WATCH S10 46MM MWWR3LW/A JET BLACK SPORT LOOP / 330.00 |
11707-4 APPLE WATCH S10 46MM MWWU3LW/A ROSE GOLD M/L / 335.00 |
11900-9 APPLE WATCH S10 46MM MWWV3LW/A ROSE/PLUM SPORT LOOP / 280.00 |
15314-0 APPLE WATCH S11 42MM S/M MEQT4LW GPS - JET BLACK BLACK / 337.00 |
14789-7 APPLE WATCH S11 42MM S/M MEQW4LW GPS - SPACE GRAY AL BLAC/ 335.00 |
14782-8 APPLE WATCH S11 42MM S/M MEU04LW GPS - ROSE GOLD LIGHT BL/ 337.00 |
15315-7 APPLE WATCH S11 42MM S/M MEU64LW GPS - SILVER ALU WITH PU/ 338.00 |
14787-3 APPLE WATCH S11 46MM M/L MEUX4LW GPS - JET BLACK BLACK / 360.00 |
14794-1 APPLE WATCH S11 46MM M/L MEV44LW SPACE GRAY BLACK / 368.00 |
14783-5 APPLE WATCH S11 46MM M/L MEV74LW GPS - ROSE GOLD LIGHT BL/ 359.00 |
14788-0 APPLE WATCH S11 46MM M/L MEVA4LW GPS SILVER PURPLE FOG / 368.00 |
14807-8 APPLE WATCH S11 46MM S/M MEUW4LW GPS - JET BLACK BLACK / 365.00 |
15807-7 APPLE WATCH S11 46MM S/M MEV04LW SPACE GRAY / 368.00 |
14979-2 APPLE WATCH S11 46MM S/M MEV64LW GPS - ROSE GOLD LIGHT BL/ 359.00 |
15316-4 APPLE WATCH S11 46MM S/M MEV94LW GPS - SILVER AL PUR FOG / 370.00 |
12031-9 APPLE WATCH SE 2 44MM MXEP3LL/A MIDNIGHT SPORT LOOP *2024/ 188.00 |
14860-3 APPLE WATCH SE 3 40MM MIDNIGHT MEH94LW/A AL SB S/M GPS / 265.00 |
14859-7 APPLE WATCH SE 3 40MM STARLIGHT MEH34LW/A AL SB S/M GPS / 275.00 |
14862-7 APPLE WATCH SE 3 44MM STARLIGHT MEHJ4LW/A AL SB M/L GPS / 275.00 |
15162-7 APPLE WATCH ULTRA 3 49MM GPS + CELULAR MEWY4LW/A NATURAL / 860.00 |
14784-2 APPLE WATCH ULTRA 3 49MM GPS + CELULAR MF0J4LW/A BLACK/BL/ 770.00 |
15665-3 APPLE WATCH ULTRA 3 49MM GPS + CELULAR MF1Q4LW/A BLACK MI/ 860.00 |
14817-7 APPLE WATCH ULTRA 3 49MM GPS + CELULAR MF1T4LW/A BLACK TI/ 855.00 |
14894-8 APPLE WATCH ULTRA 3 49MM GPS + CELULAR MF254LW/A BLACK TI/ 740.00
`;

const appleOtherList = `
13486-6 APPLE IPAD 11TH GERACAO (A16) MD3Y4LL/A SILVER 128GB WI-F/ 358.00 |
13543-6 APPLE IPAD 11TH GERACAO (A16) MD4A4LL/A BLUE 128GB WI-FI / 338.00 |
13547-4 APPLE IPAD 11TH GERACAO (A16) MD4E4LL/A PINK 128GB WI-FI / 338.00 |
13574-0 APPLE IPAD 11TH GERACAO (A16) MD4H4LL/A BLUE 256GB WI-FI / 458.00 |
13575-7 APPLE IPAD 11TH GERACAO (A16) MD4P4LL/A PINK 256GB WI-FI / 458.00 |
14044-7 APPLE IPAD AIR M3 MC9W4LL/A 128GB 11' SPACE GRAY / 580.00 |
14161-1 APPLE IPAD AIR M3 MC9X4LL/A 128GB 11' BLUE / 562.00 |
14162-8 APPLE IPAD AIR M3 MC9Y4LL/A 128GB 11' STARLIGHT / 570.00 |
14618-0 APPLE IPAD AIR M3 MCA04LL/A 128GB 11' PURPLE / 560.00 |
14163-5 APPLE IPAD AIR M3 MCA14LL/A 256GB 11' SPACE GRAY / 688.00 |
14164-2 APPLE IPAD AIR M3 MCNH4LL/A 128GB 13' SPACE GRAY / 740.00 |
14988-4 APPLE IPAD AIR M3 MCNJ4LL/A 128GB 13' BLUE / 730.00 |
14952-5 APPLE IPAD AIR M3 MCNL4LL/A 128GB 13' PURPLE / 715.00 |
15886-2 APPLE IPAD AIR M4 MH304LL/A 128GB 11' SPACE GRAY / 665.00 |
15885-5 APPLE IPAD AIR M4 MH314LL/A 128GB 11' BLUE / 665.00 |
15884-8 APPLE IPAD AIR M4 MH334LL/A 128GB 11' STARLIGHT / 665.00 |
15883-1 APPLE IPAD AIR M4 MH344LL/A 128GB 11' PURPLE / 665.00 |
14991-4 APPLE IPAD PRO 11 MDWK4LL/A WIFI 256 11'M5 PRETO / 930.00 |
15689-9 APPLE MACBOOK M4 AIR 16/256GB MW123HN/A MIDNIGHT 13.6' 20/ 1115.00 |
14000-3 APPLE MACBOOK M4 AIR 16/512GB MW0X3LL/A SILVER 13.6' 2025/ 1230.00 |
15900-5 APPLE MACBOOK M5 AIR 16/512GB MDH74LL/A SILVER 13.6'(2026/ 1205.00 |
15901-2 APPLE MACBOOK M5 AIR 16/512GB MDHA4LL/A STARLIGHT 13.6'(2/ 1205.00 |
15902-9 APPLE MACBOOK M5 AIR 16/512GB MDHE4LL/A MIDNIGHT 13.6'(20/ 1205.00 |
15903-6 APPLE MACBOOK M5 AIR 16/512GB MDHH4LL/A SKY BLUE 13.6'(20/ 1205.00 |
15882-4 APPLE MACBOOK NEO MHFC4LL/A A18 PRO 8/512GB SILVER 13' 20/ 955.00 |
15908-1 APPLE MACBOOK NEO MHFC4LL/A A18 PRO 8/512GB SILVER 13' 20/ 890.00 |
15852-7 APPLE MACBOOK NEO MHFF4LL/A A18 PRO 8/256GB INDIGO 13' 20/ 755.00 |
15881-7 APPLE MACBOOK NEO MHFG4LL/A A18 PRO 8/512GB INDIGO 13' 20/ 955.00 |
15880-0 APPLE MACBOOK NEO MHFJ4LL/A A18 PRO 8/512GB BLUSH 13' 202/ 955.00 |
15703-2 APPLE MACBOOK PRO M5 16/1TB MDE14LL/A 14' BLACK / 1805.00 |
15196-2 APPLE MACBOOK PRO M5 16/512GB MDE04LL/A 14' BLACK / 1605.00 |
15520-5 IPHONE 13 256GB CPO MIDNIGHT / 515.00 |
15521-2 IPHONE 13 256GB CPO STARLIGHT / 515.00 |
15867-1 IPHONE 13 512GB CPO MIDNIGHT / 533.00 |
15868-8 IPHONE 13 512GB CPO STARLIGHT / 533.00 |
15875-6 IPHONE 13 PRO 128GB CPO GRAY / 520.00 |
15876-3 IPHONE 13 PRO 128GB CPO SILVER / 520.00 |
14476-6 IPHONE 13 PRO MAX 128GB CPO GOLD / 592.00 |
14473-5 IPHONE 13 PRO MAX 128GB CPO GRAPHITE / 592.00 |
15821-3 IPHONE 13 PRO MAX 128GB CPO GREEN / 592.00 |
14474-2 IPHONE 13 PRO MAX 128GB CPO SILVER / 592.00 |
8419-2 IPHONE 14 128GB A2882 128GB BLUE SIM FISICO + ESIM / 549.00 |
15740-7 IPHONE 14 128GB A2882 MIDNIGHT SIM FISICO + ESIM / 560.00 |
15670-7 IPHONE 14 PRO 128GB CPO PURPLE / 580.00 |
14436-0 IPHONE 14 PRO MAX 128GB CPO A2651 GOLD / 665.00 |
14437-7 IPHONE 14 PRO MAX 128GB CPO A2651 SILVER / 665.00 |
10250-6 IPHONE 15 128GB A2846 128GB BLACK ESIM / 599.00 |
10512-5 IPHONE 15 128GB A2846 128GB BLACK ESIM (CAIXA AMASSADA) / 590.00 |
10281-0 IPHONE 15 128GB A2846 128GB BLUE ESIM / 599.00 |
10310-7 IPHONE 15 128GB A3090 128GB BLACK HN SIM FISICO + ESIM / 599.00 |
10312-1 IPHONE 15 128GB A3090 128GB BLUE HN SIM FISICO + ESIM / 599.00 |
14831-3 IPHONE 15 PRO MAX 256GB CPO BLACK / 885.00 |
14814-6 IPHONE 15 PRO MAX 256GB CPO BLUE / 885.00 |
14812-2 IPHONE 15 PRO MAX 256GB CPO NATURAL / 885.00 |
11622-0 IPHONE 16 128GB A3081 ESIM WHITE / 675.00 |
12128-6 IPHONE 16 128GB A3287 HN/A BLACK SIM FISICO + ESIM / 730.00 |
15869-5 IPHONE 16 128GB A3287 HN/A BLACK SIM FISICO + ESIM ACTIVA/ 685.00 |
12127-9 IPHONE 16 128GB A3287 HN/A TEAL SIM FISICO + ESIM / 710.00 |
12126-2 IPHONE 16 128GB A3287 HN/A ULTRAMARINE SIM FISICO + ESIM / 722.00 |
12333-4 IPHONE 16 128GB A3287 HN/A WHITE SIM FISICO + ESIM / 735.00 |
15700-1 IPHONE 16 PRO 128GB CPO A3083 BLACK / 905.00 |
15702-5 IPHONE 16 PRO 128GB CPO A3083 WHITE / 905.00 |
15847-3 IPHONE 16 PRO MAX 512GB CPO A3084 BLACK TITANIUM / 1145.00 |
15850-3 IPHONE 16 PRO MAX 512GB CPO A3084 NATURAL TITANIUM / 1145.00 |
15848-0 IPHONE 16 PRO MAX 512GB CPO A3084 WHITE TITANIUM / 1145.00 |
13604-4 IPHONE 16E 128GB A3409 HN/A WHITE SIM FISICO + ESIM / 544.00 |
14834-4 IPHONE 17 256GB A3258 LL/A ESIM BLUE / 815.00 |
14832-0 IPHONE 17 256GB A3258 LL/A ESIM LAVENDER / 815.00 |
15814-5 IPHONE 17 256GB A3258 LL/A ESIM LAVENDER ACTIVADO GARANTI/ 800.00 |
14716-3 IPHONE 17 256GB A3258 LL/A ESIM SAGE / 815.00 |
14833-7 IPHONE 17 256GB A3258 LL/A ESIM WHITE / 815.00 |
15672-1 IPHONE 17 256GB A3258 VC/A ESIM WHITE / 815.00 |
15012-5 IPHONE 17 256GB A3519 4J/A ESIM BLACK / 815.00 |
15013-2 IPHONE 17 256GB A3519 4J/A ESIM BLUE / 815.00 |
14911-2 IPHONE 17 256GB A3519 4J/A ESIM LAVENDER / 815.00 |
15014-9 IPHONE 17 256GB A3519 4J/A ESIM WHITE / 815.00 |
15842-8 IPHONE 17 256GB A3519 VC/A ESIM BLACK / 815.00 |
15843-5 IPHONE 17 256GB A3519 VC/A ESIM BLUE / 815.00 |
15865-7 IPHONE 17 256GB A3519 VC/A ESIM WHITE / 815.00 |
15778-0 IPHONE 17 256GB A3520 BE/A BLUE SIM FISICO + ESIM (ANATEL/ 845.00 |
15779-7 IPHONE 17 256GB A3520 BE/A LAVENDER SIM FISICO + ESIM (AN/ 845.00 |
15777-3 IPHONE 17 256GB A3520 BE/A SAGE SIM FISICO + ESIM (ANATEL/ 845.00 |
15776-6 IPHONE 17 256GB A3520 BE/A WHITE SIM FISICO + ESIM (ANATE/ 845.00 |
15037-8 IPHONE 17 256GB A3520 HN/A BLUE SIM FISICO + ESIM / 815.00 |
15571-7 IPHONE 17 PRO 256GB A3256 BE/A ORANGE SIM FISICO + ESIM (/ 1280.00 |
14717-0 IPHONE 17 PRO 256GB A3256 LL/A ESIM COSMIC ORANGE / 1240.00 |
14718-7 IPHONE 17 PRO 256GB A3256 LL/A ESIM DEEP BLUE / 1243.00 |
14755-2 IPHONE 17 PRO 256GB A3256 LL/A ESIM SILVER / 1245.00 |
14811-5 IPHONE 17 PRO 256GB A3522 JP/A ESIM DEEP BLUE / 1229.00 |
14810-8 IPHONE 17 PRO 256GB A3522 JP/A ESIM SILVER / 1240.00 |
15443-7 IPHONE 17 PRO 256GB A3522 VC/A ESIM BLUE / 1243.00 |
15225-9 IPHONE 17 PRO 256GB A3522 VC/A ESIM COSMIC ORANGE / 1243.00 |
14761-3 IPHONE 17 PRO 512GB A3256 LL/A ESIM COSMIC ORANGE / 1510.00 |
14759-0 IPHONE 17 PRO 512GB A3256 LL/A ESIM DEEP BLUE / 1550.00 |
15893-0 IPHONE 17 PRO 512GB A3526 BE/A ORANGE SIM FISICO + ESIM A/ 1510.00 |
14802-3 IPHONE 17 PRO MAX 1TB A3257 LL/A ESIM COSMIC ORANGE / 1880.00 |
14803-0 IPHONE 17 PRO MAX 1TB A3257 LL/A ESIM DEEP BLUE / 1920.00 |
14987-7 IPHONE 17 PRO MAX 1TB A3257 LL/A ESIM SILVER / 1930.00 |
14752-1 IPHONE 17 PRO MAX 256GB A3257 LL/A ESIM COSMIC ORANGE / 1370.00 |
14754-5 IPHONE 17 PRO MAX 256GB A3257 LL/A ESIM DEEP BLUE / 1415.00 |
14753-8 IPHONE 17 PRO MAX 256GB A3257 LL/A ESIM SILVER / 1399.00 |
14934-1 IPHONE 17 PRO MAX 256GB A3525 4J/A ESIM BLUE / 1380.00 |
14935-8 IPHONE 17 PRO MAX 256GB A3525 4J/A ESIM ORANGE / 1360.00 |
14893-1 IPHONE 17 PRO MAX 256GB A3525 4J/A ESIM SILVER / 1399.00 |
14878-8 IPHONE 17 PRO MAX 256GB A3525 VC/A ESIM COSMIC ORANGE / 1360.00 |
14844-3 IPHONE 17 PRO MAX 256GB A3525 VC/A ESIM DEEP BLUE / 1415.00 |
15227-3 IPHONE 17 PRO MAX 256GB A3525 VC/A ESIM SILVER / 1399.00 |
14955-6 IPHONE 17 PRO MAX 256GB A3526 BE/A ORANGE SIM FISICO + ES/ 1425.00 |
14756-9 IPHONE 17 PRO MAX 512GB A3257 LL/A ESIM COSMIC ORANGE / 1635.00 |
14758-3 IPHONE 17 PRO MAX 512GB A3257 LL/A ESIM DEEP BLUE / 1710.00 |
14984-6 IPHONE 17 PRO MAX 512GB A3525 4J/A ESIM COSMIC ORANGE / 1610.00 |
15859-6 IPHONE 17E 256GB A3575 LL/A ESIM BLACK / 599.00 |
`;

async function run() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ 
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    costPrice: { type: Number },
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: String,
    specifications: Array,
    published: { type: Boolean, default: true },
    stock: { type: Number, default: 0 }
  }, { strict: false }));

  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({ 
    slug: String, 
    markupPercent: Number, 
    markupFixed: String 
  }, { strict: false }));

  const categories = await Category.find({ slug: { $in: ['watch', 'iphone', 'tablets', 'macbook'] } }).lean();
  const catMap = categories.reduce((acc, c) => { acc[c.slug] = c; return acc; }, {});

  // Default values for missing calculation settings
  const rules = {
    watch: catMap['watch'] || { markupPercent: 30, markupFixed: '>500: +10% | <500: +$20 USD' },
    iphone: catMap['iphone'] || { markupPercent: 30, markupFixed: '>500: +10% | <500: +$20 USD' },
    tablets: catMap['tablets'] || { markupPercent: 30, markupFixed: '>500: +10% | <500: +$20 USD' },
    macbook: catMap['macbook'] || { markupPercent: 10, markupFixed: '>500: +10% | <500: +$30 USD' }
  };

  // Ensure all rule values are numbers
  Object.keys(rules).forEach(k => {
    if (!rules[k].markupPercent) rules[k].markupPercent = (k === 'macbook' ? 10 : 30);
    if (!rules[k].markupFixed) rules[k].markupFixed = (k === 'macbook' ? '>500: +10% | <500: +$30 USD' : '>500: +10% | <500: +$20 USD');
  });

  const calculateFinalPrice = (cost, rule) => {
    if (isNaN(cost)) return NaN;
    let base = cost;
    if (rule.markupFixed) {
      if (cost >= 500) {
        base = cost * 1.10; // +10%
      } else {
        const fixedMatch = rule.markupFixed.match(/<500: \+\$(\d+) USD/);
        const fixedVal = fixedMatch ? parseFloat(fixedMatch[1]) : 20;
        base = cost + fixedVal;
      }
    }
    const rate = 1500;
    const margin = 1 + (rule.markupPercent / 100);
    const final = Math.round(base * rate * margin / 100) * 100;
    return isNaN(final) ? 0 : final;
  };

  const parseList = (list, type) => {
    return list.trim().split('\n').map(line => {
      const lastSlashIndex = line.lastIndexOf('/');
      if (lastSlashIndex === -1) return null;
      const priceStr = line.substring(lastSlashIndex + 1).split('|')[0].trim().replace(',', '');
      const price = parseFloat(priceStr);
      if (isNaN(price)) return null;
      let name = line.substring(0, lastSlashIndex).trim().replace(/^\d+-\d+\s+/, '');
      let category = '';
      let img = '/images/products/default-product.png';
      
      if (name.includes('WATCH')) { 
        category = 'watch'; 
        img = '/images/categories/watch.png';
      } else if (name.includes('IPHONE')) { 
        category = 'iphone'; 
        img = '/images/categories/iphone.png';
      } else if (name.includes('IPAD')) { 
        category = 'tablets'; 
        img = '/images/categories/ipad.png';
      } else if (name.includes('MACBOOK') || name.includes('NEO')) { 
        category = 'macbook';
        img = '/images/categories/macbook.png';
      }

      return { name, price, category, image: img };
    }).filter(Boolean);
  };

  const allItems = [
    ...parseList(appleWatchList, 'watch'),
    ...parseList(appleOtherList, 'other')
  ];

  let updatedCount = 0;
  let createdCount = 0;

  for (const item of allItems) {
    // Search by name keywords to handle translations or slight differences
    const keywords = item.name.toLowerCase().replace(/[\/"]/g, ' ').split(' ').filter(w => w.length >= 3);
    const dbProduct = await Product.findOne({ 
      category: item.category,
      name: { $regex: new RegExp(keywords.slice(0, 3).join('.*'), 'i') } 
    });

    if (isNaN(item.price)) {
      console.warn(`[SKIP] Precio inválido para: ${item.name}`);
      continue;
    }

    if (dbProduct) {
      await Product.updateOne({ _id: dbProduct._id }, { $set: { costPrice: item.price } });
      updatedCount++;
    } else {
      // Create new product
      const rule = rules[item.category] || rules['iphone'];
      const finalPrice = calculateFinalPrice(item.price, rule);
      const newId = `apple-${item.category}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      await Product.create({
        id: newId,
        name: item.name,
        price: finalPrice,
        costPrice: item.price,
        category: item.category,
        image: item.image,
        description: `${item.name}. Producto original Apple importado.`,
        specifications: [
          { label: 'Marca', value: 'Apple' },
          { label: 'Costo base (USD)', value: item.price.toString() }
        ],
        stock: 5,
        published: true
      });
      createdCount++;
    }
  }

  console.log(`\nResumen de Sincronización Apple:`);
  console.log(`- Actualizados (costo): ${updatedCount}`);
  console.log(`- Creados (nuevos modelos): ${createdCount}`);
  
  process.exit(0);
}

run();

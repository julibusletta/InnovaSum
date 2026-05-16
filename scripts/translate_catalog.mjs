import mongoose from 'mongoose';

/**
 * List of translation rules. 
 * 'from' is converted into a regex that matches whole words (preserving case).
 * 'to' is the Spanish equivalent.
 */
const translations = [
  // Numeric generations requested by user: 1GERACAO -> 1RA GENERACIÓN
  { from: '1GERACAO', to: '1RA GENERACIÓN' },
  { from: '2GERACAO', to: '2DA GENERACIÓN' },
  { from: '3GERACAO', to: '3RA GENERACIÓN' },
  { from: '4GERACAO', to: '4TA GENERACIÓN' },
  { from: '5GERACAO', to: '5TA GENERACIÓN' },
  { from: '6GERACAO', to: '6TA GENERACIÓN' },
  { from: '7GERACAO', to: '7MA GENERACIÓN' },
  { from: '8GERACAO', to: '8VA GENERACIÓN' },
  { from: '9GERACAO', to: '9NA GENERACIÓN' },
  { from: '10GERACAO', to: '10MA GENERACIÓN' },

  // Space-separated numeric generations
  { from: '1 GERAÇÃO', to: '1RA GENERACIÓN' },
  { from: '2 GERAÇÃO', to: '2DA GENERACIÓN' },
  { from: '3 GERAÇÃO', to: '3RA GENERACIÓN' },
  { from: '1 GERACAO', to: '1RA GENERACIÓN' },
  { from: '2 GERACAO', to: '2DA GENERACIÓN' },
  { from: '3 GERACAO', to: '3RA GENERACIÓN' },

  // Catch-all for other generations
  { from: 'Geraç[ãa]o', to: 'Generación' },
  { from: 'Geracao', to: 'Generación' },

  // User requested (Portuguese to Spanish)
  { from: 'Branco', to: 'Blanco' },
  { from: 'Preto', to: 'Negro' },
  { from: 'Carregador', to: 'Cargador' },
  { from: 'CCarregador', to: 'Con Cargador' }, // User mentioned this typo/prefix

  // Colors and other terms
  { from: 'Cinza', to: 'Gris' },
  { from: 'Dourado', to: 'Dorado' },
  { from: 'Estela', to: 'Estelar' },
  { from: 'Meia-Noite', to: 'Medianoche' },
  { from: 'Midnight', to: 'Medianoche' },
  { from: 'Space Grey', to: 'Gris Espacial' },
  { from: 'Space Gray', to: 'Gris Espacial' },
  { from: 'Starlight', to: 'Estelar' },
  { from: 'White', to: 'Blanco' },
  { from: 'Black', to: 'Negro' },
  { from: 'Blue', to: 'Azul' },
  { from: 'Green', to: 'Verde' },
  { from: 'Red', to: 'Rojo' },
  { from: 'Yellow', to: 'Amarillo' },
  { from: 'Pink', to: 'Rosa' },
  { from: 'Purple', to: 'Púrpura' },
  { from: 'Silver', to: 'Plateado' },
  { from: 'Graphite', to: 'Grafito' },
  { from: 'Gold', to: 'Oro' },
  { from: 'Rose Gold', to: 'Oro Rosa' },
  { from: 'Sierra Blue', to: 'Azul Sierra' },
  { from: 'Alpine Green', to: 'Verde Alpino' },
  { from: 'Deep Purple', to: 'Morado Oscuro' },
  { from: 'Natural Titanium', to: 'Titanio Natural' },
  { from: 'Blue Titanium', to: 'Titanio Azul' },
  { from: 'White Titanium', to: 'Titanio Blanco' },
  { from: 'Black Titanium', to: 'Titanio Negro' },
  { from: 'Space Black', to: 'Negro Espacial' },

  // Components
  { from: 'Cabo', to: 'Cable' },
  { from: 'Pulseira', to: 'Correa' },
  { from: 'Fone', to: 'Auricular' },
  { from: 'Ouvido', to: 'Oído' },
  { from: 'Fones de ouvido', to: 'Auriculares' },
  { from: 'Relógio', to: 'Reloj' },
  { from: 'Pulseira esportiva', to: 'Correa deportiva' }
];

/**
 * Utility to identify case and apply it to the replacement
 */
function preserveCase(original, replacement) {
  if (original === original.toUpperCase()) return replacement.toUpperCase();
  if (original === original.toLowerCase()) return replacement.toLowerCase();
  
  const isCapitalized = /^[A-Z]/.test(original);
  if (isCapitalized) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
  }
  return replacement;
}

/**
 * Build a safe regex that matches terms as whole words or starting after numbers.
 */
const buildRegex = (term) => {
  // We use word boundaries where possible, or check for start/end of string or non-letter characters
  // Using \b is tricky because of numbers. Let's use a explicit boundary char set.
  const boundaryLeft = '(?<=^|[^a-zA-ZáéíóúÁÉÍÓÚñÑ])';
  const boundaryRight = '(?=$|[^a-zA-ZáéíóúÁÉÍÓÚñÑ])';
  return new RegExp(`${boundaryLeft}${term}${boundaryRight}`, 'gi');
};

const translationRules = translations.map(t => ({
  regex: buildRegex(t.from),
  to: t.to
}));

async function translateCatalog() {
  const MONGO_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/test?appName=admin';
  
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.collection('products');

    const products = await db.find({}).toArray();
    console.log(`Found ${products.length} products total.`);

    let updatedCount = 0;

    for (const product of products) {
      let currentName = product.name;
      let newName = currentName;
      let hasChanges = false;

      for (const rule of translationRules) {
        const matches = newName.match(rule.regex);
        if (matches) {
          newName = newName.replace(rule.regex, (match) => {
            hasChanges = true;
            return preserveCase(match, rule.to);
          });
        }
      }

      if (hasChanges && newName !== currentName) {
        await db.updateOne(
          { _id: product._id },
          { $set: { name: newName } }
        );
        updatedCount++;
        console.log(`[UPDATED] ${currentName} -> ${newName}`);
      }
    }

    console.log(`\nFinished. Total products updated: ${updatedCount}`);
  } catch (err) {
    console.error('Error during translation:', err);
  } finally {
    await mongoose.disconnect();
  }
}

translateCatalog();

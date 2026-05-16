import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const appleWatchSpecs = {
  "S11": {
    "Material y Acabado": "Aluminio (Plata, Medianoche, Luz Estelar) o Titanio (Natural, Dorado, Pizarra).",
    "Tamaño y Peso": "46 mm (46x39x9.7mm, desde 36.9g) y 42 mm (42x36x9.7mm, desde 29.7g).",
    "Hardware y Botones": "Digital Crown con respuesta háptica, Botón lateral, Botón de liberación de correa, Bocina y Micrófono.",
    "Controles": "Digital Crown, Botón lateral, Gesto de doble toque (Double Tap), Siri en el dispositivo.",
    "Chip": "SiP S11 con procesador de doble núcleo de 64 bits y Neural Engine de 4 núcleos.",
    "Sensores": "Oxígeno en sangre, ECG, frecuencia cardiaca de 3ª gen, temperatura, brújula, altímetro, acelerómetro de alta fuerza g, profundidad (6m).",
    "Salud y Bienestar": "App Oxígeno en sangre, App ECG, seguimiento del ciclo con estimaciones de ovulación, fases del sueño, detección de caídas y choques.",
    "Pantalla": "Retina LTPO3 OLED siempre activa, hasta 3000 nits de brillo; gran ángulo de visión.",
    "Audio": "Bocina y micrófonos con aislamiento de voz.",
    "Energía y Duración de la Batería": "Hasta 18 horas de uso normal, 36 horas en ahorro de batería. Carga rápida.",
    "Sistema Operativo": "watchOS 12.",
    "Conectividad": "LTE (opcional), Wi-Fi 6, Bluetooth 5.3, Chip U2 (Banda ultraancha).",
    "Durabilidad": "Resistencia al agua hasta 50 m (apto para nadar), resistencia al polvo IP6X."
  },
  "S10": {
    "Material y Acabado": "Aluminio (Negro azabache, Oro rosa, Plata) o Titanio (Pizarra, Oro, Natural).",
    "Tamaño y Peso": "46 mm y 42 mm. Grosor ultrafino de 9.7 mm.",
    "Hardware y Botones": "Digital Crown con respuesta háptica, Botón lateral, Bocina, Micrófono con aislamiento de voz.",
    "Controles": "Digital Crown, Botón lateral, Doble toque.",
    "Chip": "SiP S10 con procesador de doble núcleo de 64 bits.",
    "Sensores": "Oxígeno en sangre, ECG, frecuencia cardiaca, temperatura, profundímetro, sensor de temperatura del agua.",
    "Salud y Bienestar": "App ECG, seguimiento del sueño, notificaciones de salud cardiaca, detección de apnea del sueño.",
    "Pantalla": "Retina LTPO3 OLED siempre activa, hasta 2000 nits.",
    "Audio": "Bocina y micrófono para llamadas y medios.",
    "Energía y Duración de la Batería": "Hasta 18 horas. Carga rápida (0-80% en 30 min).",
    "Sistema Operativo": "watchOS 11 / 12.",
    "Conectividad": "LTE, Wi-Fi 4, Bluetooth 5.3, Chip U2.",
    "Durabilidad": "Resistencia al agua 50 m, IP6X."
  },
  "ULTRA 3": {
    "Material y Acabado": "Titanio de grado aeroespacial (Grado 5). Colores: Natural, Negro.",
    "Tamaño y Peso": "49 mm (49x44x14.4mm). Peso: 61.4g.",
    "Hardware y Botones": "Digital Crown, Botón lateral, Botón de Acción personalizable, Doble bocina, Sirena, 3 micrófonos.",
    "Controles": "Botón de Acción, Digital Crown, Botón lateral, Doble toque.",
    "Chip": "SiP S11 refinado con Neural Engine de 4 núcleos y 64GB de capacidad.",
    "Sensores": "Profundímetro (40m), temperatura del agua, oxígeno en sangre, ECG, altímetro siempre activo, brújula.",
    "Salud y Bienestar": "App ECG, notificaciones de ritmo irregular, detección de apnea del sueño, notificaciones de hipertensión.",
    "Pantalla": "Retina LTPO3 OLED plana, hasta 3000 nits; cristal de zafiro.",
    "Audio": "Doble bocina (40% más potente), matriz de 3 micrófonos con reducción de ruido de viento.",
    "Energía y Duración de la Batería": "Hasta 36 horas (normal), 72 horas (ahorro). Carga rápida.",
    "Sistema Operativo": "watchOS 12.",
    "Conectividad": "LTE y UMTS de serie, Wi-Fi 6, Bluetooth 5.3, Chip U2.",
    "Durabilidad": "Resistencia al agua 100 m (buceo 40 m), IP6X, MIL-STD 810H, EN13319."
  },
  "ULTRA 2": {
    "Material y Acabado": "Titanio natural o Negro.",
    "Tamaño y Peso": "49 mm (49x44x14.4mm). Peso aprox. 61.4g.",
    "Hardware y Botones": "Botón de Acción, Digital Crown, Botón lateral, Sirena de emergencia.",
    "Controles": "Botón de Acción, Doble toque, Siri en el dispositivo.",
    "Chip": "SiP S9 con Neural Engine de 4 núcleos.",
    "Sensores": "Oxígeno en sangre, ECG, temperatura, brújula, profundímetro (40m), altímetro siempre activo.",
    "Salud y Bienestar": "App ECG, seguimiento del ciclo con estimaciones de ovulación, detección de caídas.",
    "Pantalla": "Retina LTPO OLED plana, hasta 3000 nits.",
    "Audio": "Matriz de 3 micrófonos, doble bocina.",
    "Energía y Duración de la Batería": "Hasta 36 horas (normal), 72 horas (modo ahorro).",
    "Sistema Operativo": "watchOS 10 / 11.",
    "Conectividad": "LTE, Wi-Fi 4, Bluetooth 5.3, Chip U2.",
    "Durabilidad": "100 m de resistencia al agua, MIL-STD 810H, IP6X."
  },
  "SE 3": {
    "Material y Acabado": "Aluminio 100% reciclado (Medianoche, Estelar, Plata).",
    "Tamaño y Peso": "44 mm y 40 mm. Diseño ligero y sostenible.",
    "Hardware y Botones": "Digital Crown con respuesta háptica, Botón lateral.",
    "Controles": "Digital Crown, Botón lateral, Siri mejorada.",
    "Chip": "SiP S10 con procesador de doble núcleo acelerado.",
    "Sensores": "Frecuencia cardiaca de 3ª gen, brújula, altímetro siempre activo, acelerómetro de alta fuerza g.",
    "Salud y Bienestar": "Notificaciones de ritmo irregular, detección de caídas y choques, seguimiento del sueño.",
    "Pantalla": "Retina OLED LTPO, hasta 2000 nits (mejorado).",
    "Audio": "Bocina y micrófono integrados con cancelación de ruido básica.",
    "Energía y Duración de la Batería": "Hasta 18 horas de uso normal. Compatible con carga rápida.",
    "Sistema Operativo": "watchOS 12.",
    "Conectividad": "LTE (opcional), Wi-Fi 5, Bluetooth 5.3.",
    "Durabilidad": "Resistencia al agua 50 m (apto para nadar)."
  },
  "SE 2": {
    "Material y Acabado": "Aluminio (Medianoche, Luz estelar, Plata).",
    "Tamaño y Peso": "44 mm y 40 mm. Grosor de 10.7 mm.",
    "Hardware y Botones": "Digital Crown con respuesta háptica, Botón lateral.",
    "Controles": "Digital Crown, Botón lateral, Siri.",
    "Chip": "SiP S8 de doble núcleo.",
    "Sensores": "Frecuencia cardiaca de 2ª gen, brújula, altímetro siempre activo, acelerómetro de alta fuerza g.",
    "Salud y Bienestar": "Notificaciones de ritmo irregular, seguimiento del ciclo, emergencia SOS.",
    "Pantalla": "Retina OLED LTPO, hasta 1000 nits.",
    "Audio": "Bocina y micrófono integrados.",
    "Energía y Duración de la Batería": "Hasta 18 horas.",
    "Sistema Operativo": "watchOS 9 / 10.",
    "Conectividad": "LTE (opcional), Wi-Fi 4, Bluetooth 5.3.",
    "Durabilidad": "Resistencia al agua 50 m."
  }
};

async function enrichAppleWatchSpecs() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    let totalUpdated = 0;

    for (const [modelKey, specs] of Object.entries(appleWatchSpecs)) {
      // Transform specs object to array of { label, value } for frontend compatibility
      const specsArray = Object.entries(specs).map(([label, value]) => ({ label, value }));

      // Flexible matching (e.g., "S10" or "Series 10" or "SE 2")
      let searchTerms = [modelKey];
      if (modelKey === "S11") searchTerms.push("Series 11");
      if (modelKey === "S10") searchTerms.push("Series 10");
      if (modelKey === "SE 2") searchTerms.push("SE 2da GEN");
      if (modelKey === "ULTRA 3") searchTerms.push("Ultra 3");
      if (modelKey === "ULTRA 2") searchTerms.push("Ultra 2");

      const searchRegex = new RegExp(`(${searchTerms.join('|')})`, 'i');
      
      const result = await Product.updateMany(
        { 
          name: { $regex: searchRegex }
        },
        { $set: { specifications: specsArray } }
      );

      if (result.modifiedCount > 0) {
        console.log(`Modelo ${modelKey}: Actualizados ${result.modifiedCount} productos.`);
        totalUpdated += result.modifiedCount;
      }
    }

    console.log(`\nEnriquecimiento completado. Total de productos Apple Watch actualizados: ${totalUpdated}`);
    process.exit(0);
  } catch (error) {
    console.error("Error durante el enriquecimiento:", error);
    process.exit(1);
  }
}

enrichAppleWatchSpecs();

import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const jblSpecs = {
  "CHARGE 6": {
    "Características generales": "Potencia de salida: 40 W (30W woofer + 10W tweeter)",
    "Características Audio": "Respuesta de frecuencia dinámica: 60 Hz - 20 kHz",
    "Medidas": "Dimensiones: 22 x 9.6 x 9.3 cm. Peso: 0.96 kg",
    "Características de control y conexión": "Versión Bluetooth: 5.1. Perfiles BT: A2DP 1.3, AVRCP 1.6.",
    "Batería": "Tiempo de carga: 4 hrs. Tiempo de reproducción: 20 hrs.",
    "Características": "Certificación IP67 (resistente al polvo y agua), PartyBoost, Powerbank integrado para carga de dispositivos externos.",
    "Contenido de la caja": "1 JBL Charge 5 (versión 6), 1 cable USB-C, guía de inicio rápido, garantía."
  },
  "FLIP 7": {
    "Características generales": "Potencia de salida: 30 W (20W woofer + 10W tweeter)",
    "Características Audio": "Respuesta de frecuencia dinámica: 63 Hz - 20 kHz",
    "Medidas": "Dimensiones: 17.8 x 6.8 x 7.2 cm. Peso: 0.55 kg",
    "Características de control y conexión": "Versión Bluetooth: 5.1. Perfiles BT: A2DP 1.3, AVRCP 1.6.",
    "Batería": "Tiempo de carga: 2.5 hrs. Tiempo de reproducción: 12 hrs.",
    "Características": "IP67 resistente al agua y polvo, PartyBoost, Aplicación JBL Portable.",
    "Contenido de la caja": "1 JBL Flip 6 (versión 7), 1 cable USB-C, guía de inicio rápido, garantía."
  },
  "GO 4": {
    "Características generales": "Potencia de salida: 4.2 W",
    "Características Audio": "Respuesta de frecuencia dinámica: 90 Hz – 20 kHz",
    "Medidas": "Dimensiones: 9.4 x 7.8 x 4.2 cm. Peso: 0.19 kg",
    "Características de control y conexión": "Versión Bluetooth: 5.3. Perfiles BT: A2DP V1.4, AVRCP V1.6.",
    "Batería": "Tiempo de carga: 3 hrs. Tiempo de reproducción: 7 hrs.",
    "Características": "IP67 (resistente al polvo y agua), Conexión Multipunto, Auracast, Ultra-portátil con asa integrada.",
    "Contenido de la caja": "1 JBL Go 4, 1 cable USB-C, guía de inicio rápido, garantía."
  },
  "XTREME 4": {
    "Características generales": "Potencia de salida: 2x30W (AC), 2x20W (Batería)",
    "Características Audio": "Respuesta de frecuencia dinámica: 44 Hz - 20 kHz",
    "Medidas": "Dimensiones: 29.7 x 14.9 x 14.1 cm. Peso: 2.1 kg",
    "Características de control y conexión": "Versión Bluetooth: 5.3. Soporta LE Audio.",
    "Batería": "Tiempo de carga: 3.5 hrs. Tiempo de reproducción: 24 hrs.",
    "Características": "IP67, Auracast, IA Sound Boost, Batería reemplazable, Correa para el hombro incluida.",
    "Contenido de la caja": "1 JBL Xtreme 4, adaptador AC, correa, guía de inicio rápido."
  },
  "CLIP 5": {
    "Características generales": "Potencia de salida: 7 W RMS",
    "Características Audio": "Respuesta de frecuencia dinámica: 95 Hz - 20 kHz",
    "Medidas": "Dimensiones: 8.6 x 13.5 x 4.6 cm. Peso: 0.285 kg",
    "Características de control y conexión": "Versión Bluetooth: 5.3. Perfiles BT: A2DP 1.4, AVRCP 1.6.",
    "Batería": "Tiempo de carga: 3 hrs. Tiempo de reproducción: 12 hrs.",
    "Características": "IP67 resistente al agua/polvo, Mosquetón integrado mejorado, Auracast para múltiples altavoces.",
    "Contenido de la caja": "1 JBL Clip 5, 1 cable USB-C, guía de inicio rápido, garantía."
  },
  "BOOMBOX 4": {
    "Características generales": "Potencia de salida: 1x80W + 2x40W + 2x10W (Modo AC)",
    "Características Audio": "Respuesta de frecuencia dinámica: 40 Hz - 20 kHz",
    "Medidas": "Dimensiones: 48.2 x 25.7 x 20.0 cm. Peso: 6.7 kg",
    "Características de control y conexión": "Versión Bluetooth: 5.3. Perfiles BT: A2DP 1.3, AVRCP 1.6.",
    "Batería": "Tiempo de carga: 6.5 hrs. Tiempo de reproducción: 24 hrs.",
    "Características": "IP67 resistente al agua y polvo, PartyBoost, Subwoofer dedicado para bajos masivos.",
    "Contenido de la caja": "1 JBL Boombox 3 (versión 4), cable de alimentación AC, guía de inicio rápido."
  },
  "PARTY BOX CLUB 120": {
    "Características generales": "Potencia de salida: 160 W RMS",
    "Características Audio": "Respuesta de frecuencia dinámica: 40 Hz - 20 kHz (-6dB)",
    "Medidas": "Dimensiones: 28.8 x 57.0 x 29.7 cm. Peso: 11.05 kg",
    "Características de control y conexión": "Versión Bluetooth: 5.4. Entradas de micro/guitarra.",
    "Batería": "Tiempo de carga: 3.5 hrs. Tiempo de reproducción: 12 hrs.",
    "Características": "IPX4 (salpicaduras), Luces AI sincronizadas, Auracast, Batería intercambiable.",
    "Contenido de la caja": "1 PartyBox Club 120, cable AC, guía de inicio rápido, garantía."
  },
  "PARTY BOX STAGE 320": {
    "Características generales": "Potencia de salida: 240 W RMS",
    "Características Audio": "Respuesta de frecuencia dinámica: 40 Hz - 20 kHz (-6dB)",
    "Medidas": "Dimensiones: 33.5 x 66.9 x 38.5 cm. Peso: 16.5 kg",
    "Características de control y conexión": "Versión Bluetooth: 5.4. Rango: 2.4GHz - 2.4835GHz.",
    "Batería": "Tiempo de carga: 3 hrs. Tiempo de reproducción: 18 hrs.",
    "Características": "Asa telescópica y ruedas para transporte, IPX4, Auracast, Luces AI dinámicas.",
    "Contenido de la caja": "1 PartyBox Stage 320, cable AC, guía de inicio rápido."
  },
  "PARTY BOX 520": {
    "Características generales": "Potencia de salida: 400 W RMS",
    "Características Audio": "Respuesta de frecuencia dinámica: 40 Hz - 20 kHz (-6dB)",
    "Medidas": "Dimensiones: 42 x 77 x 37 cm. Peso: 26 kg",
    "Características de control y conexión": "Versión Bluetooth: 5.4. Entradas Duales de Micrófono y Guitarra.",
    "Batería": "Tiempo de carga: 3 hrs. Tiempo de reproducción: Hasta 15 hrs (99.02 Wh).",
    "Características": "AI Sound Boost para mayor claridad, Auracast, IPX4, Show de luces dinámico.",
    "Contenido de la caja": "1 JBL PartyBox 520, cable de alimentación AC, guía de inicio rápido."
  },
  "GO ESSENTIAL 2": {
    "Características generales": "Potencia de salida: 3.1W RMS",
    "Características Audio": "Respuesta de frecuencia dinámica: 180 Hz - 20 kHz",
    "Medidas": "Dimensiones: 8.6 x 7.1 x 3.2 cm. Peso: 0.18 kg",
    "Características de control y conexión": "Versión Bluetooth: 4.2. Perfiles BT: A2DP V1.2, AVRCP V1.5.",
    "Batería": "Tiempo de carga: 2.5 hrs. Tiempo de reproducción: 5 hrs.",
    "Características": "IP67 Waterproof y Dustproof, Diseño ultra-portátil, JBL Original Pro Sound.",
    "Contenido de la caja": "1 JBL Go Essential 2, cable Micro USB, guía de inicio rápido, garantía."
  },
  "PARTY BOX ON THE GO": {
    "Características generales": "Potencia de salida: 100 W RMS",
    "Características Audio": "Respuesta de frecuencia dinámica: 50 Hz - 20 kHz (-6dB)",
    "Medidas": "Dimensiones: 49.0 x 24.5 x 22.8 cm. Peso: 6.35 kg",
    "Características de control y conexión": "Versión Bluetooth: 5.4. Soporte TWS.",
    "Batería": "Tiempo de carga: < 3.5 hrs. Tiempo de reproducción: Hasta 15 hrs.",
    "Características": "IPX4 resistente a salpicaduras, Micrófono inalámbrico digital incluido, Abrebotellas en la correa.",
    "Contenido de la caja": "1 JBL PartyBox On-The-Go, 1 micrófono inalámbrico, cable AC, correa, guía rápida."
  },
  "TOUR ONE M2": {
    "Características generales": "Tipo: Over-ear (Cerrados). Driver: 40 mm Hi-Res Audio.",
    "Características Audio": "Frecuencia: 10 Hz - 40 kHz (Pasivo). Sensibilidad: 117 dB SPL.",
    "Medidas": "Peso: 272 g.",
    "Características de control y conexión": "Versión Bluetooth: 5.3. Perfiles: A2DP 1.3.2, HFP 1.7.2.",
    "Batería": "Tiempo de carga: 2 hrs. Reproducción: 50h (ANC off), 30h (ANC on).",
    "Características": "ANC Adaptativo real, Smart Ambient, 4 micrófonos para llamadas nítidas.",
    "Contenido de la caja": "1 Tour One M2, estuche, cable audio, adaptador avión, cable USB-C."
  },
  "TUNE 720BT": {
    "Características generales": "Tipo: Over-ear (Alrededor de la oreja). Driver: 40 mm.",
    "Características Audio": "Frecuencia: 20 Hz - 20 kHz. Sensibilidad: 101 dB SPL.",
    "Medidas": "Peso: 220 g.",
    "Características de control y conexión": "Versión Bluetooth: 5.3. Conexión Multipunto integrada.",
    "Batería": "Tiempo de carga: 2 hrs. Tiempo de reproducción: 76 hrs.",
    "Características": "JBL Pure Bass, VoiceAware para escuchar tu propia voz, Diseño Plegable.",
    "Contenido de la caja": "1 Tune 720BT, cable USB-C, cable audio extraíble, guía rápida."
  },
  "TUNE 520BT": {
    "Características generales": "Tipo: On-ear (Sobre la oreja). Driver: 33 mm.",
    "Características Audio": "Frecuencia: 20 Hz - 20 kHz. Sensibilidad: 102 dB SPL.",
    "Medidas": "Peso: 157 g.",
    "Características de control y conexión": "Versión Bluetooth: 5.3. Conexión Multipunto.",
    "Batería": "Tiempo de carga: 2 hrs. Tiempo de reproducción: 57 hrs.",
    "Características": "JBL Pure Bass, Carga rápida (5 min = 3h), VoiceAware, Plegables y ligeros.",
    "Contenido de la caja": "1 Tune 520BT, cable de carga USB-C, guía de inicio rápido."
  },
  "SENSE LITE TWS": {
    "Características generales": "Tecnología OpenSound (Oído abierto). 4 micrófonos integrados.",
    "Características Audio": "Driver Dinámico: 18 x 11 mm. Sensibilidad: 86 dB SPL @ 1 kHz.",
    "Medidas": "Peso Total: 83.5 g (Estuche + Auriculares).",
    "Características de control y conexión": "Versión Bluetooth: 5.4. Conexión multipunto y soporte de App.",
    "Batería": "Tiempo de carga: 2 hrs. Total Playtime: Hasta 32h (8h buds + 24h case).",
    "Características": "IP54 resistente a sudor/agua, Control Táctil, Ajuste seguro y discreto.",
    "Contenido de la caja": "1 JBL Sense Lite TWS, estuche de carga, cable USB-C, guía de inicio rápido."
  }
};

async function enrichJBLSpecs() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    let totalUpdated = 0;

    for (const [modelKey, specs] of Object.entries(jblSpecs)) {
      // Transform specs object to array of { label, value }
      const specsArray = Object.entries(specs).map(([label, value]) => ({ label, value }));

      // Búsqueda insensible a mayúsculas y más flexible
      const searchRegex = new RegExp(`${modelKey}`, 'i');
      
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

    console.log(`\nEnriquecimiento completado. Total de productos JBL actualizados: ${totalUpdated}`);
    process.exit(0);
  } catch (error) {
    console.error("Error durante el enriquecimiento:", error);
    process.exit(1);
  }
}

enrichJBLSpecs();

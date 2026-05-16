import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const iphoneSpecs = {
  // --- LINEA 17 (NUEVA) ---
  "IPHONE 17 PRO MAX": {
    "Acabado y Material": "Titanio aeroespacial en Plata, Naranja Cósmico y Azul Profundo. Frente de Ceramic Shield 2.",
    "Capacidad": "256 GB, 512 GB, 1 TB, 2 TB.",
    "Tamaño y Peso": "163.4 x 78.0 x 8.75 mm; 233 g.",
    "Pantalla": "Super Retina XDR OLED de 6.9\" Always-On, ProMotion 120Hz, 3000 nits pico.",
    "Resistencia": "Clasificación IP68 (hasta 6 metros por 30 minutos).",
    "Chip": "A19 Pro (CPU 6 núcleos, GPU 6 núcleos, Ray Tracing por hardware).",
    "Cámara": "Sistema Pro: 48MP Principal (f/1.78), 48MP Ultra Gran Angular (f/2.2), 48MP Teleobjetivo 5x (f/2.8).",
    "Grabación de Video": "4K 120 fps Dolby Vision (ProRes), Log, Video espacial, ACES.",
    "Cámara Frontal": "18 MP Center Stage (f/1.9) con autoenfoque.",
    "Seguridad": "Face ID.",
    "Energía y Batería": "Hasta 35 horas de reproducción de video. Carga rápida 50% en 30 minutos.",
    "Sensores": "Escáner LiDAR, Acelerómetro de alta fuerza g, Giroscopio, Barómetro, Sensor de luz ambiental dual.",
    "Conectividad": "5G, Wi-Fi 7, BT 5.4, UWB 2, Thread, NFC, GPS de doble frecuencia."
  },
  "IPHONE 17 PRO": {
    "Acabado y Material": "Titanio aeroespacial en Plata, Naranja Cósmico y Azul Profundo. Frente de Ceramic Shield 2.",
    "Capacidad": "256 GB, 512 GB, 1 TB.",
    "Tamaño y Peso": "150.0 x 71.9 x 8.75 mm; 206 g.",
    "Pantalla": "Super Retina XDR OLED de 6.3\" Always-On, ProMotion 120Hz, 3000 nits pico.",
    "Resistencia": "Clasificación IP68 (hasta 6 metros por 30 minutos).",
    "Chip": "A19 Pro (CPU 6 núcleos, GPU 6 núcleos, Ray Tracing por hardware).",
    "Cámara": "Sistema Pro: 48MP Principal (f/1.78), 48MP Ultra Gran Angular (f/2.2), 48MP Teleobjetivo 5x (f/2.8).",
    "Grabación de Video": "4K 120 fps Dolby Vision (ProRes), Log, Video espacial, ACES.",
    "Cámara Frontal": "18 MP Center Stage (f/1.9) con autoenfoque.",
    "Seguridad": "Face ID.",
    "Energía y Batería": "Hasta 30 horas de reproducción de video. Carga rápida 50% en 30 minutos.",
    "Sensores": "Escáner LiDAR, Acelerómetro de alta fuerza g, Giroscopio, Barómetro, Sensor de luz ambiental dual.",
    "Conectividad": "5G, Wi-Fi 7, BT 5.4, UWB 2, Thread, NFC, GPS de doble frecuencia."
  },
  "IPHONE AIR": {
    "Acabado y Material": "Diseño de Titanio ultra delgado (5.64mm) en Negro Espacial, Blanco Nube, Oro Claro y Azul Cielo.",
    "Capacidad": "256 GB, 512 GB, 1 TB.",
    "Tamaño y Peso": "156.2 x 74.7 x 5.64 mm; 165 g.",
    "Pantalla": "Super Retina XDR OLED de 6.5\" ProMotion 120Hz, 3000 nits pico.",
    "Resistencia": "Clasificación IP68 (hasta 6 metros por 30 minutos).",
    "Chip": "A19 Pro (CPU 6 núcleos, GPU 5 núcleos, Neural Engine 16 núcleos).",
    "Cámara": "Cámara única Fusion de 48 MP (26mm, f/1.6).",
    "Grabación de Video": "4K hasta 60 fps Dolby Vision, HDR modo Cine.",
    "Cámara Frontal": "18 MP Center Stage (f/1.9) con autoenfoque.",
    "Seguridad": "Face ID.",
    "Energía y Batería": "Hasta 25 horas de reproducción de video. Carga rápida 50% en 30 minutos.",
    "Sensores": "Acelerómetro, Giroscopio, Brújula, Barómetro, Sensor de luz ambiental.",
    "Conectividad": "5G, Wi-Fi 7, BT 5.4, UWB 2, Thread, NFC."
  },
  "IPHONE 17": {
    "Acabado y Material": "Aluminio con parte posterior de vidrio coloreado (Negro, Blanco, Azul Niebla, Salvia, Lavanda).",
    "Capacidad": "256 GB, 512 GB.",
    "Tamaño y Peso": "149.6 x 71.5 x 7.95 mm; 177 g.",
    "Pantalla": "Super Retina XDR OLED de 6.3\" ProMotion 120Hz, 3000 nits pico.",
    "Resistencia": "Clasificación IP68 (hasta 6 metros por 30 minutos).",
    "Chip": "A19 (CPU 6 núcleos, GPU 5 núcleos, Neural Engine 16 núcleos).",
    "Cámara": "Sistema de dos cámaras Fusion: 48 MP Principal (f/1.6) + 12 MP Ultra gran angular (f/2.2).",
    "Grabación de Video": "4K Dolby Vision, Video espacial 1080p, Cámara lenta 1080p hasta 240 fps.",
    "Cámara Frontal": "18 MP Center Stage (f/1.9) con autoenfoque.",
    "Seguridad": "Face ID.",
    "Energía y Batería": "Hasta 30 horas de reproducción de video. Carga rápida (50% en 20 min).",
    "Sensores": "Acelerómetro de alta fuerza g, Giroscopio, Brújula, Barómetro, Sensor de luz ambiental dual.",
    "Conectividad": "5G, Wi-Fi 7, BT 5.4, UWB 2, Thread, NFC."
  },
  "IPHONE 17E": {
    "Acabado y Material": "Aluminio y vidrio en Negro, Blanco y Rosa Suave. Frente de Ceramic Shield 2.",
    "Capacidad": "256 GB, 512 GB.",
    "Tamaño y Peso": "146.7 x 71.5 x 7.80 mm; 169 g.",
    "Pantalla": "Pantalla OLED de 6.1 pulgadas (2532 x 1170), 60Hz.",
    "Resistencia": "Clasificación IP67 (hasta 1 metro por 30 minutos).",
    "Chip": "A19 (CPU 6 núcleos, GPU 4 núcleos).",
    "Cámara": "Una cámara Fusion de 48 MP (f/1.6) con Zoom óptico 2x.",
    "Grabación de Video": "4K hasta 60 fps, Modo Cine hasta 4K HDR.",
    "Cámara Frontal": "12 MP TrueDepth con Modo Retrato.",
    "Seguridad": "Face ID (Sistema TrueDepth).",
    "Energía y Batería": "Hasta 21 horas de reproducción de video. Carga rápida 50% en 30 minutos.",
    "Sensores": "Acelerómetro, Giroscopio, Barómetro, Sensor de luz ambiental.",
    "Conectividad": "5G (Sub-6 GHz), Wi-Fi 6, Bluetooth 5.3, NFC."
  },

  // --- LINEA 16 ---
  "IPHONE 16 PRO MAX": {
    "Acabado y Material": "Titanio (Negro, Blanco, Natural, Desierto). Vidrio mate texturizado.",
    "Capacidad": "256 GB, 512 GB, 1 TB.",
    "Tamaño y Peso": "163.0 x 77.6 x 8.25 mm; 227 g.",
    "Pantalla": "Super Retina XDR OLED de 6.9\" ProMotion 120Hz, Alway-On, 2000 nits pico.",
    "Resistencia": "Clasificación IP68 (hasta 6 metros por 30 minutos).",
    "Chip": "A18 Pro (Neural Engine de 16 núcleos).",
    "Cámara": "Sistema Pro: 48MP Principal, 48MP Ultra Gran Angular, 12MP Teleobjetivo 5x.",
    "Grabación de Video": "4K a 120 fps Dolby Vision, ProRes, Video espacial.",
    "Cámara Frontal": "TrueDepth 12MP (f/1.9) con autoenfoque.",
    "Seguridad": "Face ID, Control de Cámara.",
    "Energía y Batería": "Hasta 33 horas de reproducción de video. Carga USB-C (USB 3).",
    "Sensores": "Escáner LiDAR, Barómetro, Giroscopio de alto rango, Acelerómetro de alta fuerza g.",
    "Conectividad": "5G, Wi-Fi 7, Bluetooth 5.3, NFC, Thread."
  },
  "IPHONE 16 PRO": {
    "Acabado y Material": "Titanio (Negro, Blanco, Natural, Desierto). Vidrio mate texturizado.",
    "Capacidad": "128 GB, 256 GB, 512 GB, 1 TB.",
    "Tamaño y Peso": "149.6 x 71.5 x 8.25 mm; 199 g.",
    "Pantalla": "Super Retina XDR OLED de 6.3\" ProMotion 120Hz, 2000 nits pico.",
    "Resistencia": "Clasificación IP68 (hasta 6 metros por 30 minutos).",
    "Chip": "A18 Pro (CPU 6 núcleos, GPU 6 núcleos).",
    "Cámara": "Sistema Pro: 48MP Principal, 48MP Ultra Gran Angular, 12MP Teleobjetivo 5x.",
    "Grabación de Video": "4K a 120 fps Dolby Vision, ProRes.",
    "Cámara Frontal": "TrueDepth 12MP (f/1.9) con autoenfoque.",
    "Seguridad": "Face ID, Control de Cámara.",
    "Energía y Batería": "Hasta 27 horas de reproducción de video.",
    "Sensores": "Escáner LiDAR, Barómetro, Giroscopio de alto rango.",
    "Conectividad": "5G, Wi-Fi 7, Bluetooth 5.3, Thread."
  },
  "IPHONE 16": {
    "Acabado y Material": "Aluminio con vidrio infusionado en color (Negro, Blanco, Rosa, Turquesa, Ultramar).",
    "Capacidad": "128 GB, 256 GB, 512 GB.",
    "Tamaño y Peso": "147.6 x 71.6 x 7.80 mm; 170 g.",
    "Pantalla": "Super Retina XDR OLED de 6.1\", Dynamic Island, 2000 nits pico.",
    "Resistencia": "Clasificación IP68 (6m por 30 min).",
    "Chip": "A18 (CPU 6 núcleos, GPU 5 núcleos).",
    "Cámara": "Dual Fusion: 48 MP Principal + 12 MP Ultra Gran Angular.",
    "Grabación de Video": "4K Dolby Vision, Video espacial.",
    "Cámara Frontal": "TrueDepth 12MP (f/1.9).",
    "Seguridad": "Face ID, Action Button, Control de Cámara.",
    "Energía y Batería": "Hasta 22 horas de reproducción de video. Carga USB-C (USB 2).",
    "Sensores": "Acelerómetro, Giroscopio, Barómetro, Luz ambiental dual.",
    "Conectividad": "5G, Wi-Fi 7, Bluetooth 5.3, NFC."
  },
  "IPHONE 16E": {
    "Acabado y Material": "Aluminio con vidrio infusionado en color (Negro, Blanco).",
    "Capacidad": "128 GB, 256 GB.",
    "Tamaño y Peso": "147.6 x 71.6 x 7.80 mm; 170 g.",
    "Pantalla": "Super Retina XDR OLED de 6.1\", Dynamic Island, 1600 nits pico.",
    "Resistencia": "Clasificación IP68 (6m por 30 min).",
    "Chip": "A18 (CPU 6 núcleos, GPU 5 núcleos).",
    "Cámara": "Principal de 48 MP + Ultra Gran Angular de 12 MP.",
    "Grabación de Video": "4K Dolby Vision.",
    "Cámara Frontal": "TrueDepth 12MP.",
    "Seguridad": "Face ID.",
    "Energía y Batería": "Hasta 20 horas de reproducción de video. Carga USB-C.",
    "Sensores": "Acelerómetro, Giroscopio, Barómetro, Luz ambiental.",
    "Conectividad": "5G, Wi-Fi 6E, Bluetooth 5.3."
  },

  // --- LINEA 15 ---
  "IPHONE 15 PRO MAX": {
    "Acabado y Material": "Titanio (Negro, Blanco, Azul, Natural). Vidrio mate.",
    "Capacidad": "256 GB, 512 GB, 1 TB.",
    "Tamaño y Peso": "159.9 x 76.7 x 8.25 mm; 221 g.",
    "Pantalla": "Super Retina XDR 6.7\", ProMotion 120Hz, 2000 nits pico.",
    "Resistencia": "Clasificación IP68.",
    "Chip": "A17 Pro (GPU 6 núcleos, Ray Tracing).",
    "Cámara": "48MP Principal, 12MP Ultra Gran Angular, 12MP Tele 5x.",
    "Grabación de Video": "4K ProRes, Video espacial, Log.",
    "Cámara Frontal": "TrueDepth 12MP.",
    "Seguridad": "Face ID, Action Button.",
    "Energía y Batería": "Hasta 29 horas de video. USB-C (USB 3).",
    "Sensores": "LiDAR, Barómetro, Giroscopio.",
    "Conectividad": "5G, Wi-Fi 6E, BT 5.3, Thread."
  },
  "IPHONE 15 PRO": {
    "Acabado y Material": "Titanio (Negro, Blanco, Azul, Natural).",
    "Capacidad": "128 GB, 256 GB, 512 GB, 1 TB.",
    "Tamaño y Peso": "146.6 x 70.6 x 8.25 mm; 187 g.",
    "Pantalla": "Super Retina XDR 6.1\", ProMotion 120Hz, 2000 nits pico.",
    "Resistencia": "Clasificación IP68.",
    "Chip": "A17 Pro.",
    "Cámara": "48MP Principal, 12MP Ultra Gran Angular, 12MP Tele 3x.",
    "Grabación de Video": "4K ProRes, Log.",
    "Cámara Frontal": "TrueDepth 12MP.",
    "Seguridad": "Face ID, Action Button.",
    "Energía y Batería": "Hasta 23 horas de video. USB-C (USB 3).",
    "Sensores": "LiDAR, Barómetro.",
    "Conectividad": "5G, Wi-Fi 6E, BT 5.3."
  },
  "IPHONE 15": {
    "Acabado y Material": "Aluminio con vidrio infusionado (Negro, Azul, Verde, Amarillo, Rosa).",
    "Capacidad": "128 GB, 256 GB, 512 GB.",
    "Tamaño y Peso": "147.6 x 71.6 x 7.80 mm; 171 g.",
    "Pantalla": "Super Retina XDR 6.1\", Dynamic Island, 2000 nits pico.",
    "Resistencia": "Clasificación IP68.",
    "Chip": "A16 Bionic.",
    "Cámara": "Sitema avanzado: 48MP Principal + 12MP Ultra Gran Angular.",
    "Grabación de Video": "4K Dolby Vision, Modo Cine hasta 4K.",
    "Cámara Frontal": "TrueDepth 12MP.",
    "Seguridad": "Face ID.",
    "Energía y Batería": "Hasta 20 horas de video. Carga USB-C (USB 2).",
    "Sensores": "Barómetro, Giroscopio, Acelerómetro.",
    "Conectividad": "5G, Wi-Fi 6, BT 5.3."
  },

  // --- LINEAS ANTERIORES (14 y 13) ---
  "IPHONE 14": {
    "Acabado y Material": "Aluminio y vidrio (Medianoche, Estelar, Rojo, Azul, Púrpura, Amarillo).",
    "Capacidad": "128 GB, 256 GB, 512 GB.",
    "Tamaño y Peso": "146.7 x 71.5 x 7.80 mm; 172 g.",
    "Pantalla": "Super Retina XDR OLED 6.1\", Notch, 1200 nits pico (HDR).",
    "Resistencia": "IP68.",
    "Chip": "A15 Bionic (GPU 5 núcleos).",
    "Cámara": "Doble cámara de 12 MP (Principal + Ultra Gran Angular).",
    "Grabación de Video": "4K Modo Cine, Modo Acción.",
    "Cámara Frontal": "TrueDepth 12MP (f/1.9).",
    "Seguridad": "Face ID, Emergencia SOS vía satélite.",
    "Energía y Batería": "Hasta 20 horas de video. Puerto Lightning.",
    "Sensores": "Barómetro, Giroscopio, Detección de Choques.",
    "Conectividad": "5G, Wi-Fi 6, BT 5.3."
  },
  "IPHONE 13": {
    "Acabado y Material": "Aluminio y vidrio (Medianoche, Estelar, Azul, Rosa, Verde, Rojo).",
    "Capacidad": "128 GB, 256 GB, 512 GB.",
    "Tamaño y Peso": "146.7 x 71.5 x 7.65 mm; 174 g.",
    "Pantalla": "Super Retina XDR OLED 6.1\", Notch reducido.",
    "Resistencia": "IP68.",
    "Chip": "A15 Bionic (GPU 4 núcleos).",
    "Cámara": "Sitema de 12 MP en diagonal (Principal + Ultra Gran Angular).",
    "Grabación de Video": "Modo Cine (1080p a 30 fps), HDR 4K.",
    "Cámara Frontal": "TrueDepth 12MP.",
    "Seguridad": "Face ID.",
    "Energía y Batería": "Hasta 19 horas de video. Puerto Lightning.",
    "Sensores": "Barómetro, Giroscopio, Acelerómetro.",
    "Conectividad": "5G, Wi-Fi 6, BT 5.0."
  }
};

async function enrichIphoneSpecs() {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(MONGODB_URI);
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    let totalUpdated = 0;

    for (const [modelKey, specs] of Object.entries(iphoneSpecs)) {
      const specsArray = Object.entries(specs).map(([label, value]) => ({ label, value }));

      let query = null;
      
      // Lógica de mapeo robusta
      if (modelKey.includes("PRO MAX")) {
        query = { name: { $regex: new RegExp(modelKey, 'i') } };
      } else if (modelKey.includes("PRO")) {
        query = { 
          name: { $regex: new RegExp(modelKey, 'i') },
          $and: [{ name: { $not: /MAX/i } }]
        };
      } else if (modelKey === "IPHONE AIR") {
        query = { name: { $regex: /IPHONE AIR/i } };
      } else if (modelKey === "IPHONE 17E") {
        query = { name: { $regex: /IPHONE 17E/i } };
      } else if (modelKey === "IPHONE 16E") {
        query = { name: { $regex: /IPHONE 16E/i } };
      } else if (modelKey === "IPHONE 17") {
        query = { 
          name: { $regex: /IPHONE 17/i },
          $and: [
            { name: { $not: /PRO/i } },
            { name: { $not: /MAX/i } },
            { name: { $not: /17E/i } },
            { name: { $not: /AIR/i } },
            { name: { $not: /PLUS/i } }
          ]
        };
      } else if (modelKey === "IPHONE 16") {
        query = { 
          name: { $regex: /IPHONE 16/i },
          $and: [
              { name: { $not: /PRO/i } },
              { name: { $not: /MAX/i } },
              { name: { $not: /16E/i } },
              { name: { $not: /PLUS/i } }
          ]
        };
      } else if (modelKey === "IPHONE 15") {
        query = { 
          name: { $regex: /IPHONE 15/i },
          $and: [{ name: { $not: /PRO/i } }, { name: { $not: /MAX/i } }, { name: { $not: /PLUS/i } }]
        };
      } else if (modelKey === "IPHONE 14") {
        query = { 
          name: { $regex: /IPHONE 14/i },
          $and: [{ name: { $not: /PRO/i } }, { name: { $not: /MAX/i } }, { name: { $not: /PLUS/i } }]
        };
      } else if (modelKey === "IPHONE 13") {
        query = { 
          name: { $regex: /IPHONE 13/i },
          $and: [{ name: { $not: /PRO/i } }, { name: { $not: /MAX/i } }, { name: { $not: /MINI/i } }]
        };
      }

      if (!query) {
        console.warn(`Aviso: No se pudo generar una consulta para el modelo ${modelKey}. Saltando...`);
        continue;
      }

      const result = await Product.updateMany(
        query,
        { $set: { specifications: specsArray } }
      );

      if (result.matchedCount > 0) {
        console.log(`Modelo ${modelKey}: Mapeados ${result.matchedCount} productos.`);
        totalUpdated += result.matchedCount;
      }
    }

    console.log(`\nEnriquecimiento completado. Total de productos iPhone procesados: ${totalUpdated}`);
    process.exit(0);
  } catch (error) {
    console.error("Error durante el enriquecimiento:", error);
    process.exit(1);
  }
}

enrichIphoneSpecs();

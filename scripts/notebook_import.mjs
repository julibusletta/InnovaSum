import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

function getMongoUri() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=["']?(.*?)["']?(\s|$)/);
    return match ? match[1].trim() : null;
  } catch (e) {
    return process.env.MONGODB_URI;
  }
}

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  stock: { type: Number, default: 10 },
  published: { type: Boolean, default: true },
  specifications: [{
    label: { type: String },
    value: { type: String }
  }]
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const products = [
  {
    name: "ACER ASPIRE A14-52M-72FH ULTRA7-256V 16/1TB/14\"",
    priceUSD: 695,
    specs: {
      "Marca": "Acer",
      "Modelo": "Aspire 14 AI A14-52M-72FH",
      "Procesador": "Intel Core Ultra 7 256V",
      "Memoria": "16GB LPDDR5X (Integrada)",
      "Gráficos": "Intel Arc 140V Graphics",
      "Almacenamiento": "1TB PCIe NVMe SSD",
      "Pantalla": "14\" WUXGA (1920 x 1200) IPS Anti-glare",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Si",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "2x USB4 Type-C (Thunderbolt 4 / DP / PD), 2x USB 3.2 Gen 1 Type-A",
      "Wi-fi": "Wi-Fi 6E",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 2.1",
      "Aur. y mic": "Si (Combo jack 3.5mm)",
      "Bateria": "65 Wh Lithium Ion",
      "Peso": "1.4 kg"
    }
  },
  {
    name: "ACER ASPIRE GO AG15-71PT-72GA TOUCH-CORE I7 16/512GB",
    priceUSD: 659,
    specs: {
      "Marca": "Acer",
      "Modelo": "Aspire Go 15 AG15-71PT-72GA",
      "Procesador": "Intel Core i7-13620H",
      "Memoria": "16 GB DDR5 5200 MHz",
      "Gráficos": "Intel UHD Graphics integrados",
      "Almacenamiento": "512 GB PCIe Gen4 NVMe M.2 SSD",
      "Pantalla": "15.6\" Full HD (1920 x 1080) IPS, Touchscreen",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Si",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x USB Type-C (DP / Charging), 2x USB 3.2 Gen 1 Type-A",
      "Wi-fi": "Wi-Fi 6 (802.11ax)",
      "Bluetooth": "5.1",
      "Vga": "No",
      "Hdmi": "1x HDMI",
      "Aur. y mic": "Si (Audio Jack)",
      "Bateria": "3 celdas, 53 Wh Lithium-Ion",
      "Peso": "1.8 kg"
    }
  },
  {
    name: "ACER NITRO V 16 ANV16-72-7809 I7-13620H 32/512GB",
    priceUSD: 1173,
    specs: {
      "Marca": "Acer",
      "Modelo": "Nitro V 16 ANV16-72-7809",
      "Procesador": "Intel Core 7 240H (Deca-core)",
      "Memoria": "32 GB DDR5 SDRAM",
      "Gráficos": "NVIDIA GeForce RTX 5060 (8 GB GDDR7 dedicada)",
      "Almacenamiento": "512 GB PCIe NVMe SSD",
      "Pantalla": "16\" WUXGA (1920 x 1200) 165Hz IPS",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Si (Naranja)",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Si (microSD)",
      "Usb": "1x USB-C (Thunderbolt 4 / PD / DP), 2x USB 3.2 Gen 2 Type-A",
      "Wi-fi": "Wi-Fi 6E",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 2.1",
      "Aur. y mic": "Si (Combo jack)",
      "Bateria": "4 celdas, 57 Wh Lithium-Ion",
      "Peso": "2.5 kg"
    }
  },
  {
    name: "ASUS ROG STRIX G16 16\" FHD I7-14650HS 16/1TB SSD",
    priceUSD: 1395,
    specs: {
      "Marca": "Asus",
      "Modelo": "ROG Strix G16 (Modelo 2025/2026 G615)",
      "Procesador": "Intel Core i7-14650HX (16 Cores, hasta 5.2 GHz)",
      "Memoria": "16 GB DDR5-5600",
      "Gráficos": "NVIDIA GeForce RTX 5060 (8 GB GDDR7)",
      "Almacenamiento": "1 TB PCIe 4.0 NVMe SSD",
      "Pantalla": "16\" FHD+ (1920 x 1200) 165Hz IPS",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Si (RGB 4 zonas)",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x Thunderbolt 4, 1x USB 3.2 Gen 2 Type-C (PD / DP), 2x USB 3.2 Gen 2 Type-A",
      "Wi-fi": "Wi-Fi 6E",
      "Bluetooth": "5.4",
      "Vga": "No",
      "Hdmi": "1x HDMI 2.1 FRL",
      "Aur. y mic": "Si (Combo jack)",
      "Bateria": "90 Wh",
      "Peso": "2.5 kg"
    }
  },
  {
    name: "ASUS VIVOBOOK 14 F1404ZA-TS52 INTEL CORE I5 8/512GB",
    priceUSD: 415,
    specs: {
      "Marca": "Asus",
      "Modelo": "Vivobook 14 F1404ZA-TS52",
      "Procesador": "Intel Core i5-1235U",
      "Memoria": "8 GB DDR4",
      "Gráficos": "Intel Iris Xe Graphics",
      "Almacenamiento": "512 GB SSD M.2 PCIe NVMe",
      "Pantalla": "14\" Full HD (1920 x 1080) IPS-level",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Si",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x USB 3.2 Gen 1 Type-C, 2x USB 3.2 Gen 1 Type-A, 1x USB 2.0 Type-A",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4",
      "Aur. y mic": "Si (Combo jack)",
      "Bateria": "3 celdas, 42 Wh",
      "Peso": "1.4 kg"
    }
  },
  {
    name: "ASUS VIVOBOOK 16 F1605VA-BS74 I7-13620H 16/512GB",
    priceUSD: 690,
    specs: {
      "Marca": "Asus",
      "Modelo": "Vivobook 16 F1605VA-BS74",
      "Procesador": "Intel Core i7-13620H",
      "Memoria": "16 GB DDR4",
      "Gráficos": "Intel UHD Graphics",
      "Almacenamiento": "512 GB M.2 NVMe PCIe 4.0 SSD",
      "Pantalla": "16\" WUXGA (1920 x 1200) 60Hz IPS-level",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Si",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x USB 3.2 Gen 1 Type-C, 2x USB 3.2 Gen 1 Type-A, 1x USB 2.0 Type-A",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4",
      "Aur. y mic": "Si (Combo jack)",
      "Bateria": "3 celdas, 42 Wh",
      "Peso": "1.88 kg"
    }
  },
  {
    name: "ASUS VIVOBOOK 16 F1605VA-WS74 I7-1355U 16/512GB",
    priceUSD: 588,
    specs: {
      "Marca": "Asus",
      "Modelo": "Vivobook 16 F1605VA-WS74",
      "Procesador": "Intel Core i7-1355U",
      "Memoria": "16 GB DDR4",
      "Gráficos": "Intel Iris Xe Graphics",
      "Almacenamiento": "512 GB M.2 NVMe PCIe 4.0 SSD",
      "Pantalla": "16\" WUXGA (1920 x 1200) 60Hz IPS-level",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Si",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x USB 3.2 Gen 1 Type-C, 2x USB 3.2 Gen 1 Type-A, 1x USB 2.0 Type-A",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4",
      "Aur. y mic": "Si (Combo jack)",
      "Bateria": "3 celdas, 42 Wh",
      "Peso": "1.88 kg"
    }
  },
  {
    name: "ASUS VIVOBOOK GO E1504FA-AS52 R5-7520U 8/512GB",
    priceUSD: 395,
    specs: {
      "Marca": "Asus",
      "Modelo": "Vivobook Go 15 E1504FA-AS52",
      "Procesador": "AMD Ryzen 5 7520U",
      "Memoria": "8 GB LPDDR5 (Onboard)",
      "Gráficos": "AMD Radeon 610M Graphics integrada",
      "Almacenamiento": "512 GB M.2 NVMe PCIe 3.0 SSD",
      "Pantalla": "15.6\" Full HD (1920 x 1080) 16:9, Anti-glare",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Si",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x USB 3.2 Gen 1 Type-C, 1x USB 3.2 Gen 1 Type-A, 1x USB 2.0 Type-A",
      "Wi-fi": "Wi-Fi 6E (802.11ax)",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4",
      "Aur. y mic": "Si (Combo jack)",
      "Bateria": "3 celdas, 42 Wh",
      "Peso": "1.63 kg"
    }
  },
  {
    name: "ASUS VIVOBOOK X1404VAP-V14.C58256 14\" I5 8/256SSD",
    priceUSD: 379,
    specs: {
      "Marca": "Asus",
      "Modelo": "Vivobook 14 X1404VAP-V14.C58256",
      "Procesador": "Intel Core 5 120U",
      "Memoria": "8 GB DDR4",
      "Gráficos": "Intel Graphics integrados",
      "Almacenamiento": "256 GB M.2 NVMe PCIe 3.0 SSD",
      "Pantalla": "14\" Full HD (1920 x 1080) 16:9, Anti-glare",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Si",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x USB 3.2 Gen 1 Type-C, 2x USB 3.2 Gen 1 Type-A, 1x USB 2.0 Type-A",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.2",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4",
      "Aur. y mic": "Si (Combo jack)",
      "Bateria": "3 celdas, 42 Wh",
      "Peso": "1.4 kg"
    }
  },
  {
    name: "ASUS VIVOBOOK X1404ZA-I38128 INTEL CORE I3 8/128GB",
    priceUSD: 299,
    specs: {
      "Marca": "Asus",
      "Modelo": "Vivobook 14 X1404ZA-I38128",
      "Procesador": "Intel Core i3-1215U",
      "Memoria": "8 GB DDR4",
      "Gráficos": "Intel UHD Graphics",
      "Almacenamiento": "128 GB SSD M.2 PCIe NVMe",
      "Pantalla": "14\" Full HD (1920 x 1080) 16:9, Anti-glare",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "No",
      "Sist. Operativo": "Windows 11 Home (a menudo en S Mode)",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x USB 3.2 Gen 1 Type-C, 2x USB 3.2 Gen 1 Type-A, 1x USB 2.0 Type-A",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4",
      "Aur. y mic": "Si (Combo jack)",
      "Bateria": "3 celdas, 42 Wh",
      "Peso": "1.4 kg"
    }
  },
  {
    name: "ASUS ZENBOOK 14 UX3405CA-U7512 ULTRA 7 16/512SSD",
    priceUSD: 852,
    specs: {
      "Marca": "ASUS",
      "Modelo": "Zenbook 14 UX3405CA-U7512",
      "Procesador": "Intel Core Ultra 7 255H (Series 2)",
      "Memoria": "16GB LPDDR5X (Onboard)",
      "Gráficos": "Integrated Intel Arc Graphics",
      "Almacenamiento": "512GB PCIe Gen4 NVMe SSD",
      "Pantalla": "14\" OLED, WUXGA (1920x1200), 16:10, Táctil, 500 nits, 60Hz",
      "Distribucion teclado": "Inglés US (QWERTY)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "2x Thunderbolt 4 (Type-C), 1x USB 3.2 Gen 1 Type-A",
      "Wi-fi": "Wi-Fi 6E (802.11ax)",
      "Bluetooth": "5.4",
      "Vga": "No",
      "Hdmi": "1x HDMI 2.1 (TMDS)",
      "Aur. y mic": "1x 3.5mm Combo Audio Jack",
      "Bateria": "75WHrs, 4 celdas Li-ion",
      "Peso": "1.28 kg"
    }
  },
  {
    name: "DELL I5441-SX8685 SNAPDRAGON X PLUS 16/1TB SSD",
    priceUSD: 635,
    specs: {
      "Marca": "Dell",
      "Modelo": "Inspiron 14 5441 (SX8685)",
      "Procesador": "Qualcomm Snapdragon X Plus X1P-42-100 (8 núcleos)",
      "Memoria": "16GB LPDDR5X (Soldada)",
      "Gráficos": "Qualcomm Adreno GPU",
      "Almacenamiento": "1TB M.2 PCIe NVMe SSD",
      "Pantalla": "14\" FHD+ (1920x1200), 16:10, 300 nits, Anti-glare",
      "Distribucion teclado": "Inglés US (QWERTY)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home (Copilot+)",
      "Lector Optico": "No",
      "Lector de Tarjetas": "MicroSD",
      "Usb": "2x USB-C (USB4 Gen 3), 1x USB 3.2 Gen 1 Type-A",
      "Wi-fi": "Wi-Fi 7 (Qualcomm FastConnect 7800)",
      "Bluetooth": "5.4",
      "Vga": "No",
      "Hdmi": "No (vía USB-C)",
      "Aur. y mic": "1x 3.5mm Combo",
      "Bateria": "54Wh, 3 celdas",
      "Peso": "1.53 kg"
    }
  },
  {
    name: "DELL LDC15255-7322 15.6\" AMD RYZEN 7 7730U 16/1TB",
    priceUSD: 605,
    specs: {
      "Marca": "Dell",
      "Modelo": "Inspiron 15 DC15255 (Base serie 3525/3535)",
      "Procesador": "AMD Ryzen 7 7730U (8 núcleos)",
      "Memoria": "16GB DDR4",
      "Gráficos": "AMD Radeon Graphics",
      "Almacenamiento": "1TB SSD NVMe",
      "Pantalla": "15.6\" IPS FHD (1920x1080), 120Hz",
      "Distribucion teclado": "Inglés US (QWERTY)",
      "Teclado retroiluminado": "No",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Sí (SD)",
      "Usb": "1x USB 3.2 Gen 1 Type-C, 1x USB 3.2 Gen 1 Type-A, 1x USB 2.0",
      "Wi-fi": "Wi-Fi 5 (802.11ac)",
      "Bluetooth": "Sí",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4",
      "Aur. y mic": "1x 3.5mm Combo",
      "Bateria": "41Wh, 3 celdas",
      "Peso": "1.68 kg"
    }
  },
  {
    name: "HP 14-CF2111WM INTEL CELERON 4/64GB EMMC BLUE",
    priceUSD: 220,
    specs: {
      "Marca": "HP",
      "Modelo": "Stream 14-cf2111wm",
      "Procesador": "Intel Celeron N4120",
      "Memoria": "4GB DDR4",
      "Gráficos": "Intel UHD Graphics 600",
      "Almacenamiento": "64GB eMMC",
      "Pantalla": "14\" HD (1366x768), micro-edge",
      "Distribucion teclado": "Inglés US (QWERTY)",
      "Teclado retroiluminado": "No",
      "Sist. Operativo": "Windows 11 Home (Modo S)",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Sí (SD)",
      "Usb": "1x USB-C, 2x USB-A",
      "Wi-fi": "Wi-Fi 5",
      "Bluetooth": "5.0",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4b",
      "Aur. y mic": "1x 3.5mm Combo",
      "Bateria": "41Wh, 3 celdas",
      "Peso": "1.46 kg"
    }
  },
  {
    name: "HP 14-DQ6011DX 14\" INTEL N150 4/128GB UFS SILVER",
    priceUSD: 183,
    specs: {
      "Marca": "HP",
      "Modelo": "Laptop 14-dq6011dx (Silver)",
      "Procesador": "Intel Processor N150 (4 núcleos, hasta 3.6 GHz)",
      "Memoria": "4GB DDR4-3200",
      "Gráficos": "Intel UHD Graphics",
      "Almacenamiento": "128GB UFS",
      "Pantalla": "14\" HD (1366x768)",
      "Distribucion teclado": "Inglés US (QWERTY)",
      "Teclado retroiluminado": "No",
      "Sist. Operativo": "Windows 11 Home (Modo S)",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Sí (SD)",
      "Usb": "1x USB-C (10Gbps), 2x USB-A (5Gbps)",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.4",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4b",
      "Aur. y mic": "1x 3.5mm Combo",
      "Bateria": "41Wh, 3 celdas",
      "Peso": "1.46 kg"
    }
  },
  {
    name: "HP 14-DQ6015DX 14\" INTEL N150 4/128GB UFS ROSE GOLD",
    priceUSD: 183,
    specs: {
      "Marca": "HP",
      "Modelo": "Laptop 14-dq6015dx (Rose Gold)",
      "Procesador": "Intel Processor N150 (4 núcleos, hasta 3.6 GHz)",
      "Memoria": "4GB DDR4-3200",
      "Gráficos": "Intel UHD Graphics",
      "Almacenamiento": "128GB UFS",
      "Pantalla": "14\" HD (1366x768)",
      "Distribucion teclado": "Inglés US (QWERTY)",
      "Teclado retroiluminado": "No",
      "Sist. Operativo": "Windows 11 Home (Modo S)",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Sí (SD)",
      "Usb": "1x USB-C (10Gbps), 2x USB-A (5Gbps)",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.4",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4b",
      "Aur. y mic": "1x 3.5mm Combo",
      "Bateria": "41Wh, 3 celdas",
      "Peso": "1.46 kg"
    }
  },
  {
    name: "HP 15-FA2093DX INTEL CORE I7-13620H 16/1TB SSD",
    priceUSD: 1190,
    specs: {
      "Marca": "HP",
      "Modelo": "Victus 15-fa2093dx",
      "Procesador": "Intel Core i7-13620H (10 núcleos, hasta 4.9 GHz)",
      "Memoria": "16GB DDR5",
      "Gráficos": "NVIDIA GeForce RTX 5060 (8GB)",
      "Almacenamiento": "1TB PCIe NVMe SSD",
      "Pantalla": "15.6\" IPS FHD (1920x1080), 144Hz",
      "Distribucion teclado": "Inglés US (QWERTY)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Sí (SD)",
      "Usb": "1x USB-C, 2x USB-A",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 2.1",
      "Aur. y mic": "1x 3.5mm Combo",
      "Bateria": "70Wh, 4 celdas",
      "Peso": "2.29 kg"
    }
  },
  {
    name: "HP 15-FD0131WM INTEL CORE I3 8GB DDR4 256GB SSD",
    priceUSD: 363,
    specs: {
      "Marca": "HP",
      "Modelo": "Laptop 15-fd0131wm",
      "Procesador": "Intel Core i3-N305 (8 núcleos)",
      "Memoria": "8GB DDR4",
      "Gráficos": "Intel UHD Graphics",
      "Almacenamiento": "256GB SSD NVMe",
      "Pantalla": "15.6\" IPS FHD (1920x1080)",
      "Distribucion teclado": "Inglés US (QWERTY)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x USB-C, 2x USB-A",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4b",
      "Aur. y mic": "1x 3.5mm Combo",
      "Bateria": "41Wh, 3 celdas",
      "Peso": "1.59 kg"
    }
  },
  {
    name: "HP 15-FD0182WM 15.6\" INTEL CORE I7 16/512GB SSD",
    priceUSD: 725,
    specs: {
      "Marca": "HP",
      "Modelo": "Laptop 15-fd0182wm",
      "Procesador": "Intel Core i7-1355U (10 núcleos)",
      "Memoria": "16GB DDR4",
      "Gráficos": "Intel Iris Xe Graphics",
      "Almacenamiento": "512GB SSD NVMe",
      "Pantalla": "15.6\" IPS FHD (1920x1080)",
      "Distribucion teclado": "Inglés US (QWERTY)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x USB-C, 2x USB-A",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4b",
      "Aur. y mic": "1x 3.5mm Combo",
      "Bateria": "41Wh, 3 celdas",
      "Peso": "1.59 kg"
    }
  },
  {
    name: "HP 15T-FD000 CORE I7-1355U 12/256GB SSD FHD BLACK",
    priceUSD: 538,
    specs: {
      "Marca": "HP",
      "Modelo": "Laptop 15t-fd000 (Jet Black)",
      "Procesador": "Intel Core i7-1355U (10 núcleos)",
      "Memoria": "12GB DDR4",
      "Gráficos": "Intel Iris Xe Graphics",
      "Almacenamiento": "256GB SSD NVMe",
      "Pantalla": "15.6\" IPS FHD (1920x1080)",
      "Distribucion teclado": "Inglés US (QWERTY)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1x USB-C, 2x USB-A",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4b",
      "Aur. y mic": "1x 3.5mm Combo",
      "Bateria": "41Wh, 3 celdas",
      "Peso": "1.59 kg"
    }
  },
  {
    name: "HP 16-AG0070WM AMD RYZEN 7 8/512GB SSD SILVER",
    priceUSD: 493,
    specs: {
      "Marca": "HP",
      "Modelo": "Pavilion 16-ag0070wm",
      "Procesador": "AMD Ryzen 7 8840U (hasta 5.1 GHz, 8 núcleos)",
      "Memoria": "8GB LPDDR5-6400 MHz RAM (onboard)",
      "Gráficos": "AMD Radeon Graphics (integrado)",
      "Almacenamiento": "512GB PCIe Gen4 NVMe M.2 SSD",
      "Pantalla": "16\" WUXGA (1920 x 1200), IPS, anti-reflejo, 300 nits, 16:10",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "2 USB-C (10Gbps, PD, DP 1.4); 1 USB-A (10Gbps); 1 USB-A (5Gbps)",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1 x HDMI 2.1",
      "Aur. y mic": "1 x jack combo 3.5mm",
      "Bateria": "3 celdas, 59 Wh Li-ion polymer",
      "Peso": "1.799 kg"
    }
  },
  {
    name: "HP OMNIBOOK 5 16-AF1017WM ULTRA 7 TOUCH 16/1TB SSD",
    priceUSD: 715,
    specs: {
      "Marca": "HP",
      "Modelo": "OmniBook 5 16-af1017wm",
      "Procesador": "Intel Core Ultra 7 155U (hasta 4.8 GHz, 12 núcleos)",
      "Memoria": "16GB LPDDR5x (onboard)",
      "Gráficos": "Intel Graphics",
      "Almacenamiento": "1TB PCIe Gen4 NVMe M.2 SSD",
      "Pantalla": "16\" WUXGA (1920 x 1200), IPS, táctil, anti-reflejo, 300 nits",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "2 USB-C (10Gbps, PD, DP 1.4); 1 USB-A (10Gbps); 1 USB-A (5Gbps)",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1 x HDMI 2.1",
      "Aur. y mic": "1 x jack combo 3.5mm",
      "Bateria": "3 celdas, 59 Wh",
      "Peso": "1.77 kg"
    }
  },
  {
    name: "HP OMNIBOOK X FLIP 14-FM0023DX TOUCH ULTRA 7 16/512GB",
    priceUSD: 849,
    specs: {
      "Marca": "HP",
      "Modelo": "OmniBook X Flip 14-fm0023dx",
      "Procesador": "Intel Core Ultra 7 256V (hasta 4.8 GHz, 8 núcleos)",
      "Memoria": "16GB LPDDR5x (onboard)",
      "Gráficos": "Intel Arc Graphics 140V (integrado)",
      "Almacenamiento": "512GB PCIe Gen4 NVMe M.2 SSD",
      "Pantalla": "14\" 2.8K (2880 x 1800) OLED, multitáctil, 120Hz, 400-500 nits",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "No",
      "Usb": "1 Thunderbolt 4 (USB-C); 1 USB-C (10Gbps); 1 USB-A (10Gbps)",
      "Wi-fi": "Wi-Fi 7",
      "Bluetooth": "5.4",
      "Vga": "No",
      "Hdmi": "No (requiere adaptador USB-C)",
      "Aur. y mic": "1 x jack combo 3.5mm",
      "Bateria": "3 celdas, 59 Wh",
      "Peso": "1.34 kg"
    }
  },
  {
    name: "LENOVO IDEAPAD 1 82VG00WXUS AMD RYZEN 5 8/256GB",
    priceUSD: 359,
    specs: {
      "Marca": "Lenovo",
      "Modelo": "IdeaPad 1 15AMN7 (82VG00WXUS)",
      "Procesador": "AMD Ryzen 5 7520U (4C / 8T, 2.8 / 4.3GHz)",
      "Memoria": "8GB Soldered LPDDR5-5500",
      "Gráficos": "Integrated AMD Radeon 610M Graphics",
      "Almacenamiento": "256GB SSD M.2 2242 PCIe 4.0x4 NVMe",
      "Pantalla": "15.6\" FHD (1920x1080) TN 220nits Anti-glare",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "No",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Lector de tarjetas SD",
      "Usb": "1x USB 2.0; 1x USB 3.2 Gen 1; 1x USB-C 3.2 Gen 1 (data only)",
      "Wi-fi": "Wi-Fi 6, 11ax 2x2",
      "Bluetooth": "5.1",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4b",
      "Aur. y mic": "1x jack combo 3.5mm",
      "Bateria": "Integrada 42Wh",
      "Peso": "1.58 kg"
    }
  },
  {
    name: "LENOVO IDEAPAD SLIM 3 82XB00HVUS INTEL N100 4/128GB",
    priceUSD: 193,
    specs: {
      "Marca": "Lenovo",
      "Modelo": "IdeaPad Slim 3 15IAN8 (82XB00HVUS)",
      "Procesador": "Intel N100 (4C / 4T, hasta 3.4GHz)",
      "Memoria": "4GB Soldered LPDDR5-4800",
      "Gráficos": "Integrated Intel UHD Graphics",
      "Almacenamiento": "128GB UFS 3.1",
      "Pantalla": "15.6\" FHD (1920x1080) TN 250nits Anti-glare",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "No",
      "Sist. Operativo": "Windows 11 Home (S mode)",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Lector de tarjetas SD",
      "Usb": "2x USB 3.2 Gen 1; 1x USB-C 3.2 Gen 1 (Data, PD, DP 1.2)",
      "Wi-fi": "Wi-Fi 6, 11ax 2x2",
      "Bluetooth": "5.1",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4",
      "Aur. y mic": "1x jack combo 3.5mm",
      "Bateria": "Integrada 47Wh",
      "Peso": "1.55 kg"
    }
  },
  {
    name: "LENOVO IDEAPAD SLIM 5 83FW0001US I7-150U 16/1TB",
    priceUSD: 789,
    specs: {
      "Marca": "Lenovo",
      "Modelo": "IdeaPad Slim 5 16IRU9 (83FW0001US)",
      "Procesador": "Intel Core i7-150U (10C / 12T, hasta 5.4GHz)",
      "Memoria": "16GB Soldered LPDDR5x-5200",
      "Gráficos": "Integrated Intel Graphics",
      "Almacenamiento": "1TB SSD M.2 2242 PCIe 4.0x4 NVMe",
      "Pantalla": "16\" WUXGA (1920x1200) IPS 300nits Anti-glare, 100% sRGB",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Lector de tarjetas microSD",
      "Usb": "2x USB-A (5Gbps); 2x USB-C (5Gbps, PD 3.0, DP 1.4)",
      "Wi-fi": "Wi-Fi 6, 11ax 2x2",
      "Bluetooth": "5.2",
      "Vga": "No",
      "Hdmi": "1x HDMI 1.4b",
      "Aur. y mic": "1x jack combo 3.5mm",
      "Bateria": "Integrada 57Wh",
      "Peso": "1.89 kg"
    }
  },
  {
    name: "LENOVO YOGA 7 83DL0002US 16\" ULTRA7 155U 16/1TB",
    priceUSD: 757,
    specs: {
      "Marca": "Lenovo",
      "Modelo": "Yoga 7 2-in-1 16IML9 (83DL0002US)",
      "Procesador": "Intel Core Ultra 7 155U (hasta 4.8 GHz, 12 núcleos)",
      "Memoria": "16GB Soldered LPDDR5x-7467",
      "Gráficos": "Integrated Intel Graphics",
      "Almacenamiento": "1TB SSD M.2 2242 PCIe 4.0x4 NVMe",
      "Pantalla": "16\" WUXGA (1920x1200) IPS 300nits, táctil, Glossy, Dolby Vision",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "Sí",
      "Sist. Operativo": "Windows 11 Home",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Lector de tarjetas microSD",
      "Usb": "2x USB-A (5Gbps); 2x Thunderbolt 4 / USB4 40Gbps (PD 3.1, DP 2.1)",
      "Wi-fi": "Wi-Fi 6E",
      "Bluetooth": "5.3",
      "Vga": "No",
      "Hdmi": "1x HDMI 2.1 (hasta 4K/60Hz)",
      "Aur. y mic": "1x jack combo 3.5mm",
      "Bateria": "Integrada 71Wh",
      "Peso": "2.1 kg"
    }
  },
  {
    name: "TOSH DYNABOOK A40-G 128G BLACK",
    priceUSD: 200,
    specs: {
      "Marca": "Dynabook (Toshiba)",
      "Modelo": "Tecra A40-G1400ED",
      "Procesador": "Intel Celeron 5205U (Dual Core, 1.9 GHz)",
      "Memoria": "4GB DDR4",
      "Gráficos": "Intel UHD Graphics",
      "Almacenamiento": "128GB SSD",
      "Pantalla": "14\" HD (1366x768) Anti-glare",
      "Distribucion teclado": "Inglés (US)",
      "Teclado retroiluminado": "No",
      "Sist. Operativo": "Windows 10 Pro / 11 Pro",
      "Lector Optico": "No",
      "Lector de Tarjetas": "Lector de tarjetas microSD",
      "Usb": "1x USB-C (PD, DP); 2x USB 3.0",
      "Wi-fi": "Intel Wi-Fi 6 AX200",
      "Bluetooth": "5.0",
      "Vga": "No",
      "Hdmi": "1x HDMI",
      "Aur. y mic": "1x jack combo 3.5mm",
      "Bateria": "4 celdas, 42 Wh",
      "Peso": "1.47 kg"
    }
  }
];

async function importProducts() {
  try {
    const uri = getMongoUri();
    if (!uri) throw new Error('MONGODB_URI not found');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    for (const p of products) {
      let intermediate = p.priceUSD;
      if (p.priceUSD > 500) {
        intermediate = p.priceUSD * 1.1;
      } else {
        intermediate = p.priceUSD + 30;
      }
      
      const finalPrice = Math.round(intermediate * 1500 * 1.1);
      const id = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const specsArray = Object.entries(p.specs).map(([label, value]) => ({ label, value }));
      
      const productData = {
        id,
        name: p.name,
        price: finalPrice,
        image: '/images/categories/notebooks.png', // Default high quality image
        category: 'notebooks',
        stock: 5,
        published: true,
        specifications: specsArray,
        description: "" // No description as requested
      };

      await Product.findOneAndUpdate({ id }, productData, { upsert: true, new: true });
      console.log(`Imported/Updated: ${p.name} -> $${finalPrice} ARS`);
    }

    console.log('Import finished successfully');
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  }
}

importProducts();

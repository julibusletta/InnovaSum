import mongoose from 'mongoose';
const MONGODB_URI = 'mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin';

const productsData = [
  {
    name: "ACER ASPIRE A14-52M-72FH ULTRA7-256V 16/1TB/14\"",
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
      "Usb": "2x USB4 Type-C (Thunderbolt 4), 2x USB 3.2 Gen 1 Type-A",
      "Wi-fi": "Wi-Fi 6E",
      "Bluetooth": "5.3",
      "Hdmi": "1x HDMI 2.1",
      "Bateria": "65 Wh Lithium Ion",
      "Peso": "1.4 kg"
    }
  },
  {
    name: "ACER ASPIRE GO AG15-71PT-72GA TOUCH-CORE I7 16/512GB",
    specs: {
      "Marca": "Acer",
      "Modelo": "Aspire Go 15 AG15-71PT-72GA",
      "Procesador": "Intel Core i7-13620H",
      "Memoria": "16 GB DDR5 5200 MHz",
      "Gráficos": "Intel UHD Graphics integrados",
      "Almacenamiento": "512 GB PCIe Gen4 NVMe M.2 SSD",
      "Pantalla": "15.6\" Full HD IPS, Touchscreen",
      "Teclado retroiluminado": "Si",
      "Sist. Operativo": "Windows 11 Home",
      "Usb": "1x USB Type-C, 2x USB 3.2 Gen 1 Type-A",
      "Wi-fi": "Wi-Fi 6",
      "Bluetooth": "5.1",
      "Hdmi": "1x HDMI",
      "Bateria": "3 celdas, 53 Wh",
      "Peso": "1.8 kg"
    }
  },
  {
    name: "ACER NITRO V 16 ANV16-72-7809 I7-13620H 32/512GB",
    specs: {
      "Marca": "Acer",
      "Modelo": "Nitro V 16 ANV16-72-7809",
      "Procesador": "Intel Core 7 240H",
      "Memoria": "32 GB DDR5 SDRAM",
      "Gráficos": "NVIDIA GeForce RTX 5060 (8 GB GDDR7)",
      "Almacenamiento": "512 GB PCIe NVMe SSD",
      "Pantalla": "16\" WUXGA 165Hz IPS",
      "Teclado retroiluminado": "Si (Naranja)",
      "Sist. Operativo": "Windows 11 Home",
      "Usb": "1x USB-C (Thunderbolt 4), 2x USB 3.2 Gen 2 Type-A",
      "Wi-fi": "Wi-Fi 6E",
      "Hdmi": "1x HDMI 2.1",
      "Bateria": "4 celdas, 57 Wh",
      "Peso": "2.5 kg"
    }
  },
  {
      name: "ASUS ROG STRIX G16 16\" FHD I7-14650HS 16/1TB SSD",
      specs: {
          "Marca": "Asus",
          "Modelo": "ROG Strix G16",
          "Procesador": "Intel Core i7-14650HX",
          "Memoria": "16 GB DDR5-5600",
          "Gráficos": "NVIDIA GeForce RTX 5060 (8 GB GDDR7)",
          "Almacenamiento": "1 TB PCIe 4.0 NVMe SSD",
          "Pantalla": "16\" FHD+ 165Hz IPS",
          "Teclado retroiluminado": "Si (RGB 4 zonas)",
          "Sist. Operativo": "Windows 11 Home",
          "Usb": "1x Thunderbolt 4, 1x USB 3.2 Gen 2 Type-C, 2x USB 3.2 Gen 2 Type-A",
          "Bateria": "90 Wh",
          "Peso": "2.5 kg"
      }
  },
  {
      name: "ASUS VIVOBOOK 14 F1404ZA-TS52 INTEL CORE I5 8/512GB",
      specs: {
          "Marca": "Asus",
          "Modelo": "Vivobook 14 F1404ZA-TS52",
          "Procesador": "Intel Core i5-1235U",
          "Memoria": "8 GB DDR4",
          "Gráficos": "Intel Iris Xe Graphics",
          "Almacenamiento": "512 GB SSD M.2 PCIe NVMe",
          "Pantalla": "14\" Full HD IPS-level",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "3 celdas, 42 Wh",
          "Peso": "1.4 kg"
      }
  },
  {
      name: "ASUS VIVOBOOK 16 F1605VA-BS74 I7-13620H 16/512GB",
      specs: {
          "Marca": "Asus",
          "Modelo": "Vivobook 16 F1605VA-BS74",
          "Procesador": "Intel Core i7-13620H",
          "Memoria": "16 GB DDR4",
          "Gráficos": "Intel UHD Graphics",
          "Almacenamiento": "512 GB M.2 NVMe PCIe SSD",
          "Pantalla": "16\" WUXGA 60Hz IPS-level",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "3 celdas, 42 Wh",
          "Peso": "1.88 kg"
      }
  },
  {
      name: "ASUS VIVOBOOK 16 F1605VA-WS74 I7-1355U 16/512GB",
      specs: {
          "Marca": "Asus",
          "Modelo": "Vivobook 16 F1605VA-WS74",
          "Procesador": "Intel Core i7-1355U",
          "Memoria": "16 GB DDR4",
          "Gráficos": "Intel Iris Xe Graphics",
          "Almacenamiento": "512 GB M.2 NVMe PCIe SSD",
          "Pantalla": "16\" WUXGA 60Hz IPS-level",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "3 celdas, 42 Wh",
          "Peso": "1.88 kg"
      }
  },
  {
      name: "ASUS VIVOBOOK GO E1504FA-AS52 R5-7520U 8/512GB",
      specs: {
          "Marca": "Asus",
          "Modelo": "Vivobook Go 15 E1504FA-AS52",
          "Procesador": "AMD Ryzen 5 7520U",
          "Memoria": "8 GB LPDDR5",
          "Gráficos": "AMD Radeon 610M Graphics",
          "Almacenamiento": "512 GB M.2 NVMe PCIe SSD",
          "Pantalla": "15.6\" Full HD Anti-glare",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "3 celdas, 42 Wh",
          "Peso": "1.63 kg"
      }
  },
  {
      name: "ASUS VIVOBOOK X1404VAP-V14.C58256 14\" I5 8/256SSD",
      specs: {
          "Marca": "Asus",
          "Modelo": "Vivobook 14 X1404VAP",
          "Procesador": "Intel Core 5 120U",
          "Memoria": "8 GB DDR4",
          "Gráficos": "Intel Graphics integrados",
          "Almacenamiento": "256 GB M.2 NVMe PCIe SSD",
          "Pantalla": "14\" Full HD Anti-glare",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "3 celdas, 42 Wh",
          "Peso": "1.4 kg"
      }
  },
  {
      name: "ASUS VIVOBOOK X1404ZA-I38128 INTEL CORE I3 8/128GB",
      specs: {
          "Marca": "Asus",
          "Modelo": "Vivobook 14 X1404ZA",
          "Procesador": "Intel Core i3-1215U",
          "Memoria": "8 GB DDR4",
          "Gráficos": "Intel UHD Graphics",
          "Almacenamiento": "128 GB SSD M.2 PCIe",
          "Pantalla": "14\" Full HD Anti-glare",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "3 celdas, 42 Wh",
          "Peso": "1.4 kg"
      }
  },
  {
      name: "ASUS ZENBOOK 14 UX3405CA-U7512 ULTRA 7 16/512SSD",
      specs: {
          "Marca": "ASUS",
          "Modelo": "Zenbook 14 UX3405CA",
          "Procesador": "Intel Core Ultra 7 255H",
          "Memoria": "16GB LPDDR5X",
          "Gráficos": "Integrated Intel Arc Graphics",
          "Almacenamiento": "512GB PCIe Gen4 NVMe SSD",
          "Pantalla": "14\" OLED, WUXGA Táctil 60Hz",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "75WHrs, 4 celdas",
          "Peso": "1.28 kg"
      }
  },
  {
      name: "DELL I5441-SX8685 SNAPDRAGON X PLUS 16/1TB SSD",
      specs: {
          "Marca": "Dell",
          "Modelo": "Inspiron 14 5441",
          "Procesador": "Qualcomm Snapdragon X Plus X1P-42-100",
          "Memoria": "16GB LPDDR5X",
          "Gráficos": "Qualcomm Adreno GPU",
          "Almacenamiento": "1TB M.2 PCIe NVMe SSD",
          "Pantalla": "14\" FHD+ 300 nits Anti-glare",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "54Wh, 3 celdas",
          "Peso": "1.53 kg"
      }
  },
  {
      name: "DELL LDC15255-7322 15.6\" AMD RYZEN 7 7730U 16/1TB",
      specs: {
          "Marca": "Dell",
          "Modelo": "Inspiron 15 DC15255",
          "Procesador": "AMD Ryzen 7 7730U",
          "Memoria": "16GB DDR4",
          "Gráficos": "AMD Radeon Graphics",
          "Almacenamiento": "1TB SSD NVMe",
          "Pantalla": "15.6\" IPS FHD 120Hz",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "41Wh, 3 celdas",
          "Peso": "1.68 kg"
      }
  },
  {
    name: /HP 14-CF2111WM/i,
    specs: {
      "Marca": "HP",
      "Modelo": "Stream 14-cf2111wm",
      "Procesador": "Intel Celeron N4120",
      "Memoria": "4GB DDR4",
      "Almacenamiento": "64GB eMMC",
      "Pantalla": "14\" HD micro-edge",
      "Sist. Operativo": "Windows 11 Home (Modo S)",
      "Peso": "1.46 kg"
    }
  },
  {
    name: /HP 14-DQ6011DX/i,
    specs: {
      "Marca": "HP",
      "Modelo": "Laptop 14-dq6011dx",
      "Procesador": "Intel Processor N150",
      "Memoria": "4GB DDR4-3200",
      "Almacenamiento": "128GB UFS",
      "Pantalla": "14\" HD",
      "Sist. Operativo": "Windows 11 Home (Modo S)",
      "Peso": "1.46 kg"
    }
  },
  {
    name: /HP 14-DQ6015DX/i,
    specs: {
      "Marca": "HP",
      "Modelo": "Laptop 14-dq6015dx",
      "Procesador": "Intel Processor N150",
      "Memoria": "4GB DDR4-3200",
      "Almacenamiento": "128GB UFS",
      "Pantalla": "14\" HD",
      "Sist. Operativo": "Windows 11 Home (Modo S)",
      "Peso": "1.46 kg"
    }
  },
  {
      name: "HP 15-FA2093DX INTEL CORE I7-13620H 16/1TB SSD",
      specs: {
          "Marca": "HP",
          "Modelo": "Victus 15-fa2093dx",
          "Procesador": "Intel Core i7-13620H",
          "Memoria": "16GB DDR5",
          "Gráficos": "NVIDIA GeForce RTX 5060 (8GB)",
          "Almacenamiento": "1TB PCIe NVMe SSD",
          "Pantalla": "15.6\" IPS FHD 144Hz",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "70Wh, 4 celdas",
          "Peso": "2.29 kg"
      }
  },
  {
      name: "HP 15-FD0131WM INTEL CORE I3 8GB DDR4 256GB SSD",
      specs: {
          "Marca": "HP",
          "Modelo": "Laptop 15-fd0131wm",
          "Procesador": "Intel Core i3-N305",
          "Memoria": "8GB DDR4",
          "Gráficos": "Intel UHD Graphics",
          "Almacenamiento": "256GB SSD NVMe",
          "Pantalla": "15.6\" IPS FHD",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "41Wh, 3 celdas",
          "Peso": "1.59 kg"
      }
  },
  {
      name: "HP 15-FD0182WM 15.6\" INTEL CORE I7 16/512GB SSD",
      specs: {
          "Marca": "HP",
          "Modelo": "Laptop 15-fd0182wm",
          "Procesador": "Intel Core i7-1355U",
          "Memoria": "16GB DDR4",
          "Gráficos": "Intel Iris Xe Graphics",
          "Almacenamiento": "512GB SSD NVMe",
          "Pantalla": "15.6\" IPS FHD",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "41Wh, 3 celdas",
          "Peso": "1.59 kg"
      }
  },
  {
      name: "HP 15T-FD000 CORE I7-1355U 12/256GB SSD FHD BLACK",
      specs: {
          "Marca": "HP",
          "Modelo": "Laptop 15t-fd000",
          "Procesador": "Intel Core i7-1355U",
          "Memoria": "12GB DDR4",
          "Gráficos": "Intel Iris Xe Graphics",
          "Almacenamiento": "256GB SSD NVMe",
          "Pantalla": "15.6\" IPS FHD",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "41Wh, 3 celdas",
          "Peso": "1.59 kg"
      }
  },
  {
      name: "HP 16-AG0070WM AMD RYZEN 7 8/512GB SSD SILVER",
      specs: {
          "Marca": "HP",
          "Modelo": "Pavilion 16-ag0070wm",
          "Procesador": "AMD Ryzen 7 8840U",
          "Memoria": "8GB LPDDR5-6400 MHz",
          "Gráficos": "AMD Radeon Graphics",
          "Almacenamiento": "512GB PCIe Gen4 NVMe SSD",
          "Pantalla": "16\" WUXGA IPS 300 nits",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "3 celdas, 59 Wh",
          "Peso": "1.799 kg"
      }
  },
  {
      name: "HP OMNIBOOK 5 16-AF1017WM ULTRA 7 TOUCH 16/1TB SSD",
      specs: {
          "Marca": "HP",
          "Modelo": "OmniBook 5 16-af1017wm",
          "Procesador": "Intel Core Ultra 7 155U",
          "Memoria": "16GB LPDDR5x",
          "Gráficos": "Intel Graphics",
          "Almacenamiento": "1TB PCIe Gen4 NVMe SSD",
          "Pantalla": "16\" WUXGA IPS táctil 300 nits",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "3 celdas, 59 Wh",
          "Peso": "1.77 kg"
      }
  },
  {
      name: "HP OMNIBOOK X FLIP 14-FM0023DX TOUCH ULTRA 7 16/512GB",
      specs: {
          "Marca": "HP",
          "Modelo": "OmniBook X Flip 14-fm0023dx",
          "Procesador": "Intel Core Ultra 7 256V",
          "Memoria": "16GB LPDDR5x",
          "Gráficos": "Intel Arc Graphics 140V",
          "Almacenamiento": "512GB PCIe Gen4 NVMe SSD",
          "Pantalla": "14\" 2.8K OLED multitáctil 120Hz",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "3 celdas, 59 Wh",
          "Peso": "1.34 kg"
      }
  },
  {
      name: "LENOVO IDEAPAD 1 82VG00WXUS AMD RYZEN 5 8/256GB",
      specs: {
          "Marca": "Lenovo",
          "Modelo": "IdeaPad 1 15AMN7",
          "Procesador": "AMD Ryzen 5 7520U",
          "Memoria": "8GB LPDDR5-5500",
          "Gráficos": "Integrated AMD Radeon 610M",
          "Almacenamiento": "256GB SSD M.2 PCIe NVMe",
          "Pantalla": "15.6\" FHD Anti-glare",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "42Wh",
          "Peso": "1.58 kg"
      }
  },
  {
      name: "LENOVO IDEAPAD SLIM 3 82XB00HVUS INTEL N100 4/128GB",
      specs: {
          "Marca": "Lenovo",
          "Modelo": "IdeaPad Slim 3 15IAN8",
          "Procesador": "Intel N100",
          "Memoria": "4GB LPDDR5-4800",
          "Gráficos": "Integrated Intel UHD Graphics",
          "Almacenamiento": "128GB UFS 3.1",
          "Pantalla": "15.6\" FHD Anti-glare",
          "Sist. Operativo": "Windows 11 Home (S mode)",
          "Bateria": "47Wh",
          "Peso": "1.55 kg"
      }
  },
  {
      name: "LENOVO IDEAPAD SLIM 5 83FW0001US I7-150U 16/1TB",
      specs: {
          "Marca": "Lenovo",
          "Modelo": "IdeaPad Slim 5 16IRU9",
          "Procesador": "Intel Core i7-150U",
          "Memoria": "16GB LPDDR5x-5200",
          "Gráficos": "Integrated Intel Graphics",
          "Almacenamiento": "1TB SSD M.2 PCIe NVMe",
          "Pantalla": "16\" WUXGA IPS 300nits Anti-glare",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "57Wh",
          "Peso": "1.89 kg"
      }
  },
  {
      name: "LENOVO YOGA 7 83DL0002US 16\" ULTRA7 155U 16/1TB",
      specs: {
          "Marca": "Lenovo",
          "Modelo": "Yoga 7 2-in-1 16IML9",
          "Procesador": "Intel Core Ultra 7 155U",
          "Memoria": "16GB LPDDR5x-7467",
          "Gráficos": "Integrated Intel Graphics",
          "Almacenamiento": "1TB SSD M.2 PCIe NVMe",
          "Pantalla": "16\" WUXGA IPS táctil Dolby Vision",
          "Sist. Operativo": "Windows 11 Home",
          "Bateria": "71Wh",
          "Peso": "2.1 kg"
      }
  },
  {
      name: "TOSH DYNABOOK A40-G 128G BLACK",
      specs: {
          "Marca": "Dynabook (Toshiba)",
          "Modelo": "Tecra A40-G1400ED",
          "Procesador": "Intel Celeron 5205U",
          "Memoria": "4GB DDR4",
          "Gráficos": "Intel UHD Graphics",
          "Almacenamiento": "128GB SSD",
          "Pantalla": "14\" HD Anti-glare",
          "Sist. Operativo": "Windows 10 Pro / 11 Pro",
          "Bateria": "42 Wh",
          "Peso": "1.47 kg"
      }
  }
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    
    let count = 0;
    for (const data of productsData) {
      const query = typeof data.name === 'string' ? { name: data.name } : { name: data.name };
      
      const specifications = Object.entries(data.specs).map(([label, value]) => ({ label, value }));
      
      const result = await Product.updateMany(query, { $set: { specifications } });
      if (result.modifiedCount > 0) {
        console.log(`Updated specs for: ${data.name}`);
        count += result.modifiedCount;
      }
    }

    console.log(`Done. Updated ${count} notebook products.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

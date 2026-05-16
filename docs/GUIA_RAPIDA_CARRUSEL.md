# Guía Rápida - Actualizar ProductCarousel

## Agregar un nuevo producto a los datos mock

Edita `lib/api/mockProducts.ts`:

```typescript
const newProduct = {
    id: '13',
    name: 'Nuevo Producto',
    brand: 'Marca',
    sku: '99999',
    price: 299999,
    discountPercentage: 15,
    description: 'Descripción del producto',
    imageUrls: ['/images/producto.webp'],
    category: 'Categoría',
    discountBase: true, // Si tiene descuento base
};

// Agregar a bombas o nuevas
mockProductsData.bombas.push(newProduct);
```

## Cambiar precios o descuentos

Los precios están en `mockProductsData`. Edita los valores directamente:

```typescript
// Cambiar precio de auriculares
mockProductsData.bombas[0].price = 350000;
mockProductsData.bombas[0].discountPercentage = 20;
```

## Cambiar imágenes

Las imágenes deben estar en `public/images/` y referenciarse en `imageUrls`:

```typescript
imageUrls: ['/images/nueva-imagen.webp']
```

## Agregar una nueva sección

1. Agregar nueva propiedad en `mockProductsData`:
```typescript
export const mockProductsData = {
    bombas: [...],
    nuevas: [...],
    ofertasEspeciales: [...] // NUEVA SECCIÓN
};
```

2. Actualizar `productService.ts`:
```typescript
export const getProductsBySection = async (section: 'bombas' | 'nuevas' | 'ofertasEspeciales'): Promise<Product[]> => {
    await delay(300);
    return mockProductsData[section];
};
```

3. Usar en `ProductCarousel.tsx`:
```typescript
<ProductCarouselSection
    title="OFERTAS ESPECIALES"
    section="ofertasEspeciales"
    progressColor="#FF6B35"
/>
```

## Filtrar productos por categoría

Ejemplo: Obtener solo productos de Audio

```typescript
import { getProductByCategory } from '@/lib/api/productService';

const audioProducts = await getProductByCategory('Audio');
```

Categorías disponibles:
- Audio
- Electrónica
- Celulares
- Computadoras
- Paquetes

## Conectar a API real después

1. Reemplazar `mockProducts.ts` con llamadas a tu API:

```typescript
// En productService.ts
export const getProductsBySection = async (section: 'bombas' | 'nuevas'): Promise<Product[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/section/${section}`);
    return response.json();
};
```

2. El componente no cambia - seguirá funcionando igual ✅

## Troubleshooting

**Q: Las imágenes no se muestran**
A: Verifica que estén en `public/images/` y que el path sea correcto en `imageUrls`

**Q: El carrusel no carga**
A: Revisa la consola (F12) para errores. Asegúrate que `getProductsBySection` retorna los datos correctamente

**Q: Los precios no se formatean bien**
A: Verifica que `price` es un número, no un string: `price: 344279` ✅ vs `price: '344279'` ❌

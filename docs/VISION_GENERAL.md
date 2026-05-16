# Visión General - Módulos Dinámicos

## Resumen

Se ha modernizado la arquitectura del proyecto migrando dos componentes principales (ProductCarousel y Categories) a un modelo dinámico basado en servicios con datos mock.

## Módulos Dinámicos

### 1. ProductCarousel
- **Componente**: [app/components/Products/ProductCarousel.tsx](../app/components/Products/ProductCarousel.tsx)
- **Servicio**: [lib/api/productService.ts](../lib/api/productService.ts)
- **Datos**: [lib/api/mockProducts.ts](../lib/api/mockProducts.ts)
- **Docs**: [ARQUITECTURA_CARRUSEL.md](ARQUITECTURA_CARRUSEL.md) | [GUIA_RAPIDA_CARRUSEL.md](GUIA_RAPIDA_CARRUSEL.md)

Propiedades dinámicas:
- Secciones "Bombas" y "Nuevas Llegadas"
- Precios y descuentos
- Imágenes y descripciones
- Links dinámicos a detalles

### 2. Categories
- **Componente**: [app/components/Categories/Categories.tsx](../app/components/Categories/Categories.tsx)
- **Servicio**: [lib/api/categoriesService.ts](../lib/api/categoriesService.ts)
- **Datos**: [lib/api/mockCategories.ts](../lib/api/mockCategories.ts)
- **Docs**: [ARQUITECTURA_CATEGORIES.md](ARQUITECTURA_CATEGORIES.md) | [GUIA_RAPIDA_CATEGORIES.md](GUIA_RAPIDA_CATEGORIES.md)

Propiedades dinámicas:
- Categoría principal + secundarias
- Imágenes HD
- Slugs para navegación
- Búsqueda por nombre

## Arquitectura Uniforme

Todos los módulos siguen el patrón:

```
Componente
    └─> useEffect
        └─> Service
            └─> mockData
                (o fetch real en producción)
```

## Estructura de Carpetas

```
lib/
├── api/
│   ├── ApiClient.ts           # Cliente HTTP singleton
│   ├── productService.ts      # Funciones de productos
│   ├── mockProducts.ts        # Datos fake productos
│   ├── categoriesService.ts   # Funciones de categorías
│   └── mockCategories.ts      # Datos fake categorías
└── utils/
    └── imageHelper.ts         # Normalización de URLs

app/components/
├── Products/
│   └── ProductCarousel.tsx    # Dinámico
└── Categories/
    └── Categories.tsx         # Dinámico

docs/
├── ARQUITECTURA_CARRUSEL.md
├── GUIA_RAPIDA_CARRUSEL.md
├── ARQUITECTURA_CATEGORIES.md
├── GUIA_RAPIDA_CATEGORIES.md
└── VISIÓN_GENERAL.md          # Este archivo
```

## Próximas Migraciones

Componentes candidatos para migración:

- [ ] Header (navegación dinámica)
- [ ] Footer (links dinámicos)
- [ ] BenefitsSection (beneficios dinámicos)
- [ ] LogosMarquee (marcas dinámicas)
- [ ] Hero Section (banners dinámicos)

## Transición a Base de Datos Real

### Paso 1: Mantener Mock por ahora
```
Los archivos mock permanecen como fallback
```

### Paso 2: Actualizar Services
```typescript
// En productService.ts y categoriesService.ts
// Reemplazar: await delay(300);
// Por: const response = await fetch(API_URL)
```

### Paso 3: Componentes sin cambios
```typescript
// Los componentes usan los mismos servicios
// No requires cambios en ProductCarousel.tsx o Categories.tsx
```

### Paso 4: Opcional - Variables de entorno
```
.env.local
NEXT_PUBLIC_API_URL=https://tu-api.com
```

## Ventajas Alcanzadas

✅ **Separación de responsabilidades** - Datos separados del UI
✅ **Reutilización** - Services usables en múltiples componentes
✅ **Testabilidad** - Fácil mockear servicios para tests
✅ **Mantenibilidad** - Cambios de datos sin tocar componentes
✅ **Escalabilidad** - Arquitectura soporta crecimiento
✅ **Performance** - Carga paralela de datos
✅ **Production-Ready** - Delays simulados incluidos

## Funciones de Service Disponibles

### productService.ts
| Función | Descripción |
|---------|------------|
| `getProductsBySection()` | Por sección (bombas, nuevas) |
| `getAllPromotionProducts()` | Solo con descuento |
| `getProductByCategory()` | Filtrado por categoría |
| `getAllProducts()` | Con filtros avanzados |
| `getProductById()` | Producto específico |
| `searchProducts()` | Búsqueda de texto |

### categoriesService.ts
| Función | Descripción |
|---------|------------|
| `getAllCategories()` | Todas las categorías |
| `getMainCategory()` | Categoría principal |
| `getSecondaryCategories()` | Las demás categorías |
| `getCategoryById()` | Por ID |
| `getCategoryBySlug()` | Para URLs |
| `searchCategories()` | Búsqueda de texto |

## Integración con Componentes

Ejemplo de uso en cualquier componente nuevo:

```typescript
'use client';
import { useEffect, useState } from 'react';
import { getProductsBySection } from '@/lib/api/productService';

export default function MyComponent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsBySection('bombas')
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando...</div>;
  return <div>{products.map(...)}</div>;
}
```

## Performance

- ⚡ Carga paralela de datos (Promise.all)
- ⚡ Delays simulados de 300ms (simula latencia real)
- ⚡ Composición eficiente de datos
- ⚡ Sin waterfall de requests

## Seguridad

- ✅ Types TypeScript completos
- ✅ Validación de datos en el service
- ✅ Manejo centralizado de errores
- ✅ Tokens de auth soportados (ver ApiClient)

## Roadmap Futuro

1. **Fase 1**: Conectar a API real
2. **Fase 2**: Agregar caché de datos
3. **Fase 3**: Testing (unit + integration)
4. **Fase 4**: Infinite scroll / pagination
5. **Fase 5**: Real-time updates con WebSocket

## Support

Para preguntas sobre la arquitectura:
- Lee [ARQUITECTURA_CARRUSEL.md](ARQUITECTURA_CARRUSEL.md)
- Lee [ARQUITECTURA_CATEGORIES.md](ARQUITECTURA_CATEGORIES.md)
- Lee [GUIA_RAPIDA_CARRUSEL.md](GUIA_RAPIDA_CARRUSEL.md)
- Lee [GUIA_RAPIDA_CATEGORIES.md](GUIA_RAPIDA_CATEGORIES.md)

## Checklist de Migración

- ✅ ProductCarousel migrado
- ✅ Categories migrado
- ✅ Services creados y funcionales
- ✅ Mock data creada
- ✅ Documentación completa
- ✅ Build exitoso sin errores
- ✅ TypeScript strict mode
- ⏳ Página de categoría `/category/[slug]` (próxima)
- ⏳ Página de producto `/product/[id]` (próxima)
- ⏳ Conectar a API real (cuando esté lista)

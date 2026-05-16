# Arquitectura Categories - Sistema Dinámico

## Descripción General

El módulo Categories ha sido migrado de categorías estáticas a una arquitectura dinámica basada en servicios y datos mock. Mantiene la misma estructura visual pero permite fácil integración con bases de datos reales.

## Estructura de Carpetas

```
jbimports/
├── lib/
│   ├── api/
│   │   ├── mockCategories.ts      # Datos fake para desarrollo
│   │   └── categoriesService.ts   # Servicio de categorías
│   └── utils/
│       └── imageHelper.ts         # Utilidades para URLs de imágenes
└── app/
    └── components/
        └── Categories/
            └── Categories.tsx     # Componente actualizado (dinámico)
```

## Componentes Principales

### 1. **mockCategories.ts** (`lib/api/mockCategories.ts`)
Datos fake estructurados en un array único `mockCategoriesData.categories`

Cada categoría tiene:
```typescript
{
  id: string;              // ID único
  name: string;            // Nombre visible
  image: string;           // URL de imagen
  isMain: boolean;         // true para la categoría principal
  slug: string;            // URL-friendly (para navegación)
  description: string;     // Descripción corta
}
```

### 2. **categoriesService.ts** (`lib/api/categoriesService.ts`)
Funciones disponibles:
- `getAllCategories()` - Todas las categorías
- `getMainCategory()` - Solo la principal (retorna null si no existe)
- `getSecondaryCategories()` - Todas excepto la principal
- `getCategoryById(id)` - Categoría específica por ID
- `getCategoryBySlug(slug)` - Categoría por slug (para URLs)
- `searchCategories(query)` - Búsqueda en nombre y descripción

Todas incluyen:
- Delay simulado de 300ms (simula API real)
- Manejo de errores
- Retorna Promises

### 3. **Categories.tsx** (Componente Dinámico)
Cambios principales:
- Carga datos usando `useEffect` al montar
- Usa `Promise.all()` para cargar main y secondary en paralelo
- Maneja estado `loading` mientras carga
- Integra `Link` para navegación a categorías
- Mantiene toda la funcionalidad original (scroll, responsive)

## Flujo de Datos

```
Categories Component
    │
    ├─> useEffect
    │   ├─> Promise.all()
    │   ├─> getMainCategory()
    │   │   └─> mockCategoriesData.categories (find isMain=true)
    │   │
    │   └─> getSecondaryCategories()
    │       └─> mockCategoriesData.categories (filter isMain=false)
    │
    ├─> setMainCategory(result)
    └─> setSecondaryCategories(result)
        │
        └─> Render:
            ├─ Link a /category/{mainCategory.slug}
            └─ Links a /category/{secondaryCategory.slug}
```

## Características

✅ **Carga Dinámica** - Datos obtenidos al montar el componente
✅ **Manejo de Loading** - Indicador mientras carga
✅ **Navegación** - Links a páginas de categoría
✅ **Responsive** - Mantiene comportamiento de scroll en mobile
✅ **Escalable** - Fácil agregar/quitar categorías
✅ **Testeable** - Funciones independientes mockeables

## Transición a Base de Datos Real

Para conectar a una base de datos real:

1. **Actualizar categoriesService.ts:**
```typescript
export const getAllCategories = async (): Promise<Category[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
    const data = await response.json();
    return data.items;
};
```

2. **El componente no requiere cambios** - La interfaz se mantiene igual

## Interfaz Category

```typescript
interface Category {
  id: string;              // Identificador único
  name: string;            // Nombre para mostrar
  image: string;           // URL de la imagen
  isMain: boolean;         // true para categoría destacada
  slug: string;            // Identificador para URLs
  description: string;     // Texto descriptivo corto
}
```

## Métodos de Carga en Paralelo

El componente usa `Promise.all()` para cargar datos en paralelo:

```typescript
const [main, secondary] = await Promise.all([
  getMainCategory(),
  getSecondaryCategories(),
]);
```

Esto es más rápido que hacer las llamadas secuencialmente.

## Rutas Sugeridas para Implementar

Cuando tengas backend, crea estas rutas:

- `GET /api/categories` - Todas las categorías
- `GET /api/categories/main` - Categoría principal
- `GET /api/categories/secondary` - Categorías secundarias
- `GET /api/categories/:id` - Por ID
- `GET /api/categories/slug/:slug` - Por slug
- `GET /api/categories/search?q=query` - Búsqueda

## Próximos Pasos

1. Crear página `/category/[slug]` para mostrar productos de una categoría
2. Integrar búsqueda de categorías en header
3. Agregar más métodos de filtrado (por tipo, popularidad, etc.)
4. Implementar caché de categorías en el cliente
5. Agregar tests unitarios para categoriesService

## Ventajas de esta Arquitectura

- **Separación**: Datos separados de componentes UI
- **Reutilización**: Servicios pueden usarse en múltiples componentes
- **Mantenimiento**: Cambiar datos no afecta lógica de renderizado
- **Escalabilidad**: Fácil pasar de mock a datos reales
- **Performance**: Carga paralela de datos
- **Consistencia**: Mismo patrón que ProductCarousel y otros módulos

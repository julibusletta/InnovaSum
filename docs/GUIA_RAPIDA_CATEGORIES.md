# Guía Rápida - Categories Dinámico

## Estructura

Las categorías ahora se cargan dinámicamente desde un servicio:

```
lib/api/
├── mockCategories.ts       # Datos fake
├── categoriesService.ts    # Funciones de obtención

app/components/Categories/
└── Categories.tsx          # Componente dinámico
```

## Agregar una nueva categoría

Edita `lib/api/mockCategories.ts`:

```typescript
{
  id: 'nueva-categoria',
  name: 'Nueva Categoría',
  image: 'https://ejemplo.com/imagen.jpg',
  isMain: false,           // true solo para la categoría principal
  slug: 'nueva-categoria',
  description: 'Descripción corta',
}
```

## Cambiar la categoría principal

Solo UNA categoría puede tener `isMain: true`:

```typescript
// Antes
{
  id: 'pc-escritorio',
  isMain: true,    // ← era principal
  ...
}

// Después
{
  id: 'pc-escritorio',
  isMain: false,   // ← ya no es principal
  ...
}

// Nueva principal
{
  id: 'notebooks',
  isMain: true,    // ← ahora es principal
  ...
}
```

## Cambiar imágenes de categorías

Las URLs pueden ser:
- De internet directamente: `https://ejemplo.com/imagen.jpg`
- Del servidor público: `/images/categoria.jpg`

```typescript
{
  id: 'monitores',
  image: 'https://nueva-imagen.com/monitor.jpg',
  ...
}
```

## Agregar funcionalidad de búsqueda

El servicio ya tiene `searchCategories()`:

```typescript
import { searchCategories } from '@/lib/api/categoriesService';

const results = await searchCategories('monitor');
// Retorna todas las categorías que contengan "monitor" en el nombre o descripción
```

## Obtener categoría específica

```typescript
import { getCategoryBySlug } from '@/lib/api/categoriesService';

const category = await getCategoryBySlug('pc-escritorio');
```

## Funciones disponibles

| Función | Descripción |
|---------|------------|
| `getAllCategories()` | Todas las categorías |
| `getMainCategory()` | Solo la categoría principal |
| `getSecondaryCategories()` | Todas excepto la principal |
| `getCategoryById(id)` | Por ID |
| `getCategoryBySlug(slug)` | Por slug (para URLs) |
| `searchCategories(query)` | Búsqueda por nombre/descripción |

## Transición a API real

Reemplaza las funciones en `categoriesService.ts` para hace fetch a tu servidor:

```typescript
export const getAllCategories = async (): Promise<Category[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
    return response.json();
};
```

El componente **no cambia** ✅

## Troubleshooting

**Q: Las imágenes no se muestran**
A: Verifica que la URL sea correcta. Las URLs externas (`https://`) funcionan bien.

**Q: El carrusel no carga**
A: Revisa la consola (F12) para errores. Verifica que `getSecondaryCategories()` retorna datos.

**Q: El slug está incorrecto**
A: El slug se usa en URLs como `/category/mi-slug`. Asegúrate que sea único y sin espacios.

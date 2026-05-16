# Arquitectura ProductCarousel - Sistema Dinámico

## Descripción General

El módulo ProductCarousel ha sido migrado a una arquitectura dinámica basada en servicios y datos mock. Esta estructura permite fácil integración con bases de datos reales cuando sea necesario.

## Estructura de Carpetas

```
jbimports/
├── lib/
│   ├── api/
│   │   ├── ApiClient.ts          # Cliente HTTP simulado
│   │   ├── productService.ts     # Servicio de productos
│   │   └── mockProducts.ts       # Datos fake para desarrollo
│   └── utils/
│       └── imageHelper.ts        # Utilidades para URLs de imágenes
└── app/
    └── components/
        └── Products/
            └── ProductCarousel.tsx # Componente actualizado (dinámico)
```

## Componentes Principales

### 1. **ApiClient.ts** (`lib/api/ApiClient.ts`)
Cliente HTTP singleton que simula un cliente axios. 
- En desarrollo, funciona con datos mock
- En producción, puede ser reemplazado para hacer fetch real a un servidor
- Maneja autenticación por token (localStorage)

### 2. **productService.ts** (`lib/api/productService.ts`)
Servicio que contiene todas las funciones para obtener productos:
- `getProductsBySection('bombas' | 'nuevas')` - Obtiene productos por sección
- `getAllPromotionProducts()` - Productos con descuento
- `getProductByCategory()` - Productos filtrados por categoría
- `getAllProducts()` - Con filtros avanzados (precio, stock, ordenamiento)
- `getProductById()` - Obtiene un producto específico

Todas las funciones retornan Promises simulando una API real.

### 3. **mockProducts.ts** (`lib/api/mockProducts.ts`)
Datos fake estructurados en dos arrays:
- `mockProductsData.bombas` - Productos en promoción
- `mockProductsData.nuevas` - Nuevas llegadas

Cada producto tiene:
```typescript
{
  id: string;
  name: string;
  brand: string;
  sku: string;
  price: number;
  discountPercentage: number;
  description: string;
  imageUrls: string[];
  category: string;
  discountBase: boolean;
}
```

### 4. **imageHelper.ts** (`lib/utils/imageHelper.ts`)
Función `getImageUrl()` que normaliza URLs de imágenes:
- Soporta URLs completas
- Soporta rutas relativas al public folder
- Agrega `/` al inicio si es necesario

### 5. **ProductCarousel.tsx** (Componente Dinámico)
Cambios principales:
- Carga datos dinámicamente usando `useEffect`
- Recibe prop `section` en lugar de array `products`
- Maneja estados: `loading` y `setProducts`
- Integra `Link` para navegación a detalle de productos
- Usa `getImageUrl()` para URLs consistentes
- Formatea precios usando `toLocaleString('es-AR')`

## Flujo de Datos

```
ProductCarousel
    │
    ├─> ProductCarouselSection (bombas)
    │   └─> useEffect: getProductsBySection('bombas')
    │       └─> mockProductsData.bombas
    │           └─> Render Slider con productos
    │
    └─> ProductCarouselSection (nuevas)
        └─> useEffect: getProductsBySection('nuevas')
            └─> mockProductsData.nuevas
                └─> Render Slider con productos
```

## Transición a Base de Datos Real

Para conectar a una base de datos real:

1. **Actualizar productService.ts:**
```typescript
export const getProductsBySection = async (section: 'bombas' | 'nuevas'): Promise<Product[]> => {
    const response = await apiClient.get(`/products/section/${section}`);
    return response.data.items;
};
```

2. **Implementar ApiClient.ts real:**
```typescript
async get(endpoint: string, options?: any) {
    const response = await fetch(`${this.baseURL}/api${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.json();
}
```

3. **El componente ProductCarousel NO requiere cambios** - La interfaz se mantiene igual

## Ventajas de esta Arquitectura

✅ **Separación de responsabilidades** - lógica de datos separada del componente
✅ **Reutilizable** - Funciones de service pueden usarse en otros componentes
✅ **Testeable** - Fácil de mockear para tests unitarios
✅ **Escalable** - Fácil transición de mock a datos reales
✅ **Consistencia** - Misma estructura que ProductListByCategory

## Ejemplo de Uso en Otros Componentes

```typescript
import { getProductByCategory } from '@/lib/api/productService';

// En un componente
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
    getProductByCategory('Audio')
        .then(data => setProducts(data))
        .catch(err => console.error(err));
}, []);
```

## Próximos Pasos

1. Reemplazar datos mock con API real
2. Implementar caché en el cliente para optimizar renders
3. Agregar manejo de errores más robusto
4. Implementar paginación en servicios
5. Agregar tests unitarios para productService


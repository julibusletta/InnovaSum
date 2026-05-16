/** 
 * Interfaz para el producto (debe coincidir con el modelo de MongoDB)
 */
export interface Product {
    _id?: string;
    id: string;
    name: string;
    brand?: string;
    sku?: string;
    price: number;
    costPrice?: number;
    originalPrice?: number;
    discountPercentage?: number;
    discount?: number;
    description: string;
    imageUrls?: string[];
    images?: string[];
    image: string; // Required for detail page
    category: string;
    discountBase?: boolean;
    badge?: string;
    stock: number; // Required for detail page
    published?: boolean;
    specifications?: { label: string, value: string }[];
    properties?: {
        weight?: string;
        dimensions?: string;
        color?: string;
    };
    seo?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
}

const getBaseUrl = () => {
    if (typeof window !== 'undefined') return ''; // Browser uses relative path
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; 
    return `http://localhost:${process.env.PORT || 3000}`; 
};

/**
 * Obtiene todos los productos en oferta o destacados
 */
export const getAllPromotionProducts = async (): Promise<Product[]> => {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products?category=ofertas`);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error in getAllPromotionProducts:', error);
        return [];
    }
};

/**
 * Obtiene productos por sección (Bombas o Nuevas)
 */
export const getProductsBySection = async (section: 'bombas' | 'nuevas'): Promise<Product[]> => {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products`);
        if (!res.ok) return [];
        const all: any[] = await res.json();
        
        if (section === 'bombas') {
            return all.filter(p => 
                p.badge?.toLowerCase().includes('bomba') || 
                p.price > 1000000
            ).slice(0, 10);
        }
        // Ordenar por fecha de creación (si está disponible) o simplemente los últimos 10
        return all.slice().reverse().slice(0, 10); 
    } catch (error) {
        console.error(`Error fetching products by section: ${section}:`, error);
        return [];
    }
};

/**
 * Obtiene productos por categoría y búsqueda
 */
export const getProductsByCategory = async (
    category: string,
    search: string = '',
    page: number = 1,
    pageSize: number = 200
): Promise<Product[]> => {
    try {
        const queryParams = new URLSearchParams();
        if (category) queryParams.append('category', category);
        if (search) queryParams.append('search', search);

        const res = await fetch(`${getBaseUrl()}/api/products?${queryParams.toString()}`);
        if (!res.ok) return [];
        
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error in getProductsByCategory:', error);
        return [];
    }
};

/**
 * Obtiene todos los productos con filtros y paginación
 */
export const getAllProducts = async (
    search: string = '',
    page: number = 1,
    pageSize: number = 10,
    minPrice?: number,
    maxPrice?: number,
    minStock?: number,
    sortField?: string,
    sortDirection?: string
): Promise<{ items: Product[]; totalCount: number }> => {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products`);
        if (!res.ok) return { items: [], totalCount: 0 };
        
        let products: Product[] = await res.json();

        // Aplicar filtros locales
        if (search) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (minPrice !== undefined) products = products.filter(p => p.price >= minPrice);
        if (maxPrice !== undefined) products = products.filter(p => p.price <= maxPrice);

        // Aplicar ordenamiento
        if (sortField) {
            products.sort((a, b) => {
                const aVal = (a as any)[sortField];
                const bVal = (b as any)[sortField];
                return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
            });
        }

        const start = (page - 1) * pageSize;
        const items = products.slice(start, start + pageSize);

        return {
            items: items,
            totalCount: products.length,
        };
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        return { items: [], totalCount: 0 };
    }
};

/**
 * Obtiene un producto por su ID
 */
export const getProductById = async (id: string | number): Promise<Product | null> => {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products/${id}`, {
            next: { revalidate: 60 }
        });
        
        if (!res.ok) {
            console.log(`Product ${id} not found via API`);
            return null;
        }
        
        return await res.json();
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
};

export const getPublicProductById = async (id: string | number): Promise<Product | null> => {
    return getProductById(id);
};

export const getAllPublic = async (
    search: string = '',
    page: number = 1,
    pageSize: number = 10,
    minPrice?: number,
    maxPrice?: number,
    minStock?: number,
    sortField?: string,
    sortDirection?: string
): Promise<{ items: Product[]; totalCount: number }> => {
    return getAllProducts(search, page, pageSize, minPrice, maxPrice, minStock, sortField, sortDirection);
};

export const getAllPublicServices = async (): Promise<{ items: Product[]; totalCount: number }> => {
    try {
        const res = await fetch(`${getBaseUrl()}/api/products`);
        if (!res.ok) return { items: [], totalCount: 0 };
        const items = await res.json();
        return { items, totalCount: items.length };
    } catch (error) {
        return { items: [], totalCount: 0 };
    }
};

// Funciones de escritura (requieren implementación en el backend)
export const createProduct = async (productData: any) => {
    const res = await fetch(`${getBaseUrl()}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    return res.json();
};

export const updateProduct = async (id: string | number, productData: any) => {
    const res = await fetch(`${getBaseUrl()}/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });
    return res.json();
};

export const deleteProduct = async (id: string | number) => {
    const res = await fetch(`${getBaseUrl()}/api/admin/products/${id}`, {
        method: 'DELETE'
    });
    return res.ok;
};

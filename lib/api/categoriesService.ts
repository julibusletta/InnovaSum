// Interfaz para la categoría (mantenida para tipos)
export interface Category {
  id: string;
  name: string;
  image: string;
  isMain: boolean;
  slug: string;
  description: string;
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser uses relative path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel environment
  return `http://localhost:${process.env.PORT || 3000}`; // Local environment
};

/**
 * Obtiene todas las categorías
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/categories`, {
        next: { revalidate: 60 } // Next.js cache
    });
    if (!res.ok) {
      console.error('Failed to fetch categories. Status:', res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in getAllCategories fetch:', error);
    return [];
  }
};

/**
 * Obtiene la categoría principal
 */
export const getMainCategory = async (): Promise<Category | null> => {
  const categories = await getAllCategories();
  return categories.find(c => c.isMain) || null;
};

/**
 * Obtiene las categorías secundarias
 */
export const getSecondaryCategories = async (): Promise<Category[]> => {
  const categories = await getAllCategories();
  return categories.filter(c => !c.isMain);
};

/**
 * Obtiene una categoría por ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const categories = await getAllCategories();
  return categories.find(c => c.id === id) || null;
};

/**
 * Obtiene una categoría por slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const categories = await getAllCategories();
  return categories.find(c => c.slug === slug) || null;
};

/**
 * Busca categorías por nombre
 */
export const searchCategories = async (query: string): Promise<Category[]> => {
  const categories = await getAllCategories();
  const lowerQuery = query.toLowerCase();
  return categories.filter(cat =>
    cat.name.toLowerCase().includes(lowerQuery) ||
    cat.description.toLowerCase().includes(lowerQuery)
  );
};

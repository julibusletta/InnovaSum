import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const products = await db.getProducts();
    const categories = await db.getCategories();
    
    const BASE_URL = 'https://www.innovasum.com.ar';

    const productUrls = products.map((product) => ({
      url: `${BASE_URL}/product/${product.id}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const categoryUrls = categories.map((category) => ({
      url: `${BASE_URL}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      ...categoryUrls,
      ...productUrls,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return base sitemap on error
    return [
      {
        url: 'https://www.innovasum.com.ar',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      }
    ];
  }
}

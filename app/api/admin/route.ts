import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * API Route for Admin operations (Save changes, Import Excel)
 */

const PRODUCTS_PATH = path.join(process.cwd(), 'data', 'products.json');
const SPECS_PATH = path.join(process.cwd(), 'data', 'specifications.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (action === 'save_products') {
      // Save to MongoDB
      const productsArray = Object.values(data).flat();
      await db.saveProducts(productsArray);

      // Backup to JSON (Will fail silently on Vercel due to read-only FS, but DB saves it)
      try {
        await fs.writeFile(PRODUCTS_PATH, JSON.stringify(data, null, 2), 'utf8');
      } catch (e) {
        console.warn('Could not save to products.json (read-only FS):', e);
      }
      
      return NextResponse.json({ success: true, message: 'Productos guardados correctamente en DB' });
    }

    if (action === 'save_specs') {
      try {
        await fs.writeFile(SPECS_PATH, JSON.stringify(data, null, 2), 'utf8');
      } catch (e) {
        console.warn('Could not save to specs (read-only FS):', e);
      }
      return NextResponse.json({ success: true, message: 'Especificaciones guardadas correctamente' });
    }

    if (action === 'import_excel') {
      const { products, specifications } = data;
      
      if (products) {
        // Save to MongoDB
        await db.saveProducts(products);
        
        // Convert array back to categoried object for JSON backup if possible
        try {
          await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf8');
        } catch (e) {
          console.warn('Could not save to products.json (read-only FS):', e);
        }
      }
      
      if (specifications) {
         try {
           await fs.writeFile(SPECS_PATH, JSON.stringify(specifications, null, 2), 'utf8');
         } catch (e) {
           console.warn('Could not save to specifications.json (read-only FS):', e);
         }
      }

      return NextResponse.json({ success: true, message: 'Importación completada en MongoDB' });
    }

    if (action === 'delete_product') {
      const { productId } = data;
      if (!productId) {
        return NextResponse.json({ success: false, message: 'ID de producto no proporcionado' }, { status: 400 });
      }
      await db.deleteProduct(productId);
      return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' });
    }

    if (action === 'bulk_delete') {
      const { productIds } = data;
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return NextResponse.json({ success: false, message: 'IDs de productos no proporcionados' }, { status: 400 });
      }
      await db.deleteProducts(productIds);
      return NextResponse.json({ success: true, message: `${productIds.length} productos eliminados correctamente` });
    }
    
    if (action === 'save_category') {
      const { category } = data;
      if (!category || (!category.id && !category.slug)) {
        return NextResponse.json({ success: false, message: 'Datos de categoría incompletos' }, { status: 400 });
      }
      
      // Save category
      await db.saveCategory(category);
      
      // Revalidate cache to show changes in the frontend immediately
      try {
        revalidatePath('/', 'layout');
        revalidatePath(`/category/${category.slug}`, 'page');
        // In Next.js 16, revalidateTag requires a profile as second argument
        revalidateTag('products', 'default');
      } catch (e) {
        console.warn('Revalidation failed:', e);
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Categoría guardada correctamente.' 
      });
    }

    if (action === 'delete_category') {
      const { categoryIdOrSlug } = data;
      if (!categoryIdOrSlug) {
        return NextResponse.json({ success: false, message: 'ID/Slug de categoría no proporcionado' }, { status: 400 });
      }

      await db.deleteCategory(categoryIdOrSlug);

      try {
        revalidatePath('/', 'layout');
        revalidatePath('/admin/categories');
        revalidateTag('products', 'default');
      } catch (e) {
        console.warn('Revalidation failed:', e);
      }

      return NextResponse.json({ success: true, message: 'Categoría eliminada correctamente' });
    }

    return NextResponse.json({ success: false, message: 'Acción no válida' }, { status: 400 });

  } catch (error: any) {
    console.error('Error in Admin API:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Try to get from MongoDB first
    const mongoProducts = await db.getProducts();
    
    // Group products by category for the frontend
    const productsByCategory: Record<string, any[]> = {};
    mongoProducts.forEach(p => {
      if (!productsByCategory[p.category]) {
        productsByCategory[p.category] = [];
      }
      productsByCategory[p.category].push(p);
    });

    let specsData = '[]';
    try {
      specsData = await fs.readFile(SPECS_PATH, 'utf8');
    } catch (e) {
      console.warn('Specs file not found, using empty array');
    }
    
    const mongoCategories = await db.getCategories();
    
    // Add product counts to each category
    const categoriesWithCounts = mongoCategories.map(cat => ({
      ...cat,
      productCount: productsByCategory[cat.slug]?.length || 0
    }));

    const recentVisits = await db.getRecentVisits(7);

    return NextResponse.json({
      products: mongoProducts.length > 0 ? productsByCategory : {},
      categories: categoriesWithCounts,
      specifications: JSON.parse(specsData),
      visits: recentVisits
    });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import specsData from '@/data/specifications.json';

export interface Spec {
  label: string;
  value: string;
}

const productSpecifications: Record<string, Spec[]> = specsData as unknown as Record<string, Spec[]>;

/**
 * Retorna las especificaciones de un producto por ID.
 */
export function getSpecsByProductId(productId: string): Spec[] {
  return productSpecifications[productId] ?? [];
}

/**
 * Retorna todas las especificaciones mapeadas por ID de producto.
 */
export function getAllSpecs(): Record<string, Spec[]> {
  return productSpecifications;
}

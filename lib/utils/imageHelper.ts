/**
 * Utilidad para generar URLs de imágenes
 * En producción, esto puede incluir lógica para servir imágenes desde un CDN
 */

export const getImageUrl = (imagePath: string): string => {
    // Si ya es una URL completa, retornarla tal cual
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // Si comienza con /, es una ruta relativa al public
    if (imagePath.startsWith('/')) {
        return imagePath;
    }

    // De lo contrario, prepender /
    return `/${imagePath}`;
};

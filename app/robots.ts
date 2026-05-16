import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Protege el panel de administración
    },
    sitemap: 'https://www.innovasum.com.ar/sitemap.xml',
  };
}

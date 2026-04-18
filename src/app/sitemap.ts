import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://yataraceylon.me';

    // Static routes
    const staticRoutes = [
        '',
        '/about',
        '/about/team',
        '/about/sustainability',
        '/contact',
        '/faq',
        '/services',
        '/privacy',
        '/terms',
        '/return-policy',
        '/login',
        '/signup',
        '/packages',
        '/packages/the-collection',
        '/packages/cultural',
        '/packages/wildlife',
        '/packages/experiences',
        '/build-tour',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes (Packages) - gracefully handle missing MONGODB_URI
    let dynamicRoutes: MetadataRoute.Sitemap = [];

    if (process.env.MONGODB_URI) {
        try {
            await connectDB();
            const packages = await Package.find({ status: 'ACTIVE' }, 'slug updatedAt');

            dynamicRoutes = packages.map((pkg) => ({
                url: `${baseUrl}/packages/${pkg.slug}`,
                lastModified: pkg.updatedAt?.toISOString() || new Date().toISOString(),
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            }));
        } catch (error) {
            console.error('Error generating sitemap for packages:', error);
        }
    } else {
        console.warn('MONGODB_URI not set — sitemap will only include static routes');
    }

    return [...staticRoutes, ...dynamicRoutes];
}

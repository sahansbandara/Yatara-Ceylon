import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import FeaturedJourneysClient from './FeaturedJourneysClient';

async function getFeaturedJourneys() {
    const timeout = new Promise<any[]>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    try {
        console.log('[FeaturedJourneys] Starting getFeaturedJourneys with timeout...');
        const journeysPromise = (async () => {
            await connectDB();
            console.log('[FeaturedJourneys] DB connected, finding packages...');
            const packages = await Package.find({
                isPublished: true,
                isDeleted: false,
            })
                .sort({ homeRank: -1, createdAt: -1 })
                .limit(9)
                .lean();
            console.log(`[FeaturedJourneys] Found ${packages.length} packages`);
            return JSON.parse(JSON.stringify(packages));
        })();

        return await Promise.race([journeysPromise, timeout]);
    } catch (e) {
        console.error('[FeaturedJourneys] Error or Timeout fetching packages:', e);
        return [];
    }
}

export default async function FeaturedJourneys() {
    const packages = await getFeaturedJourneys();
    return <FeaturedJourneysClient packages={packages} />;
}

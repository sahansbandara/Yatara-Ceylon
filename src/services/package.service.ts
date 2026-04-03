import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';

export const PackageService = {
    async getSignaturePackages() {
        try {
            await connectDB();
            const packages = await Package.find({
                isPublished: true,
                isDeleted: false,
                isFeaturedHome: true,
            })
                .sort({ homeRank: 1 })
                .limit(9)
                .lean();
            return JSON.parse(JSON.stringify(packages));
        } catch (error) {
            console.error('[PackageService] getSignaturePackages Error:', error);
            return [];
        }
    },

    async getFeaturedJourneys() {
        const timeout = new Promise<any[]>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 15000)
        );

        try {
            console.log('[PackageService] Starting getFeaturedJourneys with timeout...');
            const journeysPromise = (async () => {
                await connectDB();
                console.log('[PackageService] DB connected, finding packages...');
                const packages = await Package.find({
                    isPublished: true,
                    isDeleted: false,
                })
                    .sort({ homeRank: -1, createdAt: -1 })
                    .limit(9)
                    .lean();
                console.log(`[PackageService] Found ${packages.length} featured journeys`);
                return JSON.parse(JSON.stringify(packages));
            })();

            return await Promise.race([journeysPromise, timeout]);
        } catch (e) {
            console.error('[PackageService] Error or Timeout fetching featured journeys:', e);
            return [];
        }
    },

    async getDashboardPackages() {
        try {
            await connectDB();
            const packages = await Package.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
            return JSON.parse(JSON.stringify(packages));
        } catch (error) {
            console.error("[PackageService] Failed to fetch dashboard packages:", error);
            return [];
        }
    }
};

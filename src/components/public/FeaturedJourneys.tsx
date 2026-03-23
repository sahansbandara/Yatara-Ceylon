import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';
import FeaturedJourneysClient from './FeaturedJourneysClient';

interface JourneyCardData {
    id: string;
    title: string;
    href: string;
    duration: string;
    image: string;
    highlights: string[];
    priceMin: number;
    styleLabel: string;
}

const FALLBACK_JOURNEYS: JourneyCardData[] = [
    {
        id: 'hill-country',
        title: 'Hill Country Odyssey',
        href: '/packages?style=luxury',
        duration: '7 Days / 6 Nights',
        image: '/images/home/curated-hillcountry.png',
        highlights: ['Tea estate stays', 'Scenic rail moments'],
        priceMin: 0,
        styleLabel: 'Slow Luxury',
    },
    {
        id: 'south-coast',
        title: 'Southern Coast Serenity',
        href: '/packages?style=beach',
        duration: '8 Days / 7 Nights',
        image: '/images/home/curated-southcoast.png',
        highlights: ['Private villa pacing', 'Galle Fort evenings'],
        priceMin: 0,
        styleLabel: 'Coastal Escape',
    },
    {
        id: 'ancient-kingdoms',
        title: 'Ancient Kingdom Trails',
        href: '/packages?style=heritage',
        duration: '6 Days / 5 Nights',
        image: '/images/home/curated-kingdoms.png',
        highlights: ['UNESCO heritage access', 'Private cultural guiding'],
        priceMin: 0,
        styleLabel: 'Heritage',
    },
    {
        id: 'wildlife-circuit',
        title: 'Wildlife & Safari Circuit',
        href: '/packages?style=wildlife',
        duration: '8 Days / 7 Nights',
        image: '/images/home/cat-wildlife.webp',
        highlights: ['Private safari drives', 'Coast-to-park rhythm'],
        priceMin: 0,
        styleLabel: 'Wildlife',
    },
    {
        id: 'wellness-journey',
        title: 'Ayurvedic Renewal Journey',
        href: '/packages?style=wellness',
        duration: '6 Days / 5 Nights',
        image: '/images/home/package-wellness.webp',
        highlights: ['Restorative retreat stays', 'Wellness-led pacing'],
        priceMin: 0,
        styleLabel: 'Wellness',
    },
    {
        id: 'adventure-route',
        title: 'Island Adventure Story',
        href: '/packages?style=adventure',
        duration: '9 Days / 8 Nights',
        image: '/images/home/package-adventure.webp',
        highlights: ['Active exploration', 'Private logistics throughout'],
        priceMin: 0,
        styleLabel: 'Adventure',
    },
];

function formatStyleLabel(style?: string, tags?: string[]) {
    if (style) {
        return style.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    }

    if (tags && tags.length > 0) {
        return tags[0];
    }

    return 'Signature Journey';
}

function getHighlights(highlights?: string[]) {
    const safeHighlights = (highlights || []).filter(Boolean);

    if (safeHighlights.length >= 2) {
        return safeHighlights.slice(0, 2);
    }

    return [
        'Private transfers throughout',
        'Handpicked stays matched to your pace',
    ];
}

async function getFeaturedJourneys(): Promise<JourneyCardData[]> {
    try {
        await connectDB();

        const packages = await Package.find({
            isPublished: true,
            isDeleted: false,
            $or: [{ type: 'journey' }, { type: { $exists: false } }],
        })
            .sort({ isFeaturedHome: -1, homeRank: 1, createdAt: -1 })
            .limit(6)
            .lean();

        if (!packages.length) {
            return FALLBACK_JOURNEYS;
        }

        return packages.map((pkg: any, index: number) => ({
            id: pkg._id?.toString() || pkg.slug || `journey-${index}`,
            title: pkg.title,
            href: `/packages/${pkg.slug}`,
            duration: pkg.duration || 'Tailored to your dates',
            image: pkg.images?.[0] || FALLBACK_JOURNEYS[index % FALLBACK_JOURNEYS.length].image,
            highlights: getHighlights(pkg.highlights),
            priceMin: typeof pkg.priceMin === 'number' ? pkg.priceMin : 0,
            styleLabel: formatStyleLabel(pkg.style, pkg.tags),
        }));
    } catch {
        return FALLBACK_JOURNEYS;
    }
}

export default async function FeaturedJourneys() {
    const journeys = await getFeaturedJourneys();

    return <FeaturedJourneysClient packages={journeys} />;
}

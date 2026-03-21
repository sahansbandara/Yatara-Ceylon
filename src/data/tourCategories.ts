export interface TourCategory {
    title: string;
    promise: string;
    description: string;
    image: string;
    href: string;
    tags: string[];
    isBespoke?: boolean;
}

export const tourCategories: TourCategory[] = [
    {
        title: 'Bespoke Tour',
        promise: 'Tell us your dates + pace. We build the itinerary.',
        description: 'A fully customized Sri Lanka journey shaped around your vision — private guides, handpicked stays, and concierge-level timing.',
        image: '/images/home/cat-bespoke.webp',
        href: '/build-tour',
        tags: ['Tailor-Made', 'Private', 'Concierge'],
        isBespoke: true,
    },
    {
        title: 'Heritage Journeys',
        promise: 'Ancient cities, sacred temples, private guide',
        description: 'Walk through 3,000 years of living history — ancient kingdoms, sacred temples, and colonial grandeur.',
        image: '/images/home/cat-heritage.webp',
        href: '/packages/heritage-triangle-private-edition',
        tags: ['Private Guide', 'Boutique Stays', '5–10 Nights'],
    },
    {
        title: 'Wildlife & Safari',
        promise: 'Leopard country, elephant herds, private jeep',
        description: 'Track leopards in Yala, spot elephants in Udawalawe, and discover Sri Lanka\'s untamed heart.',
        image: '/images/home/cat-wildlife.webp',
        href: '/packages/wildlife-coastal-luxe',
        tags: ['Photography', 'Private Jeep', '4–8 Nights'],
    },
    {
        title: 'Honeymoon Escapes',
        promise: 'Private villas, romantic dining, coastal sunsets',
        description: 'Romantic escapes designed for two — sunset beaches, private villas, and intimate dining.',
        image: '/images/home/cat-honeymoon.webp',
        href: '/packages/honeymoon-private-villa-experiences',
        tags: ['Romance', 'Private', '5–7 Nights'],
    },
    {
        title: 'Ayurveda & Wellness',
        promise: 'Guided wellness reset, daily treatments, calm setting',
        description: 'Ancient wellness traditions in serene tropical settings — restore body, mind, and spirit.',
        image: '/images/home/cat-ayurvedic.webp',
        href: '/packages/ayurveda-wellness-sanctuary',
        tags: ['Slow Travel', 'Spa', '5–10 Nights'],
    },
    {
        title: 'Hill Country & Rail',
        promise: 'Tea bungalows, scenic train, misty highlands',
        description: 'Misty tea plantations, scenic train rides, and cool mountain air in Sri Lanka\'s highlands.',
        image: '/images/home/cat-hillcountry.webp',
        href: '/packages/hill-country-tea-rail-retreat',
        tags: ['Scenic Rail', 'Couples', '3–7 Nights'],
    },
    {
        title: 'Coastal Serenity',
        promise: 'Secluded beaches, villa stays, whale watching',
        description: 'From Mirissa\'s whale-watching shores to Trincomalee\'s turquoise waters — ocean bliss awaits.',
        image: '/images/home/cat-coastal.webp',
        href: '/packages/east-coast-summer-escape',
        tags: ['Beach', 'Luxury', '4–8 Nights'],
    },
    {
        title: 'Ramayana Trail Deluxe',
        promise: 'Sacred temples, misty hills, spiritual heritage refined',
        description: 'Trace the legendary Ramayana path across Sri Lanka — ancient temples, serene hill-country roads, and sacred sites with premium comfort.',
        image: '/images/home/cat-ramayana.webp',
        href: '/packages/ramayana-trail-deluxe',
        tags: ['Heritage', 'Spiritual', '6 Nights'],
    },
];

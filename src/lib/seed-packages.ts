import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/toms';

const PREMIUM_PACKAGES = [
    {
        title: 'The Ceylon Grand Circuit',
        slug: 'ceylon-grand-circuit',
        duration: '10 Days / 9 Nights',
        priceMin: 320000,
        priceMax: 540000,
        summary: 'A complete luxury circuit of Sri Lanka — ancient kingdoms, tea country, and the southern coast — designed with private guiding, boutique stays, and unhurried pacing.',
        fullDescription: 'This is your "first and best" Sri Lanka journey: Sigiriya\'s drama, Kandy\'s heritage, a scenic hill-country rail segment, and coastal restoration in Galle. Expect premium transfers, curated experiences, and concierge-level timing — no rushed checklist travel.',
        tags: ['Luxury', 'First-Time', 'Couples', 'Private Guide', 'Boutique Stays'],
        highlights: [
            'Private Cultural Triangle day with sunrise option',
            'Tea estate afternoon + tasting experience',
            'Scenic train segment (reserved seats)',
            'Galle Fort walk with local storyteller',
            'Optional safari upgrade (Yala / Minneriya)',
        ],
        inclusions: [
            'Private air-conditioned vehicle + driver',
            'Curated hotel collection (4–5 star)',
            'Daily breakfast',
            'Private guide days (selected)',
            'Entrance fees for listed highlights',
        ],
        exclusions: [
            'International flights',
            'Visa fees',
            'Lunch & dinner (unless stated)',
            'Tips / personal expenses',
        ],
        itinerary: [
            { day: 1, title: 'Arrival & Colombo Evening Calm', description: 'Airport welcome, transfer to Colombo. Evening at leisure — Galle Face promenade or rooftop dining.', activity: 'Colombo Welcome' },
            { day: 2, title: 'Colombo to Cultural Triangle', description: 'Drive north through the heartland. Heritage stop en route at Dambulla Cave Temple.', activity: 'Dambulla Cave Temple' },
            { day: 3, title: 'Sigiriya & Polonnaruwa', description: 'Private guided day at Sigiriya Rock Fortress and the ancient ruins of Polonnaruwa.', activity: 'Sigiriya Sunrise' },
            { day: 4, title: 'Village Experience & Optional Safari', description: 'Morning village immersion — ox-cart, cooking, farming. Afternoon optional Minneriya elephant safari.', activity: 'Village Immersion' },
            { day: 5, title: 'Kandy — Temple & Craft Heritage', description: 'Temple of the Tooth, Kandy cultural show, artisan workshops. Boutique lakeside stay.', activity: 'Temple of the Tooth' },
            { day: 6, title: 'Tea Country — Estate Life & Viewpoints', description: 'Drive into the highlands. Tea estate check-in, afternoon factory tour and tasting.', activity: 'Tea Tasting' },
            { day: 7, title: 'Scenic Rail Segment & Highland Leisure', description: 'Reserved-seat scenic train through tunnels and bridges. Afternoon at leisure in the hills.', activity: 'Scenic Train Ride' },
            { day: 8, title: 'South Coast — Galle Fort Sunset', description: 'Drive to the southern coast. Galle Fort heritage walk at golden hour.', activity: 'Galle Fort Walk' },
            { day: 9, title: 'Coastal Day — Villa Time', description: 'Beachfront villa leisure. Optional whale watching (seasonal) or spa morning.', activity: 'Coastal Restoration' },
            { day: 10, title: 'Departure', description: 'Leisurely breakfast, private transfer to airport.', activity: 'Departure' },
        ],
        images: [
            '/images/packages/ceylon-grand-circuit-hero.png',
            '/images/packages/ceylon-grand-circuit-gallery-1.png',
            '/images/packages/ceylon-grand-circuit-gallery-2.png',
            '/images/packages/ceylon-grand-circuit-gallery-3.png',
        ],
        isPublished: true,
        isFeaturedHome: true,
        homeRank: 1,
    },
    {
        title: 'Hill Country Tea & Rail Retreat',
        slug: 'hill-country-tea-rail-retreat',
        duration: '7 Days / 6 Nights',
        priceMin: 240000,
        priceMax: 410000,
        summary: 'A slow-luxury hill-country escape: tea bungalows, misty hikes, and a reserved scenic train experience.',
        fullDescription: 'Built for travelers who want calm and refinement. You\'ll spend longer in fewer places, with golden-hour viewpoints, curated estate tastings, and optional guided nature walks.',
        tags: ['Wellness', 'Slow Travel', 'Couples', 'Scenic Rail'],
        highlights: [
            'Premium tea bungalow stay (2 nights)',
            'Reserved-seat scenic train segment',
            'Tea blending/tasting session',
            'Optional easy hike + picnic viewpoint',
            'Highland waterfall stop',
        ],
        inclusions: [
            'Private transfers throughout',
            'Breakfast daily',
            'Rail tickets (reserved seating)',
            'Tea tasting session',
        ],
        exclusions: [
            'Flights/visa',
            'Meals except breakfast',
            'Optional hikes/activities not listed',
        ],
        itinerary: [
            { day: 1, title: 'Arrival to Kandy', description: 'Soft landing in the cultural capital. Evening at leisure by Kandy Lake.', activity: 'Kandy Lake Evening' },
            { day: 2, title: 'Kandy Culture & Botanical Gardens', description: 'Temple of the Tooth, Peradeniya Royal Botanical Gardens, afternoon tea.', activity: 'Botanical Gardens' },
            { day: 3, title: 'Kandy to Tea Country', description: 'Drive through cascading terraces to your tea estate. Welcome experience.', activity: 'Estate Welcome' },
            { day: 4, title: 'Tea Day — Tasting & Slow Afternoon', description: 'Factory tour, blending session, and golden-hour viewpoint walk.', activity: 'Tea Blending Session' },
            { day: 5, title: 'Scenic Train Segment & Viewpoint', description: 'Reserved-seat scenic rail through tunnels and bridges. Highland viewpoint.', activity: 'Scenic Train Ride' },
            { day: 6, title: 'Highland Leisure / Light Hike', description: 'Optional nature walk or waterfall visit. Afternoon restoration.', activity: 'Highland Hike' },
            { day: 7, title: 'Return & Departure', description: 'Leisurely morning, transfer to airport.', activity: 'Departure' },
        ],
        images: [
            '/images/packages/hill-country-tea-rail-retreat-hero.png',
            '/images/packages/hill-country-tea-rail-retreat-gallery-1.png',
            '/images/packages/hill-country-tea-rail-retreat-gallery-2.png',
            '/images/packages/hill-country-tea-rail-retreat-gallery-3.png',
        ],
        isPublished: true,
        isFeaturedHome: true,
        homeRank: 4,
    },
    {
        title: 'Heritage Triangle Private Edition',
        slug: 'heritage-triangle-private-edition',
        duration: '6 Days / 5 Nights',
        priceMin: 210000,
        priceMax: 360000,
        summary: 'UNESCO heritage with private guiding and boutique stays — Sigiriya, Polonnaruwa, and sacred Kandy without crowds.',
        fullDescription: 'This is the "history lover" package done properly: early access timings, a private guide who can actually explain context, and evenings designed around rest.',
        tags: ['Heritage', 'Private Guide', 'Boutique', 'Families'],
        highlights: [
            'Sigiriya sunrise option',
            'Polonnaruwa cycle/walk upgrade',
            'Kandy sacred evening',
            'Curated craft & spice heritage stop',
        ],
        inclusions: [
            'Private vehicle throughout',
            'Breakfast daily',
            'Private guide days',
            'Entrance fees (core sites)',
        ],
        exclusions: [
            'Flights/visa',
            'Meals except breakfast',
            'Optional upgrades',
        ],
        itinerary: [
            { day: 1, title: 'Arrival to Cultural Triangle', description: 'Airport transfer to the heritage region. Evening at boutique property.', activity: 'Cultural Triangle Welcome' },
            { day: 2, title: 'Sigiriya & Village Experience', description: 'Early Sigiriya climb with private guide. Afternoon village immersion.', activity: 'Sigiriya Climb' },
            { day: 3, title: 'Polonnaruwa & Serene Evening', description: 'Cycle or walk through ancient Polonnaruwa ruins. Peaceful evening.', activity: 'Polonnaruwa Ruins' },
            { day: 4, title: 'Dambulla to Kandy', description: 'Dambulla Cave Temple. Spice garden stop. Scenic drive to Kandy.', activity: 'Dambulla Caves' },
            { day: 5, title: 'Kandy Culture & Lake Walk', description: 'Temple of the Tooth, cultural dance, lakeside evening walk.', activity: 'Temple Visit' },
            { day: 6, title: 'Departure', description: 'Morning at leisure, airport transfer.', activity: 'Departure' },
        ],
        images: [
            '/images/packages/heritage-triangle-private-edition-hero.webp',
            '/images/packages/heritage-triangle-private-edition-gallery-1.webp',
            '/images/packages/heritage-triangle-private-edition-gallery-2.webp',
            '/images/packages/heritage-triangle-private-edition-gallery-3.webp',
        ],
        isPublished: true,
        isFeaturedHome: true,
        homeRank: 6,
    },
    {
        title: 'Wildlife & Coastal Luxe',
        slug: 'wildlife-coastal-luxe',
        duration: '8 Days / 7 Nights',
        priceMin: 290000,
        priceMax: 520000,
        summary: 'Two iconic moods: private safari encounters and southern-coast villa luxury.',
        fullDescription: 'A premium split: 2–3 nights near a national park for game drives, then a coastal villa base for restoration. Perfect for couples and photographers.',
        tags: ['Wildlife', 'Luxury', 'Couples', 'Photography'],
        highlights: [
            '2 game drives (upgradeable to private jeep)',
            'Beachfront villa-style stay',
            'Galle Fort + dining curation',
            'Optional whale watching (seasonal)',
        ],
        inclusions: [
            'Private transfers throughout',
            'Breakfast daily',
            '2 safari drives (shared unless upgraded)',
            'Core experiences listed',
        ],
        exclusions: [
            'Flights/visa',
            'Park camera fees (if applicable)',
            'Meals except breakfast',
            'Private jeep upgrade',
        ],
        itinerary: [
            { day: 1, title: 'Arrival to South Coast', description: 'Airport transfer to the southern coast. Settle into coastal accommodation.', activity: 'Coastal Welcome' },
            { day: 2, title: 'Galle Fort & Coast', description: 'Heritage walk through Galle Fort. Curated lunch spot. Afternoon beach time.', activity: 'Galle Fort Heritage Walk' },
            { day: 3, title: 'Transfer to Safari Region', description: 'Drive to national park area. Late afternoon sunset game drive.', activity: 'Sunset Safari' },
            { day: 4, title: 'Morning Safari & Lodge Leisure', description: 'Early morning safari for best wildlife encounters. Afternoon at lodge.', activity: 'Morning Safari' },
            { day: 5, title: 'Transfer Back to Coast', description: 'Return to coastal villa. Afternoon at leisure, spa optional.', activity: 'Villa Check-in' },
            { day: 6, title: 'Villa Day — Spa Optional', description: 'Full day at the villa. Optional spa, beachfront yoga, or reading time.', activity: 'Coastal Restoration' },
            { day: 7, title: 'Coastal Exploration', description: 'Explore nearby beaches, stilt fishermen, or optional whale watching.', activity: 'Coastal Discovery' },
            { day: 8, title: 'Departure', description: 'Leisurely morning, airport transfer.', activity: 'Departure' },
        ],
        images: [
            '/images/packages/wildlife-coastal-luxe-hero.webp',
            '/images/packages/wildlife-coastal-luxe-gallery-1.webp',
            '/images/packages/wildlife-coastal-luxe-gallery-2.webp',
            '/images/packages/wildlife-coastal-luxe-gallery-3.webp',
        ],
        isPublished: true,
        isFeaturedHome: true,
        homeRank: 3,
    },
    {
        title: 'Ayurveda Wellness Sanctuary',
        slug: 'ayurveda-wellness-sanctuary',
        duration: '7 Days / 6 Nights',
        priceMin: 260000,
        priceMax: 430000,
        summary: 'A guided wellness reset with Ayurveda consultations, gentle movement, and a calm coastal setting — built around rest, not sightseeing.',
        fullDescription: 'This journey keeps travel minimal and recovery maximal. Inspired by structured wellness programs — clear programs, duration, outcomes. Arrive tired, leave restored.',
        tags: ['Wellness', 'Ayurveda', 'Slow Travel', 'Solo', 'Couples'],
        highlights: [
            'Initial Ayurveda consultation + personalized plan',
            'Daily treatments (program-based)',
            'Breathwork / gentle yoga sessions',
            'Mindful coastal time',
        ],
        inclusions: [
            'Wellness program components (as selected)',
            'Breakfast (and meals if resort includes)',
            'Transfers to/from retreat',
        ],
        exclusions: [
            'Flights/visa',
            'Non-program add-ons',
            'Personal purchases',
        ],
        itinerary: [
            { day: 1, title: 'Arrival & Consultation', description: 'Transfer to wellness retreat. Initial Ayurveda consultation and personalized plan.', activity: 'Ayurveda Consultation' },
            { day: 2, title: 'Wellness Rhythm Begins', description: 'Morning treatments, gentle yoga, nutritional guidance.', activity: 'Treatment Day' },
            { day: 3, title: 'Deep Restoration', description: 'Continued treatments, breathwork session, afternoon coastal walk.', activity: 'Breathwork Session' },
            { day: 4, title: 'Mind-Body Balance', description: 'Mid-program review, adjusted treatments, meditation.', activity: 'Meditation' },
            { day: 5, title: 'Active Recovery', description: 'Gentle movement, nature walk, evening restorative yoga.', activity: 'Restorative Yoga' },
            { day: 6, title: 'Final Treatments', description: 'Last treatment series, closing consultation, wellness recommendations.', activity: 'Closing Consultation' },
            { day: 7, title: 'Departure', description: 'Mindful morning, transfer to airport.', activity: 'Departure' },
        ],
        images: [
            '/images/packages/ayurveda-wellness-sanctuary-hero.webp',
            '/images/packages/ayurveda-wellness-sanctuary-gallery-1.webp',
            '/images/packages/ayurveda-wellness-sanctuary-gallery-2.webp',
            '/images/packages/ayurveda-wellness-sanctuary-gallery-3.webp',
        ],
        isPublished: true,
        isFeaturedHome: false,
        homeRank: 0,
    },
    {
        title: 'Honeymoon: Private Villa & Experiences',
        slug: 'honeymoon-private-villa-experiences',
        duration: '7 Days / 6 Nights',
        priceMin: 310000,
        priceMax: 560000,
        summary: 'A honeymoon designed like a concierge itinerary — privacy-first stays, romantic moments, and optional adventure in controlled doses.',
        fullDescription: 'This package sells the honeymoon intent with premium execution — private villas, romantic dining setups, curated coastal days, and just enough exploration to create shared memories.',
        tags: ['Honeymoon', 'Luxury', 'Private', 'Romance'],
        highlights: [
            'Private dining setup (one night)',
            'Romantic coastal day plan',
            'Galle Fort sunset + curated dinner',
            'Optional scenic rail upgrade',
        ],
        inclusions: [
            'Private transfers throughout',
            'Breakfast daily',
            'One romantic experience inclusion (dining or spa credit)',
        ],
        exclusions: [
            'Flights/visa',
            'Most lunches/dinners',
            'Extra spa services',
        ],
        itinerary: [
            { day: 1, title: 'Arrival to Private Stay', description: 'Airport welcome with flowers. Transfer to private villa or boutique suite.', activity: 'Villa Welcome' },
            { day: 2, title: 'Leisure & Spa Option', description: 'Late morning rise. Couples spa treatment or pool day.', activity: 'Couples Spa' },
            { day: 3, title: 'Coastal Explore & Romance Setup', description: 'Beach exploration, sunset spot. Private dining experience in the evening.', activity: 'Private Dining' },
            { day: 4, title: 'Galle Fort & Curated Dinner', description: 'Heritage walk through Galle Fort at golden hour. Curated restaurant dinner.', activity: 'Galle Fort Sunset' },
            { day: 5, title: 'Optional Day Trip', description: 'Choose: scenic rail to tea country, whale watching, or a second spa day.', activity: 'Choose Your Adventure' },
            { day: 6, title: 'Beach Restoration Day', description: 'Final full day at the villa. Sunrise yoga optional. Farewell sundowners.', activity: 'Beach Day' },
            { day: 7, title: 'Departure', description: 'Leisurely morning, private airport transfer.', activity: 'Departure' },
        ],
        images: [
            '/images/packages/honeymoon-private-villa-experiences-hero.webp',
            '/images/packages/honeymoon-private-villa-experiences-gallery-1.webp',
            '/images/packages/honeymoon-private-villa-experiences-gallery-2.webp',
            '/images/packages/honeymoon-private-villa-experiences-gallery-3.webp',
        ],
        isPublished: true,
        isFeaturedHome: true,
        homeRank: 5,
    },
    {
        title: 'East Coast Summer Escape',
        slug: 'east-coast-summer-escape',
        duration: '8 Days / 7 Nights',
        priceMin: 250000,
        priceMax: 420000,
        summary: 'Sun-drenched east-coast beaches with lagoon calm, snorkeling options, and minimal transfers.',
        fullDescription: 'The east coast of Sri Lanka is a world apart — crystal waters, long sandy stretches, and a relaxed pace. This package is built around a long beach base with curated day experiences.',
        tags: ['Beach', 'Summer', 'Families', 'Relax'],
        highlights: [
            'Long beach base (4+ nights)',
            'Snorkeling / boat option',
            'Lagoon sunset experience',
            'Local seafood dining',
        ],
        inclusions: [
            'Private transfers throughout',
            'Breakfast daily',
            'Beach resort accommodation',
            'One snorkeling/boat excursion',
        ],
        exclusions: [
            'Flights/visa',
            'Meals except breakfast',
            'Additional water sports',
        ],
        itinerary: [
            { day: 1, title: 'Arrival to East Coast', description: 'Transfer from airport (or Colombo) to east coast beach resort. Evening beach walk.', activity: 'Beach Welcome' },
            { day: 2, title: 'Beach Day — Settle In', description: 'Full day at the beach. Snorkeling introduction or pool time.', activity: 'Beach Day' },
            { day: 3, title: 'Snorkeling & Boat Trip', description: 'Morning boat trip to nearby reef. Snorkeling in crystal waters.', activity: 'Snorkeling Excursion' },
            { day: 4, title: 'Lagoon Sunset Experience', description: 'Explore nearby lagoon by kayak or boat. Sunset viewing.', activity: 'Lagoon Sunset' },
            { day: 5, title: 'Rest & Restoration', description: 'Unplanned day — beach, reading, spa, or nothing at all.', activity: 'Leisure Day' },
            { day: 6, title: 'Local Discovery', description: 'Visit nearby town, local market, or temple. Seafood dinner.', activity: 'Local Culture' },
            { day: 7, title: 'Final Beach Day', description: 'Last full day at the coast. Sunset farewell.', activity: 'Farewell Sunset' },
            { day: 8, title: 'Departure', description: 'Morning transfer to airport.', activity: 'Departure' },
        ],
        images: [
            '/images/packages/east-coast-summer-escape-hero.webp',
            '/images/packages/east-coast-summer-escape-gallery-1.webp',
            '/images/packages/east-coast-summer-escape-gallery-2.webp',
            '/images/packages/east-coast-summer-escape-gallery-3.webp',
        ],
        isPublished: true,
        isFeaturedHome: false,
        homeRank: 0,
    },
    {
        title: 'Ramayana Trail Deluxe',
        slug: 'ramayana-trail-deluxe',
        duration: '6 Days / 5 Nights',
        priceMin: 220000,
        priceMax: 390000,
        summary: 'A refined spiritual heritage journey across key Ramayana-linked sites with elevated accommodation and calm pacing.',
        fullDescription: 'Sri Lanka holds dozens of sites linked to the Ramayana epic. This journey connects the most significant ones with comfortable routing, private guiding, and upgraded stays designed for meaningful travel, not exhausting pilgrimages.',
        tags: ['Heritage', 'Spiritual', 'Families', 'Pilgrimage'],
        highlights: [
            'Key temple circuit with comfortable routing',
            'Private guide days for context and storytelling',
            'Upgraded stays for rest and recovery',
            'Evening temple ceremonies at select sites',
        ],
        inclusions: [
            'Private vehicle throughout',
            'Breakfast daily',
            'Private guide (all days)',
            'Temple entrance fees',
        ],
        exclusions: [
            'Flights/visa',
            'Meals except breakfast',
            'Temple donations (personal)',
        ],
        itinerary: [
            { day: 1, title: 'Arrival & Colombo', description: 'Airport welcome, transfer to Colombo. Visit Kelaniya Raja Maha Viharaya.', activity: 'Kelaniya Temple' },
            { day: 2, title: 'Chilaw to Trincomalee', description: 'Munneswaram Temple, Manavari Temple. Drive to Trincomalee.', activity: 'Sacred Temples' },
            { day: 3, title: 'Trincomalee Sacred Sites', description: 'Koneswaram Temple, Uppuveli. Evening by the harbour.', activity: 'Koneswaram Temple' },
            { day: 4, title: 'Central Highlands Temples', description: 'Drive through hill country to Seetha Amman Temple, Hakgala.', activity: 'Seetha Amman Temple' },
            { day: 5, title: 'Nuwara Eliya & Ella', description: 'Divurumpola, Ravana Falls. Evening at boutique highland stay.', activity: 'Ravana Falls' },
            { day: 6, title: 'Departure', description: 'Final temple visit if time permits. Airport transfer.', activity: 'Departure' },
        ],
        images: [
            '/images/packages/ramayana-trail-deluxe-hero.webp',
            '/images/packages/ramayana-trail-deluxe-gallery-1.webp',
            '/images/packages/ramayana-trail-deluxe-gallery-2.webp',
            '/images/packages/ramayana-trail-deluxe-gallery-3.webp',
        ],
        isPublished: true,
        isFeaturedHome: false,
        homeRank: 0,
    },
];

import { NEW_PACKAGES } from './new-packages-data';

const ALL_PACKAGES = [...PREMIUM_PACKAGES, ...NEW_PACKAGES];

async function seedPackages() {
    console.log('Seeding 20 premium packages...');
    await mongoose.connect(MONGODB_URI);

    const Package = (await import('@/models/Package')).default;

    for (const pkg of ALL_PACKAGES) {
        const existing = await Package.findOne({ slug: pkg.slug });
        if (existing) {
            // Update existing
            await Package.findOneAndUpdate({ slug: pkg.slug }, { $set: pkg });
            console.log(`  Updated: ${pkg.title}`);
        } else {
            await Package.create(pkg);
            console.log(`  Created: ${pkg.title}`);
        }
    }

    console.log('Done! 20 premium packages seeded.');
    await mongoose.disconnect();
    process.exit(0);
}

seedPackages().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});


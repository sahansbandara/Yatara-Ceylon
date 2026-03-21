// ─────────────────────────────────────────────────────────
// Transfers Catalog — Single source of truth
// Categories, transfer products, signature routes, fleet tiers, FAQ
// ─────────────────────────────────────────────────────────

import {
    Plane,
    TreePine,
    Wine,
    Route,
    Clock,
    Car,
    type LucideIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   VEHICLE TIERS
   ═══════════════════════════════════════════════════════════ */

export interface VehicleTier {
    name: string;
    slug: string;
    tagline: string;
    vehicles: string;
    maxGuests: number;
    maxLuggage: string;
    features: string[];
    image: string;
    idealFor: string;
    useCases: string[];
}

export const vehicleTiers: VehicleTier[] = [
    {
        name: 'Executive',
        slug: 'executive',
        tagline: 'Refined comfort for discerning travellers',
        vehicles: 'Mercedes E-Class / BMW 5 Series / Toyota Premio',
        maxGuests: 2,
        maxLuggage: '2 large + 1 carry-on',
        features: ['Leather interior', 'Climate control', 'Complimentary Wi-Fi', 'Bottled water', 'Phone charger'],
        image: '/images/transfers/fleet-executive.webp',
        idealFor: 'Solo travellers, couples, airport arrivals, city business rides',
        useCases: ['Airport pickup', 'Business meetings', 'City transfers', 'Short intercity routes'],
    },
    {
        name: 'Prestige',
        slug: 'prestige',
        tagline: 'Elevated space for families & small groups',
        vehicles: 'Toyota Land Cruiser Prado / Fortuner / Lexus RX',
        maxGuests: 4,
        maxLuggage: '4 large + 2 carry-on',
        features: ['Premium leather', 'Rear climate zone', 'Wi-Fi & entertainment', 'Refreshment cooler', 'Privacy glass'],
        image: '/images/transfers/fleet-prestige.webp',
        idealFor: 'Families, hill-country routes, beach transfers, mid-size private travel',
        useCases: ['Family airport arrivals', 'Hill country routes', 'Beach transfers', 'Safari logistics'],
    },
    {
        name: 'Grand',
        slug: 'grand',
        tagline: 'Spacious luxury for larger parties',
        vehicles: 'Mercedes V-Class / Toyota Alphard / KDH Luxury',
        maxGuests: 7,
        maxLuggage: '6 large + 4 carry-on',
        features: ['Captain seats', 'Full climate system', 'On-board Wi-Fi', 'Minibar', 'Ambient lighting', 'Privacy partition'],
        image: '/images/transfers/fleet-grand.webp',
        idealFor: 'Groups, wedding logistics, multi-stop family trips, VIP hosting',
        useCases: ['Group transfers', 'Wedding transport', 'Corporate events', 'Multi-day retainers'],
    },
];

/* ═══════════════════════════════════════════════════════════
   TRANSFER PRODUCT MODEL
   ═══════════════════════════════════════════════════════════ */

export type TransferType = 'AIRPORT' | 'INTERCITY' | 'SCENIC' | 'HOURLY' | 'SAFARI' | 'EVENT';

export interface TransferProduct {
    slug: string;
    title: string;
    subtitle: string;
    transferType: TransferType;
    pickupLabel: string;
    dropoffLabel: string;
    duration: string;
    distanceKm: number;
    startingPriceLkr: number;
    vehicleTierRecommended: string;
    passengerCapacity: number;
    luggageCapacity: number;
    summary: string;
    includes: string[];
    bestFor: string;
    whyChoose: string;
    heroImage: string;
    gallery: string[];
    seoTitle: string;
    seoDescription: string;
    relatedSlugs: string[];
}

/* ═══════════════════════════════════════════════════════════
   TRANSFER PRODUCTS — 22 ROUTES
   ═══════════════════════════════════════════════════════════ */

export const transferProducts: TransferProduct[] = [
    // ─── AIRPORT ARRIVALS / DEPARTURES (1–10) ───────────────

    {
        slug: 'colombo-airport-to-colombo-city',
        title: 'Colombo Airport to Colombo City',
        subtitle: 'A swift, polished arrival into Sri Lanka\'s capital — ideal for business guests and short stays.',
        transferType: 'AIRPORT',
        pickupLabel: 'Bandaranaike International Airport (CMB)',
        dropoffLabel: 'Colombo City',
        duration: '45–60 min',
        distanceKm: 35,
        startingPriceLkr: 11500,
        vehicleTierRecommended: 'executive',
        passengerCapacity: 2,
        luggageCapacity: 2,
        summary: 'Direct airport-to-city transfer in executive comfort with meet & greet, flight tracking, and luggage assistance.',
        includes: ['Meet & greet at arrivals', 'Flight tracking', '60 min airport waiting buffer', 'Bottled water', 'Luggage assistance', 'WhatsApp support'],
        bestFor: 'Business arrivals, short stays',
        whyChoose: 'Skip the airport taxi chaos. A professional chauffeur meets you at arrivals with your name, handles luggage, and delivers you to any Colombo address in air-conditioned comfort.',
        heroImage: '/images/transfers/route-cmb-colombo.webp',
        gallery: ['/images/transfers/route-cmb-colombo.webp', '/images/transfers/fleet-executive.webp'],
        seoTitle: 'Colombo Airport to Colombo City Private Transfer | Yatara Ceylon',
        seoDescription: 'Premium private transfer from Bandaranaike International Airport to Colombo city. Meet & greet, flight tracking, luxury vehicle. From LKR 11,500.',
        relatedSlugs: ['colombo-airport-to-negombo', 'colombo-airport-to-bentota', 'colombo-hourly-chauffeur'],
    },
    {
        slug: 'colombo-airport-to-negombo',
        title: 'Colombo Airport to Negombo',
        subtitle: 'A quick, comfortable first-night transfer to Negombo\'s beach strip — just minutes from the airport.',
        transferType: 'AIRPORT',
        pickupLabel: 'Bandaranaike International Airport (CMB)',
        dropoffLabel: 'Negombo',
        duration: '25–35 min',
        distanceKm: 15,
        startingPriceLkr: 8500,
        vehicleTierRecommended: 'executive',
        passengerCapacity: 2,
        luggageCapacity: 2,
        summary: 'Short airport transfer to Negombo hotels and villas with meet & greet service.',
        includes: ['Meet & greet at arrivals', 'Flight tracking', 'Bottled water', 'Luggage handling', 'WhatsApp support'],
        bestFor: 'First-night stopovers',
        whyChoose: 'The shortest transfer from CMB — perfect for late-night arrivals who want to settle into a beach hotel quickly without navigating tuk-tuks or haggling.',
        heroImage: '/images/transfers/route-cmb-negombo.webp',
        gallery: ['/images/transfers/route-cmb-negombo.webp'],
        seoTitle: 'Colombo Airport to Negombo Private Transfer | Yatara Ceylon',
        seoDescription: 'Quick private transfer from CMB Airport to Negombo. Meet & greet, luggage handling. From LKR 8,500.',
        relatedSlugs: ['colombo-airport-to-colombo-city', 'colombo-airport-to-bentota'],
    },
    {
        slug: 'colombo-airport-to-bentota',
        title: 'Colombo Airport to Bentota',
        subtitle: 'A smooth south-west coast arrival in private comfort — ideal for beach resort guests.',
        transferType: 'AIRPORT',
        pickupLabel: 'Bandaranaike International Airport (CMB)',
        dropoffLabel: 'Bentota',
        duration: '2 hrs',
        distanceKm: 105,
        startingPriceLkr: 18500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Comfortable airport-to-beach transfer via the Southern Expressway in a premium SUV.',
        includes: ['Meet & greet at arrivals', 'Flight tracking', '60 min airport waiting buffer', 'Bottled water', 'Luggage assistance', 'WhatsApp support'],
        bestFor: 'South-west beach arrivals',
        whyChoose: 'Fast expressway route gets you from terminal to poolside in just two hours. No stress, no stops — just a clean transition from flight to beach.',
        heroImage: '/images/transfers/route-cmb-bentota.webp',
        gallery: ['/images/transfers/route-cmb-bentota.webp', '/images/transfers/fleet-prestige.webp'],
        seoTitle: 'Colombo Airport to Bentota Private Transfer | Yatara Ceylon',
        seoDescription: 'Premium private transfer from CMB Airport to Bentota. SUV comfort, meet & greet. From LKR 18,500.',
        relatedSlugs: ['colombo-airport-to-hikkaduwa', 'colombo-airport-to-galle-fort'],
    },
    {
        slug: 'colombo-airport-to-hikkaduwa',
        title: 'Colombo Airport to Hikkaduwa',
        subtitle: 'Direct airport transfer to Hikkaduwa\'s surf and reef coast in premium vehicle comfort.',
        transferType: 'AIRPORT',
        pickupLabel: 'Bandaranaike International Airport (CMB)',
        dropoffLabel: 'Hikkaduwa',
        duration: '2 hrs 20 min',
        distanceKm: 135,
        startingPriceLkr: 20500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Airport arrival transfer to Hikkaduwa beach strip with meet & greet and luggage handling.',
        includes: ['Meet & greet at arrivals', 'Flight tracking', '60 min airport waiting buffer', 'Bottled water', 'Luggage assistance', 'WhatsApp support'],
        bestFor: 'Beach travelers',
        whyChoose: 'Removes all transport friction between landing and your Hikkaduwa guesthouse. A single, seamless ride with no bus changes or train connections.',
        heroImage: '/images/transfers/route-cmb-hikkaduwa.webp',
        gallery: ['/images/transfers/route-cmb-hikkaduwa.webp'],
        seoTitle: 'Colombo Airport to Hikkaduwa Private Transfer | Yatara Ceylon',
        seoDescription: 'Private transfer from CMB Airport to Hikkaduwa. Surf coast arrival in luxury. From LKR 20,500.',
        relatedSlugs: ['colombo-airport-to-bentota', 'colombo-airport-to-galle-fort'],
    },
    {
        slug: 'colombo-airport-to-galle-fort',
        title: 'Colombo Airport to Galle Fort',
        subtitle: 'A polished south-coast arrival in private comfort, ideal for guests beginning their journey at Galle Fort.',
        transferType: 'AIRPORT',
        pickupLabel: 'Bandaranaike International Airport (CMB)',
        dropoffLabel: 'Galle Fort',
        duration: '2.5 hrs',
        distanceKm: 155,
        startingPriceLkr: 22500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Smooth south-coast arrival transfer in premium SUV comfort with full meet & greet service.',
        includes: ['Arrival meet & greet', 'Flight tracking', '60 min airport waiting buffer', 'Bottled water', 'Luggage assistance', 'WhatsApp support'],
        bestFor: 'Luxury south-coast arrivals, couples, families, villa guests',
        whyChoose: 'One of the cleanest and most requested arrival routes. It removes airport friction and gets the traveler into a premium coastal rhythm immediately.',
        heroImage: '/images/transfers/route-cmb-galle.webp',
        gallery: ['/images/transfers/route-cmb-galle.webp', '/images/transfers/fleet-prestige.webp'],
        seoTitle: 'Colombo Airport to Galle Fort Private Transfer | Yatara Ceylon',
        seoDescription: 'Premium private transfer from CMB Airport to Galle Fort. Meet & greet, flight tracking, luxury SUV. From LKR 22,500.',
        relatedSlugs: ['colombo-airport-to-bentota', 'colombo-airport-to-hikkaduwa', 'galle-to-yala'],
    },
    {
        slug: 'colombo-airport-to-kandy',
        title: 'Colombo Airport to Kandy',
        subtitle: 'A calm, premium transfer into the hill-country gateway, designed for guests beginning cultural and highland itineraries.',
        transferType: 'AIRPORT',
        pickupLabel: 'Bandaranaike International Airport (CMB)',
        dropoffLabel: 'Kandy',
        duration: '3.5 hrs',
        distanceKm: 120,
        startingPriceLkr: 19500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Airport-to-hill-country transfer with meet & greet, air-conditioned comfort, and driver coordination.',
        includes: ['Meet & greet', 'Air-conditioned vehicle', 'Bottled water', 'Luggage support', 'Driver coordination before arrival', 'WhatsApp support'],
        bestFor: 'Cultural travelers, family itineraries',
        whyChoose: 'Ideal for guests who want to bypass fragmented public transport and move directly into Kandy in private comfort.',
        heroImage: '/images/transfers/route-cmb-kandy.webp',
        gallery: ['/images/transfers/route-cmb-kandy.webp', '/images/transfers/fleet-prestige.webp'],
        seoTitle: 'Colombo Airport to Kandy Chauffeur Transfer | Yatara Ceylon',
        seoDescription: 'Private chauffeur transfer from CMB Airport to Kandy. Premium comfort, meet & greet. From LKR 19,500.',
        relatedSlugs: ['kandy-to-nuwara-eliya', 'sigiriya-to-kandy', 'colombo-to-galle-fort'],
    },
    {
        slug: 'colombo-airport-to-sigiriya',
        title: 'Colombo Airport to Sigiriya',
        subtitle: 'Direct cultural triangle access from the airport — arrive at the rock fortress region rested and ready.',
        transferType: 'AIRPORT',
        pickupLabel: 'Bandaranaike International Airport (CMB)',
        dropoffLabel: 'Sigiriya',
        duration: '4 hrs',
        distanceKm: 165,
        startingPriceLkr: 24500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Long-haul airport transfer to Sri Lanka\'s Cultural Triangle heartland in premium vehicle comfort.',
        includes: ['Meet & greet', 'Flight tracking', 'Bottled water', 'Luggage assistance', 'Flexible stop requests', 'WhatsApp support'],
        bestFor: 'Cultural Triangle access',
        whyChoose: 'The most efficient way to reach Sigiriya from the airport. No overnight in Colombo needed — go straight to the cultural heartland.',
        heroImage: '/images/transfers/route-cmb-sigiriya.webp',
        gallery: ['/images/transfers/route-cmb-sigiriya.webp'],
        seoTitle: 'Colombo Airport to Sigiriya Private Transfer | Yatara Ceylon',
        seoDescription: 'Premium private transfer from CMB Airport to Sigiriya. Cultural Triangle direct access. From LKR 24,500.',
        relatedSlugs: ['sigiriya-to-kandy', 'colombo-airport-to-kandy', 'trincomalee-to-sigiriya'],
    },
    {
        slug: 'colombo-airport-to-nuwara-eliya',
        title: 'Colombo Airport to Nuwara Eliya',
        subtitle: 'A premium long-transfer into the tea-country highlands — for travelers who want hill-country immersion from day one.',
        transferType: 'AIRPORT',
        pickupLabel: 'Bandaranaike International Airport (CMB)',
        dropoffLabel: 'Nuwara Eliya',
        duration: '5.5 hrs',
        distanceKm: 175,
        startingPriceLkr: 29500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Extended airport transfer climbing from coastal lowlands into Sri Lanka\'s premier tea country.',
        includes: ['Meet & greet', 'Flight tracking', 'Bottled water', 'Luggage assistance', 'Flexible stop requests', 'WhatsApp support'],
        bestFor: 'Tea-country travelers',
        whyChoose: 'For guests who want to skip Colombo entirely and ascend straight into the misty highlands. The scenic route through Kandy adds beauty to the journey.',
        heroImage: '/images/transfers/route-cmb-nuwaraeliya.webp',
        gallery: ['/images/transfers/route-cmb-nuwaraeliya.webp'],
        seoTitle: 'Colombo Airport to Nuwara Eliya Private Transfer | Yatara Ceylon',
        seoDescription: 'Premium private transfer from CMB Airport to Nuwara Eliya tea country. From LKR 29,500.',
        relatedSlugs: ['kandy-to-nuwara-eliya', 'nuwara-eliya-to-ella', 'colombo-airport-to-kandy'],
    },
    {
        slug: 'colombo-airport-to-ella',
        title: 'Colombo Airport to Ella',
        subtitle: 'The ultimate long-transfer for guests heading straight to Ella\'s highland valley — scenic and seamless.',
        transferType: 'AIRPORT',
        pickupLabel: 'Bandaranaike International Airport (CMB)',
        dropoffLabel: 'Ella',
        duration: '6 hrs',
        distanceKm: 230,
        startingPriceLkr: 34500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Premium long-distance airport transfer through tea country to Ella\'s charming highland valley.',
        includes: ['Meet & greet', 'Flight tracking', 'Bottled water', 'Luggage assistance', 'Flexible stop requests', 'WhatsApp support'],
        bestFor: 'Scenic long-transfer guests',
        whyChoose: 'Eliminates the need for multiple transport legs. One vehicle, one chauffeur, six hours of increasingly beautiful scenery straight to your Ella accommodation.',
        heroImage: '/images/transfers/route-cmb-ella.webp',
        gallery: ['/images/transfers/route-cmb-ella.webp'],
        seoTitle: 'Colombo Airport to Ella Private Transfer | Yatara Ceylon',
        seoDescription: 'Premium private transfer from CMB Airport to Ella. Highland scenic route. From LKR 34,500.',
        relatedSlugs: ['nuwara-eliya-to-ella', 'ella-to-yala', 'colombo-airport-to-nuwara-eliya'],
    },
    {
        slug: 'colombo-airport-to-yala',
        title: 'Colombo Airport to Yala',
        subtitle: 'Direct safari access from the airport — arrive at leopard country ready for the wild.',
        transferType: 'AIRPORT',
        pickupLabel: 'Bandaranaike International Airport (CMB)',
        dropoffLabel: 'Yala',
        duration: '5.5 hrs',
        distanceKm: 305,
        startingPriceLkr: 36500,
        vehicleTierRecommended: 'grand',
        passengerCapacity: 7,
        luggageCapacity: 6,
        summary: 'Long-distance airport-to-safari transfer in a spacious Grand vehicle with full refreshment service.',
        includes: ['Meet & greet', 'Flight tracking', 'Bottled water', 'Refreshment cooler', 'Luggage assistance', 'WhatsApp support'],
        bestFor: 'Safari guests',
        whyChoose: 'Get from the terminal to the park lodge in a single premium ride. No overnight stops, no bus changes — just a direct line from arrivals to wilderness.',
        heroImage: '/images/transfers/route-cmb-yala.webp',
        gallery: ['/images/transfers/route-cmb-yala.webp', '/images/transfers/fleet-grand.webp'],
        seoTitle: 'Colombo Airport to Yala Private Transfer | Yatara Ceylon',
        seoDescription: 'Premium private transfer from CMB Airport to Yala National Park. Safari-ready arrival. From LKR 36,500.',
        relatedSlugs: ['galle-to-yala', 'ella-to-yala', 'colombo-airport-to-galle-fort'],
    },

    // ─── INTERCITY PRIVATE TRANSFERS (11–18) ────────────────

    {
        slug: 'colombo-to-galle-fort',
        title: 'Colombo to Galle Fort',
        subtitle: 'City-to-coast private transfer along the Southern Expressway — fast, comfortable, and direct.',
        transferType: 'INTERCITY',
        pickupLabel: 'Colombo',
        dropoffLabel: 'Galle Fort',
        duration: '2 hrs 15 min',
        distanceKm: 130,
        startingPriceLkr: 17500,
        vehicleTierRecommended: 'executive',
        passengerCapacity: 2,
        luggageCapacity: 2,
        summary: 'Direct intercity transfer from Colombo to Galle Fort via the Southern Expressway.',
        includes: ['Door-to-door pickup', 'Private chauffeur', 'Bottled water', 'Luggage handling', 'WhatsApp support'],
        bestFor: 'South coast movement',
        whyChoose: 'The fastest route from Colombo to the south coast. The expressway cuts travel time in half compared to the coastal road.',
        heroImage: '/images/transfers/route-colombo-galle.webp',
        gallery: ['/images/transfers/route-colombo-galle.webp'],
        seoTitle: 'Colombo to Galle Fort Private Transfer | Yatara Ceylon',
        seoDescription: 'Premium private transfer from Colombo to Galle Fort. Express route, luxury vehicle. From LKR 17,500.',
        relatedSlugs: ['colombo-airport-to-galle-fort', 'galle-to-yala', 'colombo-hourly-chauffeur'],
    },
    {
        slug: 'galle-to-yala',
        title: 'Galle to Yala',
        subtitle: 'Beach-to-safari route along Sri Lanka\'s southern coastline — from colonial charm to leopard territory.',
        transferType: 'INTERCITY',
        pickupLabel: 'Galle',
        dropoffLabel: 'Yala',
        duration: '3 hrs 15 min',
        distanceKm: 165,
        startingPriceLkr: 22500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Southern coast intercity transfer connecting Galle Fort region to Yala National Park lodges.',
        includes: ['Door-to-door pickup', 'Private chauffeur', 'Bottled water', 'Luggage handling', 'Flexible stop requests', 'WhatsApp support'],
        bestFor: 'Beach-to-safari route',
        whyChoose: 'The classic south-coast continuation. Move from beach relaxation into safari mode with a single comfortable ride along the coast.',
        heroImage: '/images/transfers/route-galle-yala.webp',
        gallery: ['/images/transfers/route-galle-yala.webp'],
        seoTitle: 'Galle to Yala Private Transfer | Yatara Ceylon',
        seoDescription: 'Premium private transfer from Galle to Yala National Park. Beach to safari. From LKR 22,500.',
        relatedSlugs: ['colombo-airport-to-galle-fort', 'ella-to-yala', 'colombo-airport-to-yala'],
    },
    {
        slug: 'kandy-to-nuwara-eliya',
        title: 'Kandy to Nuwara Eliya',
        subtitle: 'A refined tea-country ascent through Sri Lanka\'s highland landscapes — scenic and comfortable.',
        transferType: 'SCENIC',
        pickupLabel: 'Kandy',
        dropoffLabel: 'Nuwara Eliya',
        duration: '2.5 hrs',
        distanceKm: 80,
        startingPriceLkr: 14500,
        vehicleTierRecommended: 'executive',
        passengerCapacity: 2,
        luggageCapacity: 2,
        summary: 'Scenic hill-country transfer ascending from Kandy through tea plantations to Nuwara Eliya.',
        includes: ['Door-to-door pickup', 'Private chauffeur', 'Bottled water', 'Flexible stop requests', 'WhatsApp support'],
        bestFor: 'Couples, scenic itineraries',
        whyChoose: 'A strong choice for tea-country itineraries, letting guests move between Kandy and Nuwara Eliya without train baggage stress or station coordination.',
        heroImage: '/images/transfers/route-kandy-nuwaraeliya.webp',
        gallery: ['/images/transfers/route-kandy-nuwaraeliya.webp'],
        seoTitle: 'Kandy to Nuwara Eliya Scenic Private Transfer | Yatara Ceylon',
        seoDescription: 'Premium scenic transfer from Kandy to Nuwara Eliya through tea country. From LKR 14,500.',
        relatedSlugs: ['nuwara-eliya-to-ella', 'colombo-airport-to-nuwara-eliya', 'colombo-airport-to-kandy'],
    },
    {
        slug: 'nuwara-eliya-to-ella',
        title: 'Nuwara Eliya to Ella',
        subtitle: 'Highland continuation through misty tea estates and mountain passes — scenic and unhurried.',
        transferType: 'SCENIC',
        pickupLabel: 'Nuwara Eliya',
        dropoffLabel: 'Ella',
        duration: '2.5–3 hrs',
        distanceKm: 85,
        startingPriceLkr: 14500,
        vehicleTierRecommended: 'executive',
        passengerCapacity: 2,
        luggageCapacity: 2,
        summary: 'Scenic highland transfer connecting tea country to Ella\'s valley through mountain landscapes.',
        includes: ['Door-to-door pickup', 'Private chauffeur', 'Bottled water', 'Flexible stop requests', 'WhatsApp support'],
        bestFor: 'Highland continuation',
        whyChoose: 'Continues the highland experience from Nuwara Eliya into Ella without the packed tourist train. Flexible stops for waterfalls and viewpoints.',
        heroImage: '/images/transfers/route-nuwaraeliya-ella.webp',
        gallery: ['/images/transfers/route-nuwaraeliya-ella.webp'],
        seoTitle: 'Nuwara Eliya to Ella Private Transfer | Yatara Ceylon',
        seoDescription: 'Scenic private transfer from Nuwara Eliya to Ella through highland tea country. From LKR 14,500.',
        relatedSlugs: ['kandy-to-nuwara-eliya', 'ella-to-yala', 'colombo-airport-to-ella'],
    },
    {
        slug: 'ella-to-yala',
        title: 'Ella to Yala',
        subtitle: 'Hill-to-safari transfer descending from Ella\'s highlands into Yala\'s leopard territory.',
        transferType: 'INTERCITY',
        pickupLabel: 'Ella',
        dropoffLabel: 'Yala',
        duration: '2.5 hrs',
        distanceKm: 100,
        startingPriceLkr: 16500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Intercity transfer connecting Ella\'s highland valley to Yala safari lodges.',
        includes: ['Door-to-door pickup', 'Private chauffeur', 'Bottled water', 'Luggage handling', 'WhatsApp support'],
        bestFor: 'Hill-to-safari transfer',
        whyChoose: 'Natural itinerary continuation from highlands to wildlife. Shorter than many expect — just 2.5 hours from mountain views to safari gates.',
        heroImage: '/images/transfers/route-ella-yala.webp',
        gallery: ['/images/transfers/route-ella-yala.webp'],
        seoTitle: 'Ella to Yala Private Transfer | Yatara Ceylon',
        seoDescription: 'Private transfer from Ella to Yala National Park. Hills to safari. From LKR 16,500.',
        relatedSlugs: ['nuwara-eliya-to-ella', 'galle-to-yala', 'colombo-airport-to-yala'],
    },
    {
        slug: 'sigiriya-to-kandy',
        title: 'Sigiriya to Kandy',
        subtitle: 'Cultural route continuation from the rock fortress to the Temple of the Tooth gateway.',
        transferType: 'INTERCITY',
        pickupLabel: 'Sigiriya',
        dropoffLabel: 'Kandy',
        duration: '2.5–3 hrs',
        distanceKm: 90,
        startingPriceLkr: 15500,
        vehicleTierRecommended: 'executive',
        passengerCapacity: 2,
        luggageCapacity: 2,
        summary: 'Intercity transfer from Sigiriya through the cultural heartland to Kandy.',
        includes: ['Door-to-door pickup', 'Private chauffeur', 'Bottled water', 'Flexible stop requests', 'WhatsApp support'],
        bestFor: 'Cultural route continuation',
        whyChoose: 'Connects the two pillars of Sri Lanka\'s Cultural Triangle. Optional stops at Dambulla Cave Temple or spice gardens along the way.',
        heroImage: '/images/transfers/route-sigiriya-kandy.webp',
        gallery: ['/images/transfers/route-sigiriya-kandy.webp'],
        seoTitle: 'Sigiriya to Kandy Private Transfer | Yatara Ceylon',
        seoDescription: 'Private transfer from Sigiriya to Kandy. Cultural Triangle route. From LKR 15,500.',
        relatedSlugs: ['colombo-airport-to-sigiriya', 'colombo-airport-to-kandy', 'kandy-to-nuwara-eliya'],
    },
    {
        slug: 'trincomalee-to-sigiriya',
        title: 'Trincomalee to Sigiriya',
        subtitle: 'East coast to cultural heartland — connecting beach relaxation with ancient heritage.',
        transferType: 'INTERCITY',
        pickupLabel: 'Trincomalee',
        dropoffLabel: 'Sigiriya',
        duration: '2.5 hrs',
        distanceKm: 100,
        startingPriceLkr: 16500,
        vehicleTierRecommended: 'executive',
        passengerCapacity: 2,
        luggageCapacity: 2,
        summary: 'East coast to Cultural Triangle transfer connecting Trincomalee beaches to Sigiriya rock fortress.',
        includes: ['Door-to-door pickup', 'Private chauffeur', 'Bottled water', 'Luggage handling', 'WhatsApp support'],
        bestFor: 'East coast to cultural route',
        whyChoose: 'Bridges the gap between east coast beaches and the Cultural Triangle. A route few tourists do independently but one of the most rewarding connections.',
        heroImage: '/images/transfers/route-trinco-sigiriya.webp',
        gallery: ['/images/transfers/route-trinco-sigiriya.webp'],
        seoTitle: 'Trincomalee to Sigiriya Private Transfer | Yatara Ceylon',
        seoDescription: 'Private transfer from Trincomalee to Sigiriya. East coast to Cultural Triangle. From LKR 16,500.',
        relatedSlugs: ['sigiriya-to-kandy', 'colombo-airport-to-sigiriya'],
    },
    {
        slug: 'arugam-bay-to-ella',
        title: 'Arugam Bay to Ella',
        subtitle: 'Surf-to-hills transfer climbing from the east coast into Ella\'s highland valley.',
        transferType: 'INTERCITY',
        pickupLabel: 'Arugam Bay',
        dropoffLabel: 'Ella',
        duration: '3 hrs',
        distanceKm: 135,
        startingPriceLkr: 18500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Intercity transfer from Sri Lanka\'s premier surf coast to Ella\'s highland backpacker capital.',
        includes: ['Door-to-door pickup', 'Private chauffeur', 'Bottled water', 'Luggage handling', 'Flexible stop requests', 'WhatsApp support'],
        bestFor: 'Surf-to-hills travelers',
        whyChoose: 'One of the most underrated Sri Lanka connections. From board shorts to mountain mist in three hours through dramatic landscape changes.',
        heroImage: '/images/transfers/route-arugambay-ella.webp',
        gallery: ['/images/transfers/route-arugambay-ella.webp'],
        seoTitle: 'Arugam Bay to Ella Private Transfer | Yatara Ceylon',
        seoDescription: 'Private transfer from Arugam Bay to Ella. Surf to hills route. From LKR 18,500.',
        relatedSlugs: ['ella-to-yala', 'nuwara-eliya-to-ella', 'colombo-airport-to-ella'],
    },

    // ─── CHAUFFEUR RESERVE / DAY-USE / EVENT (19–22) ────────

    {
        slug: 'colombo-hourly-chauffeur',
        title: 'Colombo Hourly Chauffeur Reserve',
        subtitle: 'A flexible private-driver service for meetings, shopping, dining, and city movement.',
        transferType: 'HOURLY',
        pickupLabel: 'Central Colombo',
        dropoffLabel: 'Central Colombo',
        duration: '4 / 8 / 12 hrs',
        distanceKm: 0,
        startingPriceLkr: 9500,
        vehicleTierRecommended: 'executive',
        passengerCapacity: 2,
        luggageCapacity: 2,
        summary: 'Flexible hourly chauffeur service in Colombo with premium vehicle comfort and schedule control.',
        includes: ['Dedicated chauffeur', 'Flexible wait-and-move service', 'Central Colombo coverage', 'Bottled water', 'Direct coordination', 'WhatsApp support'],
        bestFor: 'Business, personal errands, flexible city use',
        whyChoose: 'Better than booking multiple fragmented rides. This keeps one polished service line for the whole day.',
        heroImage: '/images/transfers/route-colombo-hourly.webp',
        gallery: ['/images/transfers/route-colombo-hourly.webp', '/images/transfers/fleet-executive.webp'],
        seoTitle: 'Colombo Hourly Chauffeur Reserve | Yatara Ceylon',
        seoDescription: 'Flexible hourly chauffeur service in Colombo. From LKR 9,500 for 4 hours. Premium vehicle, dedicated driver.',
        relatedSlugs: ['colombo-airport-to-colombo-city', 'south-coast-day-chauffeur', 'wedding-event-chauffeur'],
    },
    {
        slug: 'south-coast-day-chauffeur',
        title: 'South Coast Day Chauffeur',
        subtitle: 'A full day of flexible south-coast movement — Bentota to Mirissa, your way.',
        transferType: 'HOURLY',
        pickupLabel: 'South Coast (Bentota / Galle / Ahangama / Mirissa)',
        dropoffLabel: 'South Coast (Bentota / Galle / Ahangama / Mirissa)',
        duration: '8 hrs',
        distanceKm: 0,
        startingPriceLkr: 22500,
        vehicleTierRecommended: 'prestige',
        passengerCapacity: 4,
        luggageCapacity: 4,
        summary: 'Full-day chauffeur service covering the south coast from Bentota to Mirissa with flexible stops.',
        includes: ['Dedicated chauffeur', '8-hour service block', 'South coast coverage', 'Bottled water', 'Flexible itinerary', 'WhatsApp support'],
        bestFor: 'Flexible coast day',
        whyChoose: 'Explore the south coast at your own pace. Beach hop, visit Galle Fort, stop for whale watching, lunch in Mirissa — all with one reliable vehicle and driver.',
        heroImage: '/images/transfers/route-southcoast-day.webp',
        gallery: ['/images/transfers/route-southcoast-day.webp'],
        seoTitle: 'South Coast Day Chauffeur | Yatara Ceylon',
        seoDescription: 'Full-day chauffeur service on Sri Lanka\'s south coast. Bentota to Mirissa coverage. From LKR 22,500.',
        relatedSlugs: ['colombo-hourly-chauffeur', 'colombo-airport-to-galle-fort', 'galle-to-yala'],
    },
    {
        slug: 'safari-day-transfer',
        title: 'Safari Day Transfer with Wait Time',
        subtitle: 'Hotel-to-park-to-hotel logistics with dedicated chauffeur standby during your safari.',
        transferType: 'SAFARI',
        pickupLabel: 'Hotel (Yala / Udawalawe region)',
        dropoffLabel: 'Hotel (Yala / Udawalawe region)',
        duration: '10 hrs',
        distanceKm: 0,
        startingPriceLkr: 29500,
        vehicleTierRecommended: 'grand',
        passengerCapacity: 7,
        luggageCapacity: 6,
        summary: 'Full safari day mobility — hotel to park entrance and back with dedicated chauffeur on standby.',
        includes: ['Dedicated chauffeur', 'Hotel-to-park transfer', 'Chauffeur standby during safari', 'Return transfer', 'Bottled water', 'Refreshment cooler', 'WhatsApp support'],
        bestFor: 'Yala / Udawalawe logistics',
        whyChoose: 'Removes all transport coordination from your safari day. Your chauffeur handles the timing, the waiting, and the return — you focus on wildlife.',
        heroImage: '/images/transfers/route-safari-day.webp',
        gallery: ['/images/transfers/route-safari-day.webp', '/images/transfers/fleet-grand.webp'],
        seoTitle: 'Safari Day Transfer with Wait Time | Yatara Ceylon',
        seoDescription: 'Full safari day transfer service for Yala and Udawalawe. Hotel-park-hotel with chauffeur standby. From LKR 29,500.',
        relatedSlugs: ['colombo-airport-to-yala', 'galle-to-yala', 'ella-to-yala'],
    },
    {
        slug: 'wedding-event-chauffeur',
        title: 'Wedding & Event Evening Chauffeur',
        subtitle: 'Formal evening transfers for weddings, dinners, and private events — polished and discreet.',
        transferType: 'EVENT',
        pickupLabel: 'Event Venue / Hotel',
        dropoffLabel: 'Event Venue / Hotel',
        duration: '5 hrs',
        distanceKm: 0,
        startingPriceLkr: 18500,
        vehicleTierRecommended: 'executive',
        passengerCapacity: 2,
        luggageCapacity: 2,
        summary: 'Elegant evening chauffeur service for formal events, weddings, and private dining occasions.',
        includes: ['Dedicated chauffeur', 'Formal dress code driver', 'Event venue pickup & drop', 'Chauffeur standby', 'Bottled water', 'WhatsApp support'],
        bestFor: 'Formal transfers, dinners, private events',
        whyChoose: 'Arrive in style and leave without worrying about transport. Your chauffeur waits discreetly throughout the event and handles the return.',
        heroImage: '/images/transfers/route-event-evening.webp',
        gallery: ['/images/transfers/route-event-evening.webp', '/images/transfers/fleet-executive.webp'],
        seoTitle: 'Wedding & Event Evening Chauffeur | Yatara Ceylon',
        seoDescription: 'Premium evening chauffeur for weddings, dinners, and events. Discreet, formal service. From LKR 18,500.',
        relatedSlugs: ['colombo-hourly-chauffeur', 'south-coast-day-chauffeur'],
    },
];

/* ═══════════════════════════════════════════════════════════
   TRANSFER CATEGORIES (for landing page type cards)
   ═══════════════════════════════════════════════════════════ */

export interface TransferCategoryCard {
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    icon: LucideIcon;
    image: string;
    startingFromLkr: number;
    typicalDuration: string;
    bestFor: string;
    transferTypes: TransferType[];
}

export const transferCategoryCards: TransferCategoryCard[] = [
    {
        slug: 'airport',
        title: 'Airport Arrivals & Departures',
        subtitle: 'Luxury airport pickups and hotel drop-offs with meet-and-greet, luggage assistance, and flight-aware dispatch.',
        description: 'From the moment you step off your flight, every detail is orchestrated — personal meet & greet at arrivals, expedited luggage handling, and a chauffeured passage to your destination in a premium vehicle.',
        icon: Plane,
        image: '/images/transfers/cat-airport.webp',
        startingFromLkr: 8500,
        typicalDuration: '25 min – 6 hrs',
        bestFor: 'First impressions, airport logistics',
        transferTypes: ['AIRPORT'],
    },
    {
        slug: 'intercity',
        title: 'Intercity Private Transfers',
        subtitle: 'Direct city-to-city transfers between Sri Lanka\'s key destinations in private comfort.',
        description: 'Move between Sri Lanka\'s iconic destinations in a premium vehicle with an experienced chauffeur who knows every scenic overlook, tea estate stop, and hidden temple worth a pause.',
        icon: Route,
        image: '/images/transfers/cat-intercity.webp',
        startingFromLkr: 14500,
        typicalDuration: '2 – 7 hrs',
        bestFor: 'Multi-destination trips',
        transferTypes: ['INTERCITY', 'SCENIC'],
    },
    {
        slug: 'hourly',
        title: 'Hourly Chauffeur Reserve',
        subtitle: 'Flexible vehicle and driver retention for meetings, events, shopping, or custom plans.',
        description: 'Complete flexibility — a personal chauffeur on retainer, available at your schedule, for as many stops, diversions, and spontaneous discoveries as your day holds.',
        icon: Clock,
        image: '/images/transfers/cat-chauffeur.webp',
        startingFromLkr: 9500,
        typicalDuration: '4 – 12 hrs',
        bestFor: 'Flexible schedules, day use',
        transferTypes: ['HOURLY'],
    },
    {
        slug: 'safari',
        title: 'Safari & National Park Transfers',
        subtitle: 'Park-ready transfers with chauffeur standby, timed for sunrise game drives and wildlife scheduling.',
        description: 'Navigate Sri Lanka\'s legendary national parks with a dedicated chauffeur who understands wildlife timing, park protocols, and the routes that deliver you to game drives at the perfect moment.',
        icon: TreePine,
        image: '/images/transfers/cat-wilderness.webp',
        startingFromLkr: 29500,
        typicalDuration: '8 – 10 hrs',
        bestFor: 'Wildlife enthusiasts',
        transferTypes: ['SAFARI'],
    },
    {
        slug: 'evening',
        title: 'Evening & Event Chauffeur',
        subtitle: 'Formal evening transfers for weddings, dinners, cultural events, and nightlife routing.',
        description: 'Experience Sri Lanka\'s vibrant evening scene with a personal chauffeur who knows every fine dining destination, rooftop bar, and cultural venue — with a guaranteed safe return.',
        icon: Wine,
        image: '/images/transfers/cat-evening.webp',
        startingFromLkr: 18500,
        typicalDuration: '3 – 6 hrs',
        bestFor: 'Events, dining, nightlife',
        transferTypes: ['EVENT'],
    },
];

/* ═══════════════════════════════════════════════════════════
   SIGNATURE ROUTES (top-level curated picks for landing page)
   ═══════════════════════════════════════════════════════════ */

export interface SignatureRoute {
    from: string;
    to: string;
    title: string;
    slug: string;
    transferType: TransferType;
    duration: string;
    distance: string;
    startingPriceLkr: number;
    vehicleTier: string;
    includes: string[];
    image: string;
}

export const signatureRoutes: SignatureRoute[] = [
    {
        from: 'CMB Airport',
        to: 'Colombo',
        title: 'Executive Arrival',
        slug: 'colombo-airport-to-colombo-city',
        transferType: 'AIRPORT',
        duration: '45 min',
        distance: '35 km',
        startingPriceLkr: 11500,
        vehicleTier: 'Executive',
        includes: ['Meet & greet', 'Flight tracking', 'Luggage handling'],
        image: '/images/transfers/route-cmb-colombo.webp',
    },
    {
        from: 'CMB Airport',
        to: 'Galle Fort',
        title: 'Coastal Arrival',
        slug: 'colombo-airport-to-galle-fort',
        transferType: 'AIRPORT',
        duration: '2.5 hrs',
        distance: '155 km',
        startingPriceLkr: 22500,
        vehicleTier: 'Prestige',
        includes: ['Meet & greet', 'Flight tracking', 'Water'],
        image: '/images/transfers/route-cmb-galle.webp',
    },
    {
        from: 'CMB Airport',
        to: 'Kandy',
        title: 'Hill Gateway',
        slug: 'colombo-airport-to-kandy',
        transferType: 'AIRPORT',
        duration: '3.5 hrs',
        distance: '120 km',
        startingPriceLkr: 19500,
        vehicleTier: 'Prestige',
        includes: ['Meet & greet', 'Flight tracking', 'Water'],
        image: '/images/transfers/route-cmb-kandy.webp',
    },
    {
        from: 'CMB Airport',
        to: 'Ella',
        title: 'Highland Passage',
        slug: 'colombo-airport-to-ella',
        transferType: 'AIRPORT',
        duration: '6 hrs',
        distance: '230 km',
        startingPriceLkr: 34500,
        vehicleTier: 'Prestige',
        includes: ['Meet & greet', 'Flight tracking', 'Flexible stops'],
        image: '/images/transfers/route-cmb-ella.webp',
    },
    {
        from: 'Kandy',
        to: 'Nuwara Eliya',
        title: 'Tea Country Ascent',
        slug: 'kandy-to-nuwara-eliya',
        transferType: 'SCENIC',
        duration: '2.5 hrs',
        distance: '80 km',
        startingPriceLkr: 14500,
        vehicleTier: 'Executive',
        includes: ['Scenic route', 'Flexible stops', 'Water'],
        image: '/images/transfers/route-kandy-nuwaraeliya.webp',
    },
    {
        from: 'Galle',
        to: 'Yala',
        title: 'Beach to Safari',
        slug: 'galle-to-yala',
        transferType: 'INTERCITY',
        duration: '3.5 hrs',
        distance: '165 km',
        startingPriceLkr: 22500,
        vehicleTier: 'Prestige',
        includes: ['Door-to-door', 'Flexible stops', 'Water'],
        image: '/images/transfers/route-galle-yala.webp',
    },
    {
        from: 'Colombo',
        to: 'Galle Fort',
        title: 'City to Coast',
        slug: 'colombo-to-galle-fort',
        transferType: 'INTERCITY',
        duration: '2.5 hrs',
        distance: '130 km',
        startingPriceLkr: 17500,
        vehicleTier: 'Executive',
        includes: ['Express route', 'Door-to-door', 'Water'],
        image: '/images/transfers/route-colombo-galle.webp',
    },
    {
        from: 'Ella',
        to: 'Yala',
        title: 'Hills to Safari',
        slug: 'ella-to-yala',
        transferType: 'INTERCITY',
        duration: '2.5 hrs',
        distance: '100 km',
        startingPriceLkr: 16500,
        vehicleTier: 'Prestige',
        includes: ['Door-to-door', 'Luggage handling', 'Water'],
        image: '/images/transfers/route-ella-yala.webp',
    },
];

/* ═══════════════════════════════════════════════════════════
   SERVICE PROMISES (What's Included strip)
   ═══════════════════════════════════════════════════════════ */

export interface ServicePromise {
    title: string;
    description: string;
    icon: string;
}

export const servicePromises: ServicePromise[] = [
    { title: 'Meet & Greet at Arrivals', description: 'Named greeter waiting at your terminal exit', icon: 'handshake' },
    { title: 'Flight Tracking', description: 'We monitor your flight — delays automatically adjusted', icon: 'plane-landing' },
    { title: 'Free Waiting Time', description: 'Up to 60 min complimentary airport wait buffer', icon: 'clock' },
    { title: 'Bottled Water', description: 'Chilled water and refreshments in every vehicle', icon: 'glass-water' },
    { title: 'Luggage Assistance', description: 'Porter service from terminal to vehicle', icon: 'luggage' },
    { title: '24/7 WhatsApp Support', description: 'Instant concierge access throughout your trip', icon: 'message-circle' },
];

/* ═══════════════════════════════════════════════════════════
   TRUST SIGNALS
   ═══════════════════════════════════════════════════════════ */

export const trustSignals = [
    { label: 'Licensed Chauffeurs', value: 'SLTDA Certified' },
    { label: 'Concierge Support', value: '24/7' },
    { label: 'Premium Fleet', value: 'Fully Insured' },
    { label: 'Service Standard', value: 'Discreet & Professional' },
];

/* ═══════════════════════════════════════════════════════════
   TRANSFER FAQ
   ═══════════════════════════════════════════════════════════ */

export interface TransferFAQ {
    question: string;
    answer: string;
}

export const transferFaq: TransferFAQ[] = [
    {
        question: 'What if my flight is delayed?',
        answer: 'We monitor all incoming flights in real time. Your chauffeur adjusts arrival time automatically — there is no extra charge for flight delays.',
    },
    {
        question: 'How does meet & greet work?',
        answer: 'A named greeter will be waiting at the international arrivals exit with a welcome sign displaying your name. They assist with luggage and escort you directly to your waiting vehicle.',
    },
    {
        question: 'Can I request a specific vehicle?',
        answer: 'Yes — select your preferred vehicle tier (Executive, Prestige, or Grand) during booking, or let our concierge recommend the best option based on your party size and route.',
    },
    {
        question: 'Is there a luggage limit?',
        answer: 'Each tier has a defined luggage capacity. Our Grand tier accommodates up to 6 large suitcases. For larger parties, we arrange additional vehicles seamlessly.',
    },
    {
        question: 'What is the cancellation policy?',
        answer: 'Free cancellation up to 24 hours before the scheduled pickup time. Cancellations within 24 hours may incur a partial charge.',
    },
    {
        question: 'Are prices fixed or metered?',
        answer: 'All transfer prices are fixed at the time of booking. There are no hidden charges, surge pricing, or meter-based surprises. The price you see is the price you pay.',
    },
    {
        question: 'Can I make stops along the way?',
        answer: 'One brief stop (ATM, pharmacy, viewing point) is complimentary on most routes. Additional stops or extended diversions can be arranged for a small supplement.',
    },
    {
        question: 'Do you provide child seats?',
        answer: 'Yes — rear-facing infant seats, forward-facing toddler seats, and booster seats are available on request. All are internationally certified. Please specify ages during booking.',
    },
    {
        question: 'How do I book?',
        answer: 'Submit a quote request through the form on this page, or contact our concierge via WhatsApp. You will receive booking confirmation with driver details within 24 hours.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards (Visa, Mastercard), bank transfers, and cash (LKR or USD). Payment can be made at booking or upon completion of the transfer.',
    },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

/** Get transfer product by slug */
export function getTransferBySlug(slug: string): TransferProduct | undefined {
    return transferProducts.find((t) => t.slug === slug);
}

/** Get transfers by type */
export function getTransfersByType(type: TransferType): TransferProduct[] {
    return transferProducts.filter((t) => t.transferType === type);
}

/** Get transfers matching category card */
export function getTransfersForCategory(categorySlug: string): TransferProduct[] {
    const category = transferCategoryCards.find((c) => c.slug === categorySlug);
    if (!category) return [];
    return transferProducts.filter((t) => category.transferTypes.includes(t.transferType));
}

/** Get vehicle tier by slug */
export function getVehicleTier(slug: string): VehicleTier | undefined {
    return vehicleTiers.find((v) => v.slug === slug);
}

/** Format LKR price */
export function formatLkr(amount: number): string {
    return `LKR ${amount.toLocaleString('en-LK')}`;
}

/** Get related transfers */
export function getRelatedTransfers(slug: string): TransferProduct[] {
    const transfer = getTransferBySlug(slug);
    if (!transfer) return [];
    return transfer.relatedSlugs
        .map((s) => getTransferBySlug(s))
        .filter((t): t is TransferProduct => t !== undefined);
}

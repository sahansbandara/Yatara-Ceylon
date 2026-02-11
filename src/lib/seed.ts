import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/toms';

async function seed() {
    console.log('🌱 Seeding database...');
    await mongoose.connect(MONGODB_URI);

    // --- User (Admin) ---
    const User = (await import('@/models/User')).default;
    const existingAdmin = await User.findOne({ email: 'admin@ceylonescapes.lk' });
    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash('Admin@123', 12);
        await User.create({
            name: 'Admin',
            email: 'admin@ceylonescapes.lk',
            phone: '+94771234567',
            passwordHash,
            role: 'ADMIN',
            status: 'ACTIVE',
        });
        console.log('✅ Admin user created (admin@ceylonescapes.lk / Admin@123)');
    } else {
        console.log('ℹ️  Admin user already exists');
    }

    // --- Packages ---
    const Package = (await import('@/models/Package')).default;
    const pkgCount = await Package.countDocuments();
    if (pkgCount === 0) {
        await Package.insertMany([
            {
                title: 'Cultural Triangle Explorer',
                slug: 'cultural-triangle-explorer',
                summary: 'Discover ancient cities, sacred temples, and UNESCO world heritage sites across Sri Lanka\'s Cultural Triangle.',
                duration: '5 Days / 4 Nights',
                itinerary: [
                    { day: 1, title: 'Arrival – Colombo', description: 'Airport pickup, city tour, check-in' },
                    { day: 2, title: 'Sigiriya & Dambulla', description: 'Climb Sigiriya Rock, visit Dambulla Cave Temple' },
                    { day: 3, title: 'Polonnaruwa', description: 'Ancient ruins & royal palace exploration' },
                    { day: 4, title: 'Kandy', description: 'Temple of the Tooth, cultural show, botanical gardens' },
                    { day: 5, title: 'Departure', description: 'Breakfast, airport transfer' },
                ],
                priceMin: 450,
                priceMax: 850,
                price: 650,
                rating: 4.8,
                reviewCount: 124,
                images: ['https://images.unsplash.com/photo-1586523969098-e54ca9c8dc13?w=800'],
                highlights: ['Sigiriya Rock Fortress', 'Dambulla Cave Temple', 'Temple of the Tooth', 'Botanical Gardens'],
                inclusions: ['Airport transfers', 'Hotel accommodation', 'Breakfast daily', 'English-speaking guide', 'Entrance fees'],
                exclusions: ['International flights', 'Travel insurance', 'Personal expenses', 'Tips'],
                tags: ['culture', 'heritage', 'UNESCO'],
                isPublished: true,
            },
            {
                title: 'Coastal Paradise Getaway',
                slug: 'coastal-paradise-getaway',
                summary: 'Sun, sand, and surf along Sri Lanka\'s stunning southern coastline from Galle to Mirissa.',
                duration: '4 Days / 3 Nights',
                itinerary: [
                    { day: 1, title: 'Arrival – Galle', description: 'Airport transfer, Galle Fort walk, sunset' },
                    { day: 2, title: 'Unawatuna & Jungle Beach', description: 'Beach day, snorkeling, seafood dinner' },
                    { day: 3, title: 'Mirissa', description: 'Whale watching (seasonal), beach relax' },
                    { day: 4, title: 'Departure', description: 'Breakfast, airport transfer' },
                ],
                priceMin: 350,
                priceMax: 700,
                price: 520,
                rating: 4.6,
                reviewCount: 89,
                images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
                highlights: ['Galle Fort', 'Whale Watching', 'Pristine Beaches', 'Snorkeling'],
                inclusions: ['Airport transfers', 'Beachfront hotel', 'Breakfast daily', 'Whale watching tour'],
                exclusions: ['International flights', 'Lunch & dinner', 'Personal expenses'],
                tags: ['beach', 'coastal', 'relaxation'],
                isPublished: true,
            },
            {
                title: 'Hill Country Tea Trail',
                slug: 'hill-country-tea-trail',
                summary: 'Journey through misty mountains, lush tea estates, and charming colonial-era hill stations.',
                duration: '3 Days / 2 Nights',
                itinerary: [
                    { day: 1, title: 'Kandy to Nuwara Eliya', description: 'Scenic train ride, tea plantation visit' },
                    { day: 2, title: 'Horton Plains', description: 'World\'s End hike, Hakgala Botanical Garden' },
                    { day: 3, title: 'Ella & Departure', description: 'Nine Arches Bridge, Little Adam\'s Peak, transfer' },
                ],
                priceMin: 280,
                priceMax: 550,
                price: 400,
                rating: 4.9,
                reviewCount: 203,
                images: ['https://images.unsplash.com/photo-1565600444-3a0a7da95830?w=800'],
                highlights: ['Scenic Train Ride', 'Tea Factory Visit', 'World\'s End', 'Nine Arches Bridge'],
                inclusions: ['Train tickets', 'Hotel accommodation', 'Breakfast daily', 'Guide', 'Entrance fees'],
                exclusions: ['Flights', 'Insurance', 'Tips'],
                tags: ['nature', 'tea', 'mountains', 'hiking'],
                isPublished: true,
            },
            {
                title: 'Wildlife Safari Adventure',
                slug: 'wildlife-safari-adventure',
                summary: 'Encounter leopards, elephants, and exotic birds in Sri Lanka\'s best national parks.',
                duration: '4 Days / 3 Nights',
                itinerary: [
                    { day: 1, title: 'Arrival to Yala', description: 'Airport transfer, check-in safari lodge' },
                    { day: 2, title: 'Yala National Park', description: 'Full-day jeep safari, leopard spotting' },
                    { day: 3, title: 'Udawalawe National Park', description: 'Elephant transit home, afternoon safari' },
                    { day: 4, title: 'Departure', description: 'Morning bird watching, airport transfer' },
                ],
                priceMin: 500,
                priceMax: 950,
                price: 720,
                rating: 4.7,
                reviewCount: 156,
                images: ['https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800'],
                highlights: ['Leopard Spotting', 'Elephant Herds', 'Bird Watching', 'Jeep Safari'],
                inclusions: ['Safari lodge', 'All meals', 'Jeep safaris', 'Park entrance', 'Guide'],
                exclusions: ['Flights', 'Insurance', 'Personal expenses'],
                tags: ['wildlife', 'safari', 'nature', 'adventure'],
                isPublished: true,
            },
        ]);
        console.log('✅ 4 sample packages created');
    }

    // --- Destinations ---
    const Destination = (await import('@/models/Destination')).default;
    const destCount = await Destination.countDocuments();
    if (destCount === 0) {
        await Destination.insertMany([
            { title: 'Sigiriya', slug: 'sigiriya', description: 'The iconic Lion Rock fortress, a UNESCO World Heritage Site rising 200m above the surrounding plains.', images: ['https://images.unsplash.com/photo-1586523969098-e54ca9c8dc13?w=800'], isPublished: true },
            { title: 'Galle Fort', slug: 'galle-fort', description: 'A fortified old-city founded by Portuguese colonists in the 16th century, a blend of European architecture and South Asian traditions.', images: ['https://images.unsplash.com/photo-1588258524675-47bfac2ee4d6?w=800'], isPublished: true },
            { title: 'Ella', slug: 'ella', description: 'A charming hill country town with breathtaking views, tea plantations, and the famous Nine Arches Bridge.', images: ['https://images.unsplash.com/photo-1565600444-3a0a7da95830?w=800'], isPublished: true },
            { title: 'Kandy', slug: 'kandy', description: 'The cultural capital of Sri Lanka, home to the sacred Temple of the Tooth Relic and surrounded by hills.', images: ['https://images.unsplash.com/photo-1580202528209-085b19dd1dd1?w=800'], isPublished: true },
            { title: 'Mirissa', slug: 'mirissa', description: 'A beautiful beach destination on the south coast, famous for whale watching and stunning sunsets.', images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'], isPublished: true },
            { title: 'Yala National Park', slug: 'yala-national-park', description: 'Sri Lanka\'s most visited national park with the highest leopard density in the world.', images: ['https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800'], isPublished: true },
        ]);
        console.log('✅ 6 sample destinations created');
    }

    // --- FAQs ---
    const FAQ = (await import('@/models/FAQ')).default;
    const faqCount = await FAQ.countDocuments();
    if (faqCount === 0) {
        await FAQ.insertMany([
            { question: 'What is the best time to visit Sri Lanka?', answer: 'Sri Lanka can be visited year-round. The west and south coasts are best from December to March, while the east coast is ideal from April to September.', isPublished: true },
            { question: 'Do I need a visa to visit Sri Lanka?', answer: 'Most nationalities can obtain an Electronic Travel Authorization (ETA) online before arrival, or a visa on arrival at the airport.', isPublished: true },
            { question: 'How do I book a custom tour?', answer: 'Use our Build Your Own Tour feature to select districts and places, or contact us via WhatsApp for a personalized itinerary.', isPublished: true },
            { question: 'What is included in tour packages?', answer: 'Our packages typically include accommodation, daily breakfast, airport transfers, entrance fees to attractions, and an English-speaking guide.', isPublished: true },
        ]);
        console.log('✅ 4 sample FAQs created');
    }

    // --- Testimonials ---
    const Testimonial = (await import('@/models/Testimonial')).default;
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
        await Testimonial.insertMany([
            { name: 'Sarah Johnson', rating: 5, comment: 'An absolutely magical experience! The Cultural Triangle tour exceeded all expectations. Our guide was knowledgeable and the accommodations were superb.', isPublished: true },
            { name: 'Marco Rossi', rating: 5, comment: 'The personalized service was exceptional. Every detail of our Coastal Paradise trip was perfectly arranged. Will definitely use Ceylon Escapes again!', isPublished: true },
            { name: 'Emma Williams', rating: 4, comment: 'The Hill Country Tea Trail was breathtaking. The scenic train ride alone was worth the entire trip. Highly recommended for nature lovers.', isPublished: true },
            { name: 'David Chen', rating: 5, comment: 'Our safari adventure was unforgettable! We spotted a leopard on our very first drive. The safari lodge was comfortable and the food was amazing.', isPublished: true },
        ]);
        console.log('✅ 4 sample testimonials created');
    }

    // --- Districts ---
    const District = (await import('@/models/District')).default;
    const distCount = await District.countDocuments();
    if (distCount === 0) {
        const districts = [
            'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
            'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
            'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
            'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
            'Monaragala', 'Ratnapura', 'Kegalle',
        ];
        await District.insertMany(
            districts.map((name) => ({
                name,
                geojsonId: name.toLowerCase().replace(/\s+/g, '_'),
                meta: {},
            }))
        );
        console.log('✅ 25 Sri Lanka districts created');
    }

    // --- Vehicles ---
    const Vehicle = (await import('@/models/Vehicle')).default;
    const vehCount = await Vehicle.countDocuments();
    if (vehCount === 0) {
        await Vehicle.insertMany([
            { type: 'CAR', model: 'Toyota Prius', seats: 3, luggage: 2, dailyRate: 45, status: 'AVAILABLE', features: ['AC', 'GPS', 'USB Charging'], images: [] },
            { type: 'VAN', model: 'Toyota KDH', seats: 8, luggage: 6, dailyRate: 85, status: 'AVAILABLE', features: ['AC', 'GPS', 'WiFi', 'Luggage Rack'], images: [] },
            { type: 'SUV', model: 'Mitsubishi Montero', seats: 5, luggage: 4, dailyRate: 75, status: 'AVAILABLE', features: ['AC', '4WD', 'GPS'], images: [] },
            { type: 'BUS', model: 'Rosa 29', seats: 29, luggage: 20, dailyRate: 150, status: 'AVAILABLE', features: ['AC', 'PA System', 'Luggage Compartment'], images: [] },
            { type: 'MINIBUS', model: 'Toyota Coaster', seats: 18, luggage: 12, dailyRate: 120, status: 'AVAILABLE', features: ['AC', 'GPS', 'Luggage Rack'], images: [] },
        ]);
        console.log('✅ 5 sample vehicles created');
    }

    console.log('🌱 Seed complete!');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});

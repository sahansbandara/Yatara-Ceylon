import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/toms';

function buildDemoDate(base: Date, dayOffset: number, hour = 10) {
    const next = new Date(base);
    next.setDate(next.getDate() + dayOffset);
    next.setHours(hour, 0, 0, 0);
    return next;
}

async function upsertRecord(
    model: mongoose.Model<any>,
    filter: Record<string, unknown>,
    values: Record<string, unknown>,
    options: {
        unset?: Record<string, unknown>;
        setOnInsert?: Record<string, unknown>;
    } = {}
) {
    const update: Record<string, unknown> = {
        $set: values,
    };

    if (options.unset && Object.keys(options.unset).length > 0) {
        update.$unset = options.unset;
    }

    if (options.setOnInsert && Object.keys(options.setOnInsert).length > 0) {
        update.$setOnInsert = options.setOnInsert;
    }

    return model.findOneAndUpdate(filter, update, {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
    });
}

async function seed() {
    console.log('🌱 Seeding database...');
    await mongoose.connect(MONGODB_URI);

    // --- Users (Demo Accounts) ---
    const User = (await import('@/models/User')).default;

    const demoAccounts = [
        { name: 'Admin', email: 'admin@yataraceylon.me', phone: '+94771234567', role: 'ADMIN', password: 'Admin@123' },
        { name: 'Concierge Staff', email: 'concierge@yataraceylon.me', phone: '+94771234568', role: 'STAFF', password: 'Concierge@123' },
        { name: 'Hotel Partner', email: 'hotel.partner@yataraceylon.me', phone: '+94771234569', role: 'HOTEL_OWNER', password: 'Hotel@123' },
        { name: 'Fleet Partner', email: 'fleet.partner@yataraceylon.me', phone: '+94771234570', role: 'VEHICLE_OWNER', password: 'Fleet@123' },
        { name: 'Customer Demo', email: 'customer1@yataraceylon.me', phone: '+94771234571', role: 'USER', password: 'Customer@123' },
        { name: 'Fleet Applicant', email: 'applicant.fleet@yataraceylon.me', phone: '+94771234572', role: 'USER', password: 'Applicant@123' },
        { name: 'Hotel Applicant', email: 'applicant.hotel@yataraceylon.me', phone: '+94771234573', role: 'USER', password: 'Applicant@123' },
        // Keep legacy admin for backward compatibility
        { name: 'Admin (Legacy)', email: 'admin@ceylonescapes.lk', phone: '+94771234567', role: 'ADMIN', password: 'Admin@123' },
    ];

    for (const account of demoAccounts) {
        const existing = await User.findOne({ email: account.email });
        const passwordHash = await bcrypt.hash(account.password, 12);

        await User.updateOne(
            { email: account.email },
            {
                $set: {
                    name: account.name,
                    email: account.email,
                    phone: account.phone,
                    passwordHash,
                    role: account.role,
                    status: 'ACTIVE',
                    emailVerified: true,
                    failedLoginAttempts: 0,
                    isDeleted: false,
                },
                $unset: {
                    lockedUntil: '',
                    deletedAt: '',
                    emailVerificationTokenHash: '',
                    emailVerificationExpires: '',
                    passwordResetTokenHash: '',
                    passwordResetExpires: '',
                },
            },
            { upsert: true }
        );

        console.log(
            `✅ ${account.role} user ${existing ? 'refreshed' : 'created'} (${account.email} / ${account.password})`
        );
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
            { name: 'Marco Rossi', rating: 5, comment: 'The personalized service was exceptional. Every detail of our Coastal Paradise trip was perfectly arranged. Will definitely use Yatara Ceylon again!', isPublished: true },
            { name: 'Emma Williams', rating: 4, comment: 'The Hill Country Tea Trail was breathtaking. The scenic train ride alone was worth the entire trip. Highly recommended for nature lovers.', isPublished: true },
            { name: 'David Chen', rating: 5, comment: 'Our safari adventure was unforgettable! We spotted a leopard on our very first drive. The safari lodge was comfortable and the food was amazing.', isPublished: true },
        ]);
        console.log('✅ 4 sample testimonials created');
    }

    // --- Districts ---
    const District = (await import('@/models/District')).default;
    const distCount = await District.countDocuments();
    if (distCount === 0) {
        const districtsWithProvinces = [
            { name: 'Colombo', province: 'Western' },
            { name: 'Gampaha', province: 'Western' },
            { name: 'Kalutara', province: 'Western' },
            { name: 'Kandy', province: 'Central' },
            { name: 'Matale', province: 'Central' },
            { name: 'Nuwara Eliya', province: 'Central' },
            { name: 'Galle', province: 'Southern' },
            { name: 'Matara', province: 'Southern' },
            { name: 'Hambantota', province: 'Southern' },
            { name: 'Jaffna', province: 'Northern' },
            { name: 'Kilinochchi', province: 'Northern' },
            { name: 'Mannar', province: 'Northern' },
            { name: 'Vavuniya', province: 'Northern' },
            { name: 'Mullaitivu', province: 'Northern' },
            { name: 'Batticaloa', province: 'Eastern' },
            { name: 'Ampara', province: 'Eastern' },
            { name: 'Trincomalee', province: 'Eastern' },
            { name: 'Kurunegala', province: 'North Western' },
            { name: 'Puttalam', province: 'North Western' },
            { name: 'Anuradhapura', province: 'North Central' },
            { name: 'Polonnaruwa', province: 'North Central' },
            { name: 'Badulla', province: 'Uva' },
            { name: 'Monaragala', province: 'Uva' },
            { name: 'Ratnapura', province: 'Sabaragamuwa' },
            { name: 'Kegalle', province: 'Sabaragamuwa' },
        ];
        await District.insertMany(
            districtsWithProvinces.map((d) => ({
                name: d.name,
                geojsonId: d.name.toLowerCase().replace(/\s+/g, '_'),
                province: d.province,
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

    // --- Rich Dashboard Demo Data ---
    const Partner = (await import('@/models/Partner')).default;
    const PartnerService = (await import('@/models/PartnerService')).default;
    const PartnerServiceBlock = (await import('@/models/PartnerServiceBlock')).default;
    const VehicleBlock = (await import('@/models/VehicleBlock')).default;
    const CustomPlan = (await import('@/models/CustomPlan')).default;
    const Booking = (await import('@/models/Booking')).default;
    const Invoice = (await import('@/models/Invoice')).default;
    const Payment = (await import('@/models/Payment')).default;
    const SupportTicket = (await import('@/models/SupportTicket')).default;
    const Notification = (await import('@/models/Notification')).default;
    const PartnerRequest = (await import('@/models/PartnerRequest')).default;
    const AuditLog = (await import('@/models/AuditLog')).default;

    const seededUsers = await User.find({
        email: { $in: demoAccounts.map((account) => account.email) },
    })
        .select('_id name email phone role')
        .lean();

    const usersByEmail = new Map(seededUsers.map((user: any) => [user.email, user]));
    const requireUser = (email: string) => {
        const user = usersByEmail.get(email);
        if (!user) {
            throw new Error(`Required demo user missing after seed: ${email}`);
        }
        return user;
    };

    const adminUser = requireUser('admin@yataraceylon.me');
    const staffUser = requireUser('concierge@yataraceylon.me');
    const hotelOwnerUser = requireUser('hotel.partner@yataraceylon.me');
    const fleetOwnerUser = requireUser('fleet.partner@yataraceylon.me');
    const customerUser = requireUser('customer1@yataraceylon.me');
    const fleetApplicantUser = requireUser('applicant.fleet@yataraceylon.me');
    const hotelApplicantUser = requireUser('applicant.hotel@yataraceylon.me');

    const publishedPackages = await Package.find({ isDeleted: { $ne: true } })
        .sort({ createdAt: 1 })
        .limit(3)
        .select('_id title slug')
        .lean();

    if (publishedPackages.length === 0) {
        throw new Error('Seed requires at least one package to create dashboard demo bookings');
    }

    const packageA = publishedPackages[0];
    const packageB = publishedPackages[1] || publishedPackages[0];
    const packageC = publishedPackages[2] || publishedPackages[0];

    const demoBaseDate = new Date();
    demoBaseDate.setHours(9, 0, 0, 0);

    const hotelPartner = await upsertRecord(
        Partner,
        { name: 'Yatara Ocean Villas', type: 'HOTEL' },
        {
            ownerId: hotelOwnerUser._id,
            type: 'HOTEL',
            name: 'Yatara Ocean Villas',
            contactPerson: 'Nadeesha Perera',
            phone: hotelOwnerUser.phone,
            email: hotelOwnerUser.email,
            address: 'No. 18, Pedlar Street, Galle Fort',
            status: 'ACTIVE',
            notes: 'Primary demo property for hotel-partner dashboard QA.',
            isDeleted: false,
        },
        { unset: { deletedAt: '' } }
    );

    await upsertRecord(
        Partner,
        { name: 'Emerald Chauffeurs Collective', type: 'DRIVER' },
        {
            ownerId: fleetOwnerUser._id,
            type: 'DRIVER',
            name: 'Emerald Chauffeurs Collective',
            contactPerson: 'Kasun Fernando',
            phone: fleetOwnerUser.phone,
            email: fleetOwnerUser.email,
            address: 'Negombo Road, Katunayake',
            status: 'ACTIVE',
            notes: 'Driver network used by dispatch and partner QA.',
            isDeleted: false,
        },
        { unset: { deletedAt: '' } }
    );

    await upsertRecord(
        Partner,
        { name: 'Temple Trails Private Guides', type: 'GUIDE' },
        {
            type: 'GUIDE',
            name: 'Temple Trails Private Guides',
            contactPerson: 'Lakmal Dias',
            phone: '+94775555111',
            email: 'guides@yataraceylon.me',
            address: 'Kandy Lake Road, Kandy',
            status: 'ACTIVE',
            notes: 'Guide roster demo record for admin partner management.',
            isDeleted: false,
        },
        { unset: { deletedAt: '' } }
    );

    await upsertRecord(
        Partner,
        { name: 'Sunset Spice Dining', type: 'RESTAURANT' },
        {
            type: 'RESTAURANT',
            name: 'Sunset Spice Dining',
            contactPerson: 'Tharushi Senanayake',
            phone: '+94776666222',
            email: 'bookings@sunsetspice.lk',
            address: 'Beach Road, Bentota',
            status: 'PENDING_APPROVAL',
            notes: 'Pending restaurant partner for approval workflow demos.',
            isDeleted: false,
        },
        { unset: { deletedAt: '' } }
    );

    const hotelServices = await Promise.all([
        upsertRecord(
            PartnerService,
            { partnerId: hotelPartner._id, serviceName: 'Ocean View Suite' },
            {
                partnerId: hotelPartner._id,
                serviceName: 'Ocean View Suite',
                rate: 85000,
                unit: 'PER_NIGHT',
                description: 'Premium suite with breakfast, sea-view balcony, and late checkout support.',
                isActive: true,
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            PartnerService,
            { partnerId: hotelPartner._id, serviceName: 'Half Board Upgrade' },
            {
                partnerId: hotelPartner._id,
                serviceName: 'Half Board Upgrade',
                rate: 9500,
                unit: 'PER_PERSON',
                description: 'Breakfast and curated dinner pairing for journey guests.',
                isActive: true,
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            PartnerService,
            { partnerId: hotelPartner._id, serviceName: 'Airport Welcome Desk' },
            {
                partnerId: hotelPartner._id,
                serviceName: 'Airport Welcome Desk',
                rate: 28000,
                unit: 'FLAT',
                description: 'Meet-and-greet coordination for VIP arrivals before property transfer.',
                isActive: true,
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
    ]);

    const [suiteService, boardService, welcomeDeskService] = hotelServices;

    const fleetVehicles = await Promise.all([
        upsertRecord(
            Vehicle,
            { plateNumber: 'YC-FLT-1001' },
            {
                ownerId: fleetOwnerUser._id,
                type: 'VAN',
                model: 'Toyota Super GL',
                plateNumber: 'YC-FLT-1001',
                seats: 8,
                luggage: 8,
                dailyRate: 32000,
                status: 'AVAILABLE',
                images: [],
                features: ['AC', 'USB Charging', 'Bottled Water', 'Child Seat Ready'],
                transferTypes: ['AIRPORT_PICKUP', 'AIRPORT_DROP', 'CITY_TOUR'],
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            Vehicle,
            { plateNumber: 'YC-FLT-1002' },
            {
                ownerId: fleetOwnerUser._id,
                type: 'SUV',
                model: 'Toyota Prado TX',
                plateNumber: 'YC-FLT-1002',
                seats: 5,
                luggage: 4,
                dailyRate: 45000,
                status: 'MAINTENANCE',
                images: [],
                features: ['4WD', 'AC', 'Leather Seats', 'Onboard WiFi'],
                transferTypes: ['AIRPORT_PICKUP', 'CITY_TOUR'],
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            Vehicle,
            { plateNumber: 'YC-FLT-APP1' },
            {
                ownerId: fleetApplicantUser._id,
                type: 'MINIBUS',
                model: 'Mercedes Sprinter Tourer',
                plateNumber: 'YC-FLT-APP1',
                seats: 12,
                luggage: 10,
                dailyRate: 68000,
                status: 'PENDING_APPROVAL',
                images: [],
                features: ['Panoramic Windows', 'AC', 'Recliner Seats'],
                transferTypes: ['AIRPORT_PICKUP', 'AIRPORT_DROP'],
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
    ]);

    const [fleetVehicleA, fleetVehicleB] = fleetVehicles;

    const customPlans = await Promise.all([
        upsertRecord(
            CustomPlan,
            { title: 'Southern Luxe Escape', userId: customerUser._id },
            {
                title: 'Southern Luxe Escape',
                userId: customerUser._id,
                customerName: customerUser.name,
                customerPhone: customerUser.phone,
                customerEmail: customerUser.email,
                days: [
                    { dayNo: 1, places: [], notes: 'Airport arrival and Galle Fort sunset walk' },
                    { dayNo: 2, places: [], notes: 'Bentota mangroves and private river safari' },
                    { dayNo: 3, places: [], notes: 'Mirissa beach club and whale watching briefing' },
                ],
                districtsUsed: ['Galle', 'Kalutara', 'Matara'],
                totalDays: 3,
                status: 'SAVED',
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            CustomPlan,
            { title: 'Tea Country Preview', userId: customerUser._id },
            {
                title: 'Tea Country Preview',
                userId: customerUser._id,
                customerName: customerUser.name,
                customerPhone: customerUser.phone,
                customerEmail: customerUser.email,
                days: [
                    { dayNo: 1, places: [], notes: 'Scenic drive to Nuwara Eliya and tea tasting' },
                    { dayNo: 2, places: [], notes: 'Horton Plains sunrise option and train to Ella' },
                ],
                districtsUsed: ['Nuwara Eliya', 'Badulla'],
                totalDays: 2,
                status: 'DRAFT',
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
    ]);

    const [southernPlan] = customPlans;

    const bookingFixtures = [
        {
            bookingNo: 'YC-DEMO-1001',
            customerName: customerUser.name,
            phone: customerUser.phone,
            email: customerUser.email,
            type: 'PACKAGE',
            packageId: packageA._id,
            customPlanId: null,
            vehicleId: null,
            pax: 2,
            pickupLocation: 'Bandaranaike International Airport',
            dates: { from: buildDemoDate(demoBaseDate, 18, 11), to: buildDemoDate(demoBaseDate, 20, 16) },
            status: 'NEW',
            assignedStaffId: null,
            assignedVehicleId: null,
            notes: 'Fresh inbound lead waiting for concierge review.',
            specialRequests: 'Quiet room and anniversary setup.',
            totalCost: 590000,
            paidAmount: 0,
            remainingBalance: 590000,
            isDeleted: false,
        },
        {
            bookingNo: 'YC-DEMO-1002',
            customerName: 'Daniel Mercer',
            phone: '+447700900111',
            email: 'daniel.mercer@example.com',
            type: 'PACKAGE',
            packageId: packageB._id,
            customPlanId: null,
            vehicleId: null,
            pax: 3,
            pickupLocation: 'Galle Fort Hotel',
            dates: { from: buildDemoDate(demoBaseDate, 24, 9), to: buildDemoDate(demoBaseDate, 26, 18) },
            status: 'CONTACTED',
            assignedStaffId: staffUser._id,
            assignedVehicleId: null,
            notes: 'Customer asked for revised departure timing and child seat confirmation.',
            specialRequests: 'Need two interconnected rooms.',
            totalCost: 210000,
            paidAmount: 0,
            remainingBalance: 210000,
            isDeleted: false,
        },
        {
            bookingNo: 'YC-DEMO-1003',
            customerName: customerUser.name,
            phone: customerUser.phone,
            email: customerUser.email,
            type: 'PACKAGE',
            packageId: packageB._id,
            customPlanId: null,
            vehicleId: null,
            pax: 2,
            pickupLocation: 'Colombo 07',
            dates: { from: buildDemoDate(demoBaseDate, 12, 8), to: buildDemoDate(demoBaseDate, 15, 18) },
            status: 'PAYMENT_PENDING',
            assignedStaffId: staffUser._id,
            assignedVehicleId: null,
            notes: 'Awaiting advance payment before final confirmation.',
            specialRequests: 'Prefers WhatsApp updates only.',
            totalCost: 320000,
            paidAmount: 0,
            remainingBalance: 320000,
            isDeleted: false,
        },
        {
            bookingNo: 'YC-DEMO-1004',
            customerName: customerUser.name,
            phone: customerUser.phone,
            email: customerUser.email,
            type: 'PACKAGE',
            packageId: packageC._id,
            customPlanId: null,
            vehicleId: null,
            pax: 4,
            pickupLocation: 'Negombo',
            dates: { from: buildDemoDate(demoBaseDate, 20, 9), to: buildDemoDate(demoBaseDate, 23, 18) },
            status: 'ADVANCE_PAID',
            assignedStaffId: staffUser._id,
            assignedVehicleId: null,
            notes: 'Advance received, pending final rooming confirmation.',
            specialRequests: 'Vegetarian meals for two guests.',
            totalCost: 440000,
            paidAmount: 120000,
            remainingBalance: 320000,
            isDeleted: false,
        },
        {
            bookingNo: 'YC-DEMO-1005',
            customerName: customerUser.name,
            phone: customerUser.phone,
            email: customerUser.email,
            type: 'PACKAGE',
            packageId: packageA._id,
            customPlanId: null,
            vehicleId: fleetVehicleA._id,
            pax: 2,
            pickupLocation: 'Bandaranaike International Airport',
            dates: { from: buildDemoDate(demoBaseDate, 5, 7), to: buildDemoDate(demoBaseDate, 8, 18) },
            status: 'CONFIRMED',
            assignedStaffId: staffUser._id,
            assignedVehicleId: fleetVehicleA._id,
            notes: 'Ready for hotel handoff and VIP welcome desk coordination.',
            specialRequests: 'Airport meet-and-greet signage required.',
            totalCost: 480000,
            paidAmount: 180000,
            remainingBalance: 300000,
            isDeleted: false,
        },
        {
            bookingNo: 'YC-DEMO-1006',
            customerName: 'Harini De Silva',
            phone: '+94775500001',
            email: 'harini.desilva@example.com',
            type: 'CUSTOM',
            packageId: null,
            customPlanId: southernPlan._id,
            vehicleId: fleetVehicleA._id,
            pax: 4,
            pickupLocation: 'Cinnamon Life Colombo',
            dates: { from: buildDemoDate(demoBaseDate, 9, 8), to: buildDemoDate(demoBaseDate, 11, 19) },
            status: 'ASSIGNED',
            assignedStaffId: staffUser._id,
            assignedVehicleId: fleetVehicleA._id,
            notes: 'Driver and itinerary confirmed, awaiting final hotel vouchers.',
            specialRequests: 'Needs child booster seat on day one.',
            totalCost: 265000,
            paidAmount: 100000,
            remainingBalance: 165000,
            isDeleted: false,
        },
        {
            bookingNo: 'YC-DEMO-1007',
            customerName: 'Rajiv Kapoor',
            phone: '+919810000222',
            email: 'rajiv.kapoor@example.com',
            type: 'VEHICLE',
            packageId: null,
            customPlanId: null,
            vehicleId: fleetVehicleA._id,
            pax: 3,
            pickupLocation: 'Shangri-La Colombo',
            dates: { from: buildDemoDate(demoBaseDate, -1, 9), to: buildDemoDate(demoBaseDate, 1, 21) },
            status: 'IN_PROGRESS',
            assignedStaffId: staffUser._id,
            assignedVehicleId: fleetVehicleA._id,
            notes: 'Multi-day chauffeur hire currently active.',
            specialRequests: 'Client requested flexible city-tour timing.',
            totalCost: 98000,
            paidAmount: 98000,
            remainingBalance: 0,
            isDeleted: false,
        },
        {
            bookingNo: 'YC-DEMO-1008',
            customerName: customerUser.name,
            phone: customerUser.phone,
            email: customerUser.email,
            type: 'PACKAGE',
            packageId: packageB._id,
            customPlanId: null,
            vehicleId: null,
            pax: 2,
            pickupLocation: 'Mirissa',
            dates: { from: buildDemoDate(demoBaseDate, -21, 10), to: buildDemoDate(demoBaseDate, -18, 17) },
            status: 'COMPLETED',
            assignedStaffId: staffUser._id,
            assignedVehicleId: fleetVehicleA._id,
            notes: 'Completed successfully with positive guest feedback.',
            specialRequests: 'Requested photo-stop detour on return transfer.',
            totalCost: 370000,
            paidAmount: 370000,
            remainingBalance: 0,
            isDeleted: false,
        },
        {
            bookingNo: 'YC-DEMO-1009',
            customerName: 'Melissa Hart',
            phone: '+61400000123',
            email: 'melissa.hart@example.com',
            type: 'PACKAGE',
            packageId: packageC._id,
            customPlanId: null,
            vehicleId: null,
            pax: 2,
            pickupLocation: 'Bentota',
            dates: { from: buildDemoDate(demoBaseDate, 28, 12), to: buildDemoDate(demoBaseDate, 30, 16) },
            status: 'CANCELLED',
            assignedStaffId: staffUser._id,
            assignedVehicleId: null,
            notes: 'Cancelled by guest due to flight change.',
            specialRequests: 'No replacement dates requested.',
            totalCost: 180000,
            paidAmount: 0,
            remainingBalance: 180000,
            isDeleted: false,
        },
    ];

    const bookingsByNo = new Map<string, any>();
    for (const booking of bookingFixtures) {
        const doc = await upsertRecord(
            Booking,
            { bookingNo: booking.bookingNo },
            booking,
            { unset: { deletedAt: '' } }
        );
        bookingsByNo.set(booking.bookingNo, doc);
    }

    const confirmedBooking = bookingsByNo.get('YC-DEMO-1005');
    const assignedBooking = bookingsByNo.get('YC-DEMO-1006');
    const inProgressBooking = bookingsByNo.get('YC-DEMO-1007');
    const paymentPendingBooking = bookingsByNo.get('YC-DEMO-1003');
    const completedBooking = bookingsByNo.get('YC-DEMO-1008');

    await upsertRecord(
        PartnerServiceBlock,
        { serviceId: suiteService._id, reason: 'RENOVATION' },
        {
            serviceId: suiteService._id,
            from: buildDemoDate(demoBaseDate, 14, 12),
            to: buildDemoDate(demoBaseDate, 17, 10),
            reason: 'RENOVATION',
        }
    );

    await upsertRecord(
        PartnerServiceBlock,
        { serviceId: welcomeDeskService._id, reason: 'OTHER' },
        {
            serviceId: welcomeDeskService._id,
            from: buildDemoDate(demoBaseDate, 6, 6),
            to: buildDemoDate(demoBaseDate, 6, 22),
            reason: 'OTHER',
        }
    );

    await upsertRecord(
        VehicleBlock,
        { bookingId: confirmedBooking._id },
        {
            vehicleId: fleetVehicleA._id,
            from: confirmedBooking.dates.from,
            to: confirmedBooking.dates.to,
            reason: 'BOOKING',
            bookingId: confirmedBooking._id,
        }
    );

    await upsertRecord(
        VehicleBlock,
        { vehicleId: fleetVehicleB._id, reason: 'MAINTENANCE' },
        {
            vehicleId: fleetVehicleB._id,
            from: buildDemoDate(demoBaseDate, 3, 8),
            to: buildDemoDate(demoBaseDate, 6, 18),
            reason: 'MAINTENANCE',
        }
    );

    const invoices = await Promise.all([
        upsertRecord(
            Invoice,
            { invoiceNo: 'INV-DEMO-1005' },
            {
                bookingId: confirmedBooking._id,
                invoiceNo: 'INV-DEMO-1005',
                items: [
                    { label: 'Journey package balance', qty: 1, unitPrice: 420000 },
                    { label: 'Airport concierge add-on', qty: 1, unitPrice: 60000 },
                ],
                subtotal: 480000,
                discount: 0,
                total: 480000,
                advanceRequired: 180000,
                status: 'FINAL',
                notes: 'Deposit received, balance due before departure.',
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            Invoice,
            { invoiceNo: 'INV-DEMO-1006' },
            {
                bookingId: assignedBooking._id,
                invoiceNo: 'INV-DEMO-1006',
                items: [
                    { label: 'Custom itinerary transport', qty: 1, unitPrice: 210000 },
                    { label: 'Partner service coordination', qty: 1, unitPrice: 55000 },
                ],
                subtotal: 265000,
                discount: 0,
                total: 265000,
                advanceRequired: 100000,
                status: 'FINAL',
                notes: 'Awaiting final supplier confirmations.',
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            Invoice,
            { invoiceNo: 'INV-DEMO-1003' },
            {
                bookingId: paymentPendingBooking._id,
                invoiceNo: 'INV-DEMO-1003',
                items: [
                    { label: 'Coastal getaway package', qty: 1, unitPrice: 320000 },
                ],
                subtotal: 320000,
                discount: 0,
                total: 320000,
                advanceRequired: 160000,
                status: 'DRAFT',
                notes: 'Advance invoice pending guest checkout link.',
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            Invoice,
            { invoiceNo: 'INV-DEMO-1008' },
            {
                bookingId: completedBooking._id,
                invoiceNo: 'INV-DEMO-1008',
                items: [
                    { label: 'Completed coastal package', qty: 1, unitPrice: 370000 },
                ],
                subtotal: 370000,
                discount: 0,
                total: 370000,
                advanceRequired: 0,
                status: 'FINAL',
                notes: 'Settled in full.',
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
    ]);

    const invoicesByNo = new Map<string, any>(invoices.map((invoice: any) => [invoice.invoiceNo, invoice]));

    await Promise.all([
        upsertRecord(
            Payment,
            { orderId: 'PAY-DEMO-1005' },
            {
                bookingId: confirmedBooking._id,
                invoiceId: invoicesByNo.get('INV-DEMO-1005')._id,
                amount: 180000,
                provider: 'MANUAL',
                status: 'SUCCESS',
                orderId: 'PAY-DEMO-1005',
                method: 'BANK',
                paidAt: buildDemoDate(demoBaseDate, -2, 15),
                reference: 'BANK-ADV-1005',
                type: 'PAYMENT',
                notes: 'Advance collected via bank transfer.',
                recordedBy: adminUser._id,
                isDeleted: false,
            },
            { unset: { deletedAt: '', voidedAt: '' } }
        ),
        upsertRecord(
            Payment,
            { orderId: 'PAY-DEMO-1006' },
            {
                bookingId: assignedBooking._id,
                invoiceId: invoicesByNo.get('INV-DEMO-1006')._id,
                amount: 100000,
                provider: 'PAYHERE',
                status: 'SUCCESS',
                orderId: 'PAY-DEMO-1006',
                method: 'ONLINE',
                paidAt: buildDemoDate(demoBaseDate, -1, 13),
                reference: 'PH-ASSIGN-1006',
                type: 'PAYMENT',
                notes: 'Advance paid through PayHere sandbox.',
                recordedBy: staffUser._id,
                isDeleted: false,
            },
            { unset: { deletedAt: '', voidedAt: '' } }
        ),
        upsertRecord(
            Payment,
            { orderId: 'PAY-DEMO-1003' },
            {
                bookingId: paymentPendingBooking._id,
                invoiceId: invoicesByNo.get('INV-DEMO-1003')._id,
                amount: 160000,
                provider: 'PAYHERE',
                status: 'PENDING',
                orderId: 'PAY-DEMO-1003',
                method: 'ONLINE',
                reference: 'PH-PENDING-1003',
                type: 'PAYMENT',
                notes: 'Payment link sent, awaiting guest completion.',
                recordedBy: staffUser._id,
                isDeleted: false,
            },
            { unset: { deletedAt: '', paidAt: '', voidedAt: '' } }
        ),
        upsertRecord(
            Payment,
            { orderId: 'PAY-DEMO-1008' },
            {
                bookingId: completedBooking._id,
                invoiceId: invoicesByNo.get('INV-DEMO-1008')._id,
                amount: 370000,
                provider: 'MANUAL',
                status: 'SUCCESS',
                orderId: 'PAY-DEMO-1008',
                method: 'CASH',
                paidAt: buildDemoDate(demoBaseDate, -18, 18),
                reference: 'CASH-FULL-1008',
                type: 'PAYMENT',
                notes: 'Final settlement collected on departure.',
                recordedBy: adminUser._id,
                isDeleted: false,
            },
            { unset: { deletedAt: '', voidedAt: '' } }
        ),
    ]);

    await Promise.all([
        upsertRecord(
            SupportTicket,
            { email: customerUser.email, subject: 'Arrival signage for YC-DEMO-1005' },
            {
                customerName: customerUser.name,
                phone: customerUser.phone,
                email: customerUser.email,
                subject: 'Arrival signage for YC-DEMO-1005',
                message: 'Please make sure the airport rep holds a sign with our surname on arrival.',
                bookingId: confirmedBooking._id,
                status: 'OPEN',
                replies: [],
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            SupportTicket,
            { email: customerUser.email, subject: 'Payment receipt missing for YC-DEMO-1003' },
            {
                customerName: customerUser.name,
                phone: customerUser.phone,
                email: customerUser.email,
                subject: 'Payment receipt missing for YC-DEMO-1003',
                message: 'I received the payment link but not the invoice PDF. Can you resend it?',
                bookingId: paymentPendingBooking._id,
                status: 'REPLIED',
                replies: [
                    {
                        byUserId: staffUser._id,
                        byName: staffUser.name,
                        body: 'We have reissued the invoice and sent a fresh PayHere link to your email.',
                        at: buildDemoDate(demoBaseDate, 0, 14),
                    },
                ],
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            SupportTicket,
            { email: 'rajiv.kapoor@example.com', subject: 'Add whale watching to active transfer' },
            {
                customerName: 'Rajiv Kapoor',
                phone: '+919810000222',
                email: 'rajiv.kapoor@example.com',
                subject: 'Add whale watching to active transfer',
                message: 'Can today\'s chauffeur booking include a Mirissa whale watching stop tomorrow morning?',
                bookingId: inProgressBooking._id,
                status: 'CLOSED',
                replies: [
                    {
                        byUserId: staffUser._id,
                        byName: staffUser.name,
                        body: 'Confirmed. The dispatch team updated the itinerary and the guest was notified.',
                        at: buildDemoDate(demoBaseDate, 0, 16),
                    },
                ],
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
    ]);

    await Promise.all([
        upsertRecord(
            Notification,
            { title: 'Peak-season inventory alert' },
            {
                title: 'Peak-season inventory alert',
                body: 'High-demand dates in the south coast are moving fast. Review remaining room and vehicle availability this week.',
                type: 'ALERT',
                visibleTo: 'ALL',
                isPublished: true,
                publishFrom: buildDemoDate(demoBaseDate, -1, 7),
                publishTo: buildDemoDate(demoBaseDate, 30, 23),
                createdBy: adminUser._id,
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            Notification,
            { title: 'Hotel partner rate refresh' },
            {
                title: 'Hotel partner rate refresh',
                body: 'Please review your June and July rate cards before new itinerary proposals are sent out.',
                type: 'UPDATE',
                visibleTo: 'HOTEL_OWNERS',
                isPublished: true,
                publishFrom: buildDemoDate(demoBaseDate, -2, 8),
                publishTo: buildDemoDate(demoBaseDate, 21, 23),
                createdBy: adminUser._id,
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            Notification,
            { title: 'Fleet dispatch briefing' },
            {
                title: 'Fleet dispatch briefing',
                body: 'Tomorrow\'s airport rotations have been updated with revised pickup signage and guest notes.',
                type: 'UPDATE',
                visibleTo: 'VEHICLE_OWNERS',
                isPublished: true,
                publishFrom: buildDemoDate(demoBaseDate, -1, 8),
                publishTo: buildDemoDate(demoBaseDate, 14, 23),
                createdBy: staffUser._id,
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
        upsertRecord(
            Notification,
            { title: 'Private journey add-on offer' },
            {
                title: 'Private journey add-on offer',
                body: 'Customers who confirm before Friday can add a private airport lounge transfer at a preferred rate.',
                type: 'OFFER',
                visibleTo: 'CUSTOMERS',
                isPublished: true,
                publishFrom: buildDemoDate(demoBaseDate, 0, 9),
                publishTo: buildDemoDate(demoBaseDate, 10, 23),
                createdBy: adminUser._id,
                isDeleted: false,
            },
            { unset: { deletedAt: '' } }
        ),
    ]);

    await Promise.all([
        upsertRecord(
            PartnerRequest,
            { userId: hotelOwnerUser._id, requestType: 'HOTEL_OWNER' },
            {
                userId: hotelOwnerUser._id,
                requestType: 'HOTEL_OWNER',
                status: 'APPROVED',
                businessName: 'Yatara Ocean Villas',
                contactNumber: hotelOwnerUser.phone,
                verificationLink: 'https://example.com/hotel-owner-verification',
                hotelDetails: { location: 'Galle Fort' },
            }
        ),
        upsertRecord(
            PartnerRequest,
            { userId: fleetApplicantUser._id, requestType: 'VEHICLE_OWNER' },
            {
                userId: fleetApplicantUser._id,
                requestType: 'VEHICLE_OWNER',
                status: 'PENDING',
                businessName: 'Luxe Arrival Transfers',
                contactNumber: fleetApplicantUser.phone,
                verificationLink: 'https://example.com/fleet-owner-verification',
                vehicleDetails: {
                    brand: 'Mercedes',
                    model: 'Sprinter',
                    vehicleNumber: 'APP-7788',
                },
            }
        ),
        upsertRecord(
            PartnerRequest,
            { userId: hotelApplicantUser._id, requestType: 'HOTEL_OWNER' },
            {
                userId: hotelApplicantUser._id,
                requestType: 'HOTEL_OWNER',
                status: 'REJECTED',
                businessName: 'Cliffside Rooms Mirissa',
                contactNumber: hotelApplicantUser.phone,
                verificationLink: 'https://example.com/rejected-hotel-owner-verification',
                hotelDetails: { location: 'Mirissa' },
            }
        ),
    ]);

    await Promise.all([
        upsertRecord(
            AuditLog,
            { action: 'BOOKING_CONFIRMED', entity: 'BOOKING', entityId: String(confirmedBooking._id) },
            {
                actorUserId: String(staffUser._id),
                action: 'BOOKING_CONFIRMED',
                entity: 'BOOKING',
                entityId: String(confirmedBooking._id),
                meta: { bookingNo: confirmedBooking.bookingNo, source: 'seed-demo-data' },
                ip: '127.0.0.1',
                at: buildDemoDate(demoBaseDate, 0, 9),
            }
        ),
        upsertRecord(
            AuditLog,
            { action: 'PARTNER_REQUEST_APPROVED', entity: 'PARTNER_REQUEST', entityId: String(hotelOwnerUser._id) },
            {
                actorUserId: String(adminUser._id),
                action: 'PARTNER_REQUEST_APPROVED',
                entity: 'PARTNER_REQUEST',
                entityId: String(hotelOwnerUser._id),
                meta: { businessName: 'Yatara Ocean Villas', source: 'seed-demo-data' },
                ip: '127.0.0.1',
                at: buildDemoDate(demoBaseDate, 0, 10),
            }
        ),
        upsertRecord(
            AuditLog,
            { action: 'PAYMENT_RECORDED', entity: 'PAYMENT', entityId: 'PAY-DEMO-1005' },
            {
                actorUserId: String(adminUser._id),
                action: 'PAYMENT_RECORDED',
                entity: 'PAYMENT',
                entityId: 'PAY-DEMO-1005',
                meta: { amount: 180000, bookingNo: confirmedBooking.bookingNo, source: 'seed-demo-data' },
                ip: '127.0.0.1',
                at: buildDemoDate(demoBaseDate, 0, 11),
            }
        ),
        upsertRecord(
            AuditLog,
            { action: 'SERVICE_BLOCKED', entity: 'PARTNER_SERVICE', entityId: String(suiteService._id) },
            {
                actorUserId: String(adminUser._id),
                action: 'SERVICE_BLOCKED',
                entity: 'PARTNER_SERVICE',
                entityId: String(suiteService._id),
                meta: { reason: 'RENOVATION', source: 'seed-demo-data' },
                ip: '127.0.0.1',
                at: buildDemoDate(demoBaseDate, 0, 12),
            }
        ),
        upsertRecord(
            AuditLog,
            { action: 'VEHICLE_BLOCKED', entity: 'VEHICLE', entityId: String(fleetVehicleB._id) },
            {
                actorUserId: String(staffUser._id),
                action: 'VEHICLE_BLOCKED',
                entity: 'VEHICLE',
                entityId: String(fleetVehicleB._id),
                meta: { reason: 'MAINTENANCE', plateNumber: fleetVehicleB.plateNumber, source: 'seed-demo-data' },
                ip: '127.0.0.1',
                at: buildDemoDate(demoBaseDate, 0, 13),
            }
        ),
    ]);

    console.log('✅ Rich dashboard demo data refreshed for hotel, fleet, finance, support, notifications, analytics, and customer dashboards');

    console.log('🌱 Seed complete!');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});

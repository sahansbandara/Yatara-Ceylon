
import slugify from 'slugify';

process.loadEnvFile('.env.local');

// --- Raw Data ---

const colomboDeals = [
    {
        title: "Colombo Airport to Yala",
        price: 26460,
        image: "https://dxk1acp76n912.cloudfront.net/images/yalasafaritaxi.png",
        link: "https://lesstaxi.com/deal/colombo_airport_colombo_airport_to_yala"
    },
    {
        title: "Colombo Airport to Negombo",
        price: 3240,
        image: "https://dxk1acp76n912.cloudfront.net/images/negomboairport.png",
        link: "https://lesstaxi.com/deal/colombo_airport_colombo_airport_to_negombo_cash_on_arrival_available_"
    },
    {
        title: "Colombo Airport to Weligama/Ahangama",
        price: 17820,
        image: "https://dxk1acp76n912.cloudfront.net/images/weligamahangamataxi.png",
        link: "https://lesstaxi.com/deal/colombo_airport_to_weligamaahangama_cash_on_arrival_available"
    },
    {
        title: "Colombo Airport to Hiriketiya",
        price: 18180,
        image: "https://dxk1acp76n912.cloudfront.net/images/hiriketiya-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_to_hiriketiya_taxi"
    },
    {
        title: "Colombo Airport to Kalpitiya",
        price: 14220,
        image: "https://dxk1acp76n912.cloudfront.net/images/Copy+of+MAIN+TAXI+THUMB+KALPITIYA.png",
        link: "https://lesstaxi.com/deal/colombo_airport_to_kalpitiya"
    },
    {
        title: "Colombo Airport to Sigiriya",
        price: 16920,
        image: "https://dxk1acp76n912.cloudfront.net/images/airporttosigiriya.png",
        link: "https://lesstaxi.com/deal/colombo_airport_to_sigiriya_cash_on_arrival_available_taxi"
    },
    {
        title: "Colombo Airport to Bentota",
        price: 13140,
        image: "https://dxk1acp76n912.cloudfront.net/images/bentotataxi-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_colombo_airport_to_bentota_cash_on_arrival_available_"
    },
    {
        title: "Colombo Airport to Galle",
        price: 19980,
        image: "https://dxk1acp76n912.cloudfront.net/images/galletaxithumb-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_colombo_airport_to_galle_cash_on_arrival_available"
    },
    {
        title: "Colombo Airport to Kandy",
        price: 14940,
        image: "https://dxk1acp76n912.cloudfront.net/images/KANDYTAXITHUMB-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_to_kandy_taxi"
    },
    {
        title: "Colombo Airport to Trincomalee",
        price: 25380,
        image: "https://dxk1acp76n912.cloudfront.net/images/trincomaleetaxi-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_to_trincomalee_cash_on_arrival_available"
    },
    {
        title: "Colombo Airport to Ella",
        price: 27540,
        image: "https://dxk1acp76n912.cloudfront.net/images/ellamain.png",
        link: "https://lesstaxi.com/deal/colombo_airport_to_ella_cash_on_arrival_available"
    },
    {
        title: "Colombo Airport To Pinnawala",
        price: 15660,
        image: "https://dxk1acp76n912.cloudfront.net/images/pinnawalamaintaximin.png",
        link: "https://lesstaxi.com/deal/colombo_airport_colombo_airport_to_pinnawala_cash_on_arrival_available_"
    },
    {
        title: "Colombo Airport to Hikkaduwa",
        price: 16020,
        image: "https://dxk1acp76n912.cloudfront.net/images/hikkaduwataximain.png",
        link: "https://lesstaxi.com/deal/colombo_airport_colombo_airport_to_hikkaduwa_cash_on_arrival_available_"
    },
    {
        title: "Arugambay to Colombo Airport",
        price: 26820,
        image: "https://dxk1acp76n912.cloudfront.net/images/arugambaytaxitrans-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_arugambay_to_colombo_airport_cash_on_arrival_available_"
    },
    {
        title: "Hiriketiya to Colombo Airport",
        price: 18900,
        image: "https://dxk1acp76n912.cloudfront.net/images/hiriketiya-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_hiriketiya_to_colombo_airport_cash_on_arrival_available_"
    },
    {
        title: "Colombo Airport to Wilpattu (Nochchiyagama)",
        price: 18180,
        image: "https://dxk1acp76n912.cloudfront.net/images/willapttu-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_colombo_airport_to_wilpattu_nochchiyagama_cash_on_arrival_available_"
    },
    {
        title: "Anuradhapura to Colombo Airport",
        price: 18180,
        image: "https://dxk1acp76n912.cloudfront.net/images/anuradhapurataxi-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_anuradhapura_to_colombo_airport_cash_on_arrival_available_"
    },
    {
        title: "Hikkaduwa to Colombo Airport",
        price: 16560,
        image: "https://dxk1acp76n912.cloudfront.net/images/hikkaduwa-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_hikkaduwa_to_colombo_airport_cash_on_arrival_available_"
    },
    {
        title: "Bentota to Colombo Airport",
        price: 15480,
        image: "https://dxk1acp76n912.cloudfront.net/images/bentotatxinew-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_bentota_to_colombo_airport_cash_on_arrival_available_"
    },
    {
        title: "Trincomalee to Colombo Airport",
        price: 26280,
        image: "https://dxk1acp76n912.cloudfront.net/images/trincomaleetaxi-min.png",
        link: "https://lesstaxi.com/deal/colombo_airport_trincomalee_to_colombo_airport_cash_on_arrival_available_"
    }
];

const homeDestinations = [
    {
        title: "Sigiriya",
        image: "https://dxk1acp76n912.cloudfront.net/images/homepageImg/image1.jpeg",
        description: "Ascend the Lion Rock; find your ancient view."
    },
    {
        title: "Nuwara Eliya",
        image: "https://dxk1acp76n912.cloudfront.net/images/homepageImg/image2.jpeg",
        description: "Sip Ceylon tea amidst breathtaking, misty valleys"
    },
    {
        title: "Negombo",
        image: "https://dxk1acp76n912.cloudfront.net/images/homepageImg/image3.jpeg",
        description: "Unwind by the lagoon; taste the island life"
    },
    {
        title: "Trincomalee",
        image: "https://dxk1acp76n912.cloudfront.net/images/homepageImg/image4.jpeg",
        description: "Relax on pristine sand, dive into blue paradise"
    },
    {
        title: "Hiriketiya",
        image: "https://dxk1acp76n912.cloudfront.net/images/homepageImg/image5.jpeg",
        description: "Grab your board and catch the perfect wave"
    },
    {
        title: "Colombo",
        image: "https://dxk1acp76n912.cloudfront.net/images/homepageImg/image6.jpeg",
        description: "Explore a dynamic city where your adventure begins"
    }
];

const otherDeals = [
    {
        title: "Trincomalee Scuba Diving in Trincomalee Dutch Bay",
        price: 27000,
        image: "https://lh3.googleusercontent.com/p/AF1QipOw2V1hDMk91tn3MIrm36LAHGg28vjJrE6uQA17=w298-h298-k-no",
    },
    {
        title: "Madu River Safari",
        price: 11160,
        image: "https://dxk1acp76n912.cloudfront.net/images/jaliya1-min.png",
    },
    {
        title: "Snorkeling in Trincomalee Dutch Fort Trincomalee",
        price: 7920,
        image: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0e/fc/15/2b.jpg",
    },
    {
        title: "Whales & Waves Mirissa",
        price: 7740,
        image: "https://dxk1acp76n912.cloudfront.net/images/chamindawhalewatching.jpg",
    },
    {
        title: "Trincomalee Whales & Waves Trincomalee",
        price: 34740,
        image: "https://overatours.com/wp-content/uploads/2020/09/Sri-Lanka-Travel-Packages-1-scaled-1-1000x750.jpg",
    },
    {
        title: "Sigiriya to Kandy Taxi",
        price: 14040,
        image: "https://dxk1acp76n912.cloudfront.net/images/Gemini_Generated_Image_btwe1jbtwe1jbtwe.png",
    },
    {
        title: "Yala National Park Morning Extended Safari Adventure",
        price: 18000,
        image: "https://dxk1acp76n912.cloudfront.net/images/yala.png",
    },
    {
        title: "Hurulu Eco Park Safari",
        price: 11160,
        image: "https://dxk1acp76n912.cloudfront.net/images/huru1.jpeg",
    }
];


async function seed() {
    try {
        const { default: connectDB } = await import('@/lib/mongodb');
        const { default: Package } = await import('@/models/Package');
        const { default: Destination } = await import('@/models/Destination');

        console.log('Connecting to database...');
        await connectDB();
        console.log('Connected!');

        // 1. Seed Packages (Colombo Airport Deals)
        console.log('Seeding Packages...');
        for (const deal of colomboDeals) {
            const slug = slugify(deal.title, { lower: true, strict: true });

            await Package.findOneAndUpdate(
                { slug },
                {
                    title: deal.title,
                    slug,
                    summary: `Airport Transfer: ${deal.title}`,
                    fullDescription: `Comfortable and reliable transfer service for ${deal.title}. Price includes vehicle and driver. (Scraped from LessTaxi)`,
                    duration: "Variable",
                    itinerary: [
                        {
                            day: 1,
                            title: "Transfer Day",
                            description: `Pick up from origin and drive to destination.`,
                            activity: "Transfer"
                        }
                    ],
                    priceMin: deal.price,
                    priceMax: deal.price,
                    price: deal.price,
                    images: [deal.image],
                    highlights: ["Air Conditioned", "English Speaking Driver", "Private Vehicle"],
                    inclusions: ["Fuel", "Driver", "Parking"],
                    exclusions: ["Meals", "Entrance Fees"],
                    tags: ["Airport", "Transfer", "Elite"],
                    isPublished: true,
                    isDeleted: false
                },
                { upsert: true, new: true }
            );
        }
        console.log(`Seeded ${colomboDeals.length} packages.`);

        // 2. Seed Destinations (Home Destinations)
        console.log('Seeding Home Destinations...');
        for (const dest of homeDestinations) {
            const slug = slugify(dest.title, { lower: true, strict: true });

            await Destination.findOneAndUpdate(
                { slug },
                {
                    title: dest.title,
                    slug,
                    description: dest.description,
                    longDescription: `${dest.description} one of the best places to visit in Sri Lanka.`,
                    images: [dest.image],
                    location: dest.title,
                    isPublished: true,
                    isDeleted: false
                },
                { upsert: true, new: true }
            );
        }
        console.log(`Seeded ${homeDestinations.length} home destinations.`);

        // 3. Seed Other Deals as Destinations (or Packages? User asked for Destinations)
        // User said: "destination fill using ... all non colombo aipport"
        console.log('Seeding Other Deals as Destinations...');
        for (const deal of otherDeals) {
            const slug = slugify(deal.title, { lower: true, strict: true });

            await Destination.findOneAndUpdate(
                { slug },
                {
                    title: deal.title,
                    slug,
                    description: `Experience ${deal.title}. Price starting from LKR ${deal.price.toLocaleString()}.`,
                    longDescription: `Enjoy a wonderful experience: ${deal.title}. Book your trip now. Estimated price: LKR ${deal.price}`,
                    images: [deal.image],
                    location: "Sri Lanka",
                    isPublished: true,
                    isDeleted: false
                },
                { upsert: true, new: true }
            );
        }
        console.log(`Seeded ${otherDeals.length} other deals as destinations.`);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();

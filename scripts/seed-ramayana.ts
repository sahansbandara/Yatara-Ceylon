import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Package from './src/models/Package';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('Missing MONGODB_URI in .env.local');
  process.exit(1);
}

async function seedRamayana() {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log('Connected to MongoDB.');

    await Package.updateOne(
      { slug: 'ramayana-trail-deluxe' },
      {
        $set: {
          title: 'Ramayana Trail Deluxe',
          slug: 'ramayana-trail-deluxe',
          type: 'journey',
          category: 'heritage',
          summary: 'Trace the legendary Ramayana path across Sri Lanka — ancient temples, serene hill-country roads, and sacred sites with premium comfort.',
          fullDescription: 'Embark on a spiritually enriching and luxuriously comfortable journey across Sri Lanka, following the ancient and legendary Ramayana trail. From the sacred grounds where Sita was held captive to the miraculous herbs of Rumassala, this meticulously crafted itinerary blends deep heritage with elite hospitality. \n\nDesigned for luxury seekers and spiritual travelers alike, this package ensures private transfers, knowledgeable guides well-versed in epic histories, and stays in handpicked boutique properties offering modern comfort at every stop.',
          duration: '7 Days / 6 Nights',
          priceMin: 220,
          priceMax: 380,
          currency: 'USD',
          images: [
            '/images/packages/ramayana-trail-deluxe/hero.webp',
            '/images/packages/ramayana-trail-deluxe/gallery-1.webp',
            '/images/packages/ramayana-trail-deluxe/gallery-2.webp',
            '/images/packages/ramayana-trail-deluxe/gallery-3.webp'
          ],
          highlights: [
            "Visit the majestic Seetha Amman Temple in Nuwara Eliya",
            "Explore the ancient caves of Ravana Ella",
            "Uncover the spiritual significance of the Rumassala hill",
            "Luxurious accommodations with customized vegetarian/healing dining options",
            "Expert private guides sharing untold stories from the epic"
          ],
          itinerary: [
            {
              day: 1,
              title: "Arrival & Negombo Rest",
              description: "Arrive at Bandaranaike International Airport. Private premium transfer to a luxury seaside resort in Negombo to recover from your flight and prepare for the journey ahead.",
              activity: "Relaxation"
            },
            {
              day: 2,
              title: "Chilaw & Munneswaram Temple",
              description: "Travel to Chilaw to visit the revered Munneswaram and Manavari temples, where Lord Rama prayed after his victory. Proceed to the cultural triangle.",
              activity: "Temple Visit"
            },
            {
              day: 3,
              title: "Kandy — The Sacred Citadel",
              description: "Arrive in the royal city of Kandy. Visit the beautiful Sri Dalada Maligawa (Temple of the Sacred Tooth Relic) and explore the cultural heart of Sri Lanka.",
              activity: "Cultural Tour"
            },
            {
              day: 4,
              title: "Nuwara Eliya — Sita's Captivity",
              description: "Ascend into the misty highlands. Visit the Seetha Amman Temple and the Hakgala Botanical Gardens, the legendary Ashok Vatika where Sita was held.",
              activity: "Heritage Walk"
            },
            {
              day: 5,
              title: "Ella & Ravana's Cave",
              description: "Travel to Ella to witness the cascading Ravana Falls and explore Ravana's Cave, steeped in the mythology of the ancient king's hidden network.",
              activity: "Spiritual Exploration"
            },
            {
              day: 6,
              title: "Galle Coast & Rumassala",
              description: "Descend to the southern coast and visit the legendary Rumassala hill, believed to be a fallen piece of the Himalayas brought by Hanuman.",
              activity: "Coastal Sightseeing"
            },
            {
              day: 7,
              title: "Colombo Departure",
              description: "Morning relaxation on the coast before a swift private transfer to Colombo for your departure flight.",
              activity: "Departure"
            }
          ],
          inclusions: [
            "Meet and greet at the airport",
            "Private chauffeur-guide with deep historical knowledge",
            "6 nights luxury accommodation",
            "Daily breakfast",
            "Entrance fees to all listed temples and heritage sites",
            "All applicable local taxes"
          ],
          exclusions: [
            "International flights and visa fees",
            "Lunches and dinners strictly not specified",
            "Personal expenses and offerings at temples",
            "Camera or video permits",
            "Travel insurance"
          ],
          tags: ["Heritage", "Spiritual", "Luxury", "6 Nights", "Private Tour"],
          isPublished: true,
          isFeatured: false, // Don't feature it heavily by default
          homeRank: 7,
        }
      },
      { upsert: true }
    );

    console.log('Successfully upserted package: Ramayana Trail Deluxe');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedRamayana();

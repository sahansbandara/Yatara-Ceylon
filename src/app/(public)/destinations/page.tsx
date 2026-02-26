import { Metadata } from 'next';
import DestinationCard from '@/components/public/DestinationCard';

export const metadata: Metadata = {
    title: 'The Destinations | Yatara Ceylon',
    description: 'Explore all 25 districts of Sri Lanka. From the vibrant streets of Colombo to the untouched beauty of the Northern peninsula.',
};

const DESTINATIONS = [
    {
        _id: 'd-cmb',
        title: 'Colombo',
        slug: 'colombo',
        luxuryLabel: 'The Sovereign Arrival',
        description: 'The vibrant cosmopolitan gateway to Ceylon — colonial heritage meets modern luxury, designer boutiques, and world-class dining.',
        images: ['/images/home/heritage-story.png'], // Using heritage as city stand-in
    },
    {
        _id: 'd-gle',
        title: 'Galle',
        slug: 'galle',
        luxuryLabel: 'Colonial Serenity',
        description: 'A beautifully preserved Dutch fort city with charming cobblestone streets, elite boutique stays, and Unawatuna\'s azure waters.',
        images: ['/images/home/curated-southcoast.png'],
    },
    {
        _id: 'd-kdy',
        title: 'Kandy',
        slug: 'kandy',
        luxuryLabel: 'The Sacred Highland Legacy',
        description: 'The ancient hill capital, home to the Temple of the Tooth Relic, Royal Botanical Gardens, and the majestic Knuckles Range.',
        images: ['/images/home/signature-heritage.png'],
    },
    {
        _id: 'd-bdl',
        title: 'Ella',
        slug: 'ella',
        luxuryLabel: 'Misty Highland Odyssey',
        description: 'A mist-shrouded mountain hamlet known for the iconic Nine Arches Bridge, Little Adam\'s Peak, and sweeping tea estate panoramas.',
        images: ['/images/home/pkg_ceylon_express.png'],
    },
    {
        _id: 'd-nua',
        title: 'Nuwara Eliya',
        slug: 'nuwara-eliya',
        luxuryLabel: 'The High Country Tea Trail',
        description: 'Known as Little England — colonial bungalows, crisp mountain air, Gregory Lake, Horton Plains, and rolling emerald tea carpets.',
        images: ['/images/home/pkg_tea_temples.png'],
    },
    {
        _id: 'd-mtl',
        title: 'Sigiriya & Matale',
        slug: 'sigiriya',
        luxuryLabel: 'The Ancient Lion Throne',
        description: 'The majestic Lion Rock fortress soaring above emerald forests, Dambulla Cave Temple\'s sacred art, and Riverston Peak\'s panoramas.',
        images: ['/images/home/pkg_cultural_scenic.png'],
    },
    {
        _id: 'd-hbt',
        title: 'Yala & Hambantota',
        slug: 'yala',
        luxuryLabel: 'The Sovereign Wilds',
        description: 'Sri Lanka\'s premier wildlife sanctuary — elusive leopards, herds of elephants, Bundala\'s flamingos against dramatic coastal backdrops.',
        images: ['/images/home/pkg_heritage_wildlife.png'],
    },
    {
        _id: 'd-mtr',
        title: 'Mirissa & Matara',
        slug: 'mirissa',
        luxuryLabel: 'Southern Coast Serenity',
        description: 'Golden southern coastline famed for whale watching, Hiriketiya Bay, luxury beach villas, and vivid Indian Ocean sunsets.',
        images: ['/images/home/pkg_classic_ceylon.png'],
    },
    {
        _id: 'd-anu',
        title: 'Anuradhapura',
        slug: 'anuradhapura',
        luxuryLabel: 'Ancient Kingdom Trails',
        description: 'The grand first capital of Ceylon — millennia of spiritual heritage, towering stupas, the sacred Jaya Sri Maha Bodhi tree.',
        images: ['/images/home/pkg_ramayana.png'],
    },
    {
        _id: 'd-pol',
        title: 'Polonnaruwa',
        slug: 'polonnaruwa',
        luxuryLabel: 'The Royal Ruins',
        description: 'A spectacular medieval capital featuring intricate rock carvings, ancient engineering marvels, and Parakrama Samudra\'s vast waters.',
        images: ['/images/home/signature-heritage.png'],
    },
    {
        _id: 'd-tri',
        title: 'Trincomalee',
        slug: 'trincomalee',
        luxuryLabel: 'Whales & Waves',
        description: 'Unspoiled eastern shores with deep natural harbors, Nilaveli\'s crystal waters, Pigeon Island\'s coral gardens, and Fort Frederick.',
        images: ['/images/home/pkg_east_coast.png'],
    },
    {
        _id: 'd-amp',
        title: 'Arugam Bay',
        slug: 'arugam-bay',
        luxuryLabel: 'The Sovereign Surf',
        description: 'An elite surfers\' paradise wrapped in secluded eastern coastal elegance — world-class breaks and Kumana National Park.',
        images: ['/images/home/curated-southcoast.png'],
    },
    {
        _id: 'd-jaf',
        title: 'Jaffna',
        slug: 'jaffna',
        luxuryLabel: 'The Northern Heritage',
        description: 'Sri Lanka\'s cultural northern gem — Nallur Kandaswamy Kovil, Casuarina Beach, the mystical Delft Island, and vibrant Tamil heritage.',
        images: ['/images/home/curated-kingdoms.png'],
    },
    {
        _id: 'd-put',
        title: 'Kalpitiya & Puttalam',
        slug: 'kalpitiya',
        luxuryLabel: 'The Untamed West',
        description: 'Kalpitiya Lagoon\'s dolphin encounters, Wilpattu National Park\'s wilderness, and St. Anne\'s Church — the wild west coast.',
        images: ['/images/home/signature-wildlife.png'],
    },
    {
        _id: 'd-rat',
        title: 'Ratnapura',
        slug: 'ratnapura',
        luxuryLabel: 'The City of Gems',
        description: 'Gateway to Adam\'s Peak, Sinharaja Rainforest (UNESCO), and Sri Lanka\'s legendary gem trade — a haven for adventurers.',
        images: ['/images/home/curated-hillcountry.png'],
    },
    {
        _id: 'd-keg',
        title: 'Kegalle',
        slug: 'kegalle',
        luxuryLabel: 'Sovereign Sanctuaries',
        description: 'Home to Pinnawala Elephant Orphanage — watch gentle giants bathe in the river surrounded by lush tropical greenery.',
        images: ['/images/home/signature-wildlife.png'],
    },
    {
        _id: 'd-gmp',
        title: 'Negombo & Gampaha',
        slug: 'negombo',
        luxuryLabel: 'Lagoon Elegance',
        description: 'Your first taste of Ceylon — Negombo Lagoon, Dutch Canal heritage, fishing village charm, and easy airport proximity.',
        images: ['/images/home/pkg_classic_ceylon.png'],
    },
    {
        _id: 'd-kal',
        title: 'Kalutara & Bentota',
        slug: 'kalutara',
        luxuryLabel: 'The Bawa Legacy',
        description: 'Geoffrey Bawa\'s Brief Garden, Richmond Castle, and Bentota\'s luxury beach resorts — the artistic soul of the west coast.',
        images: ['/images/home/curated-southcoast.png'],
    },
    {
        _id: 'd-kur',
        title: 'Kurunegala',
        slug: 'kurunegala',
        luxuryLabel: 'Ethagala Rock Heritage',
        description: 'Ethagala Rock\'s commanding views, Yapahuwa\'s ancient kingdom, and Panduwasnuwara\'s medieval palace ruins.',
        images: ['/images/home/curated-kingdoms.png'],
    },
    {
        _id: 'd-bat',
        title: 'Batticaloa',
        slug: 'batticaloa',
        luxuryLabel: 'The Singing Fish Coast',
        description: 'The legendary singing fish of Batticaloa Lagoon, Pasikudah\'s turquoise bay, and the historic Kallady Bridge.',
        images: ['/images/home/pkg_east_coast.png'],
    },
    {
        _id: 'd-mnr',
        title: 'Mannar',
        slug: 'mannar',
        luxuryLabel: 'The Island of Baobabs',
        description: 'Mystical baobab trees, the ancient Mannar Fort, Talaimannar Pier, and the legendary bridge to India — a frontier worth exploring.',
        images: ['/images/home/signature-heritage.png'],
    },
    {
        _id: 'd-kil',
        title: 'Kilinochchi',
        slug: 'kilinochchi',
        luxuryLabel: 'The Northern Gate',
        description: 'Historic Elephant Pass, vast Iranamadu Tank, and the emerging northern landscapes — a journey into Sri Lanka\'s untold stories.',
        images: ['/images/home/heritage-story.png'],
    },
    {
        _id: 'd-vav',
        title: 'Vavuniya',
        slug: 'vavuniya',
        luxuryLabel: 'The Gateway of the North',
        description: 'The bridge between north and south — Vavuniya Museum, ancient Madukanda Vihara, and culturally rich landscapes.',
        images: ['/images/home/curated-kingdoms.png'],
    },
    {
        _id: 'd-mul',
        title: 'Mullaitivu',
        slug: 'mullaitivu',
        luxuryLabel: 'The Marine Frontier',
        description: 'Nayaru Lagoon\'s pristine mangroves, untouched coastline, and the maritime museum — Sri Lanka\'s most secluded frontier.',
        images: ['/images/home/pkg_east_coast.png'],
    },
    {
        _id: 'd-mon',
        title: 'Moneragala',
        slug: 'moneragala',
        luxuryLabel: 'The Highland Jungles',
        description: 'Gal Oya National Park\'s boat safaris, the towering Maligawila Buddha statue, and wild jungle treks through pristine wilderness.',
        images: ['/images/home/signature-wildlife.png'],
    },
];

export default function DestinationsPage() {
    return (
        <div className="min-h-screen bg-off-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-3xl mx-auto">
                    <span className="inline-block py-1.5 px-5 text-xs tracking-[0.2em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-8 bg-deep-emerald/5">
                        Discover Ceylon
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-deep-emerald mb-6 leading-tight">
                        The Destinations
                    </h1>
                    <p className="text-gray-600 text-lg font-light leading-relaxed">
                        Explore all 25 districts of the island — from vibrant cities to untouched wilderness, each curated exclusively for the discerning traveler.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                    {DESTINATIONS.map((dest) => (
                        <DestinationCard key={dest._id} destination={dest} />
                    ))}
                </div>
            </div>
        </div>
    );
}

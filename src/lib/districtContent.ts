/**
 * districtContent.ts — Curated editorial content for each district.
 * Used by the /destinations landing page (cards) and /destinations/[slug] detail pages.
 * Keyed by the slug used in the DESTINATIONS array from @/data/destinations.
 */

export interface DistrictContentItem {
  /** URL-safe slug matching DESTINATIONS[].slug */
  slug: string;
  /** Display name */
  name: string;
  /** Premium tagline (appears on card overlay) */
  tagline: string;
  /** 1-sentence positioning line for landing card */
  positioning: string;
  /** Luxury narrative paragraph for detail page "The Essence" section */
  essence: string;
  /** At a Glance facts */
  atGlance: {
    idealFor: string[];
    knownFor: string[];
    suggestedStay: string;
    travelMood: string;
  };
  /** Why Visit — bullet points */
  whyVisit: string[];
  /** Hero image path */
  heroImage: string;
  /** Category chips shown on landing card */
  categories: string[];
}

export const DISTRICT_CONTENT: Record<string, DistrictContentItem> = {
  colombo: {
    slug: 'colombo',
    name: 'Colombo',
    tagline: 'The Sovereign Arrival',
    positioning: 'Where colonial elegance meets modern luxury on the Indian Ocean shore.',
    essence:
      'Colombo unfolds as Sri Lanka\'s cosmopolitan heartbeat — a city where art-deco facades share the skyline with contemporary towers, where Michelin-aspiring chefs reinvent centuries-old recipes, and where every sunset paints Galle Face Green in liquid gold. Begin your journey in the arms of refined urbanity.',
    atGlance: {
      idealFor: ['City Explorers', 'Foodies', 'Design Lovers'],
      knownFor: ['Fine Dining', 'Heritage Architecture', 'Shopping'],
      suggestedStay: '2–3 nights',
      travelMood: 'Urban Sophistication',
    },
    whyVisit: [
      'World-class dining scene with fusion and traditional cuisine',
      'Dutch Hospital Precinct and colonial-era heritage walks',
      'Gateway to every luxury circuit across the island',
      'Vibrant contemporary art galleries and boutique shopping',
    ],
    heroImage: '/images/districts/colombo.webp',
    categories: ['Culture', 'Dining', 'Heritage'],
  },
  galle: {
    slug: 'galle',
    name: 'Galle',
    tagline: 'Colonial Serenity',
    positioning: 'A UNESCO Fort city where Dutch heritage meets boutique coastal luxury.',
    essence:
      'Within Galle\'s ramparts, time moves at the pace of ocean tides. Coral-stone streets lead to hidden garden cafés, artisan ateliers, and boutique hotels where every room frames the Indian Ocean. Beyond the fort, Unawatuna\'s crescent bay and Hikkaduwa\'s reef invite leisurely coastal discovery.',
    atGlance: {
      idealFor: ['Couples', 'Heritage Seekers', 'Beach Lovers'],
      knownFor: ['Galle Fort', 'Boutique Hotels', 'Coral Reefs'],
      suggestedStay: '3–5 nights',
      travelMood: 'Romantic Coastal Heritage',
    },
    whyVisit: [
      'UNESCO World Heritage Fort with curated boutique stays',
      'Unawatuna and Hikkaduwa beaches just minutes away',
      'Thriving art, jewellery, and design scene within the fort',
      'Whale watching excursions from nearby harbors',
    ],
    heroImage: '/images/districts/galle.webp',
    categories: ['Heritage', 'Beach', 'Couples'],
  },
  kandy: {
    slug: 'kandy',
    name: 'Kandy',
    tagline: 'The Sacred Highland Legacy',
    positioning: 'The cultural hill capital where sacred traditions meet mountain grandeur.',
    essence:
      'Kandy presides over misty highlands as the last royal capital of Sri Lanka. The Temple of the Tooth anchors a city steeped in Buddhist devotion, Kandyan dance, and botanical splendour. Morning mist drifts across the lake while temple drums echo through the hills — a spiritual overture to every highland journey.',
    atGlance: {
      idealFor: ['Culture Enthusiasts', 'Spiritual Seekers', 'Families'],
      knownFor: ['Temple of the Tooth', 'Botanical Gardens', 'Kandyan Dance'],
      suggestedStay: '2–3 nights',
      travelMood: 'Sacred & Cultural',
    },
    whyVisit: [
      'Sacred Temple of the Tooth — Sri Lanka\'s holiest Buddhist shrine',
      'Royal Botanical Gardens at Peradeniya — one of the finest in Asia',
      'Knuckles Mountain Range treks and tea estate visits',
      'Vibrant Kandyan dance and drumming performances',
    ],
    heroImage: '/images/districts/kandy.webp',
    categories: ['Heritage', 'Culture', 'Wellness'],
  },
  ella: {
    slug: 'ella',
    name: 'Ella & Badulla',
    tagline: 'Misty Highland Odyssey',
    positioning: 'Mist-covered ridges, iconic bridges, and tea-clad panoramas in the clouds.',
    essence:
      'Ella sits at the edge of a breathtaking mountain pass where Nine Arches Bridge emerges from tea-carpeted hillsides like a scene from another century. Little Adam\'s Peak offers sunrise panoramas, while the famous Kandy-Ella rail journey ranks among the world\'s most scenic train rides. This is highland Sri Lanka at its most photogenic.',
    atGlance: {
      idealFor: ['Adventurers', 'Photographers', 'Nature Lovers'],
      knownFor: ['Nine Arches Bridge', 'Tea Plantations', 'Scenic Railways'],
      suggestedStay: '2–3 nights',
      travelMood: 'Scenic Adventure',
    },
    whyVisit: [
      'Nine Arches Bridge — Sri Lanka\'s most photographed railway landmark',
      'Little Adam\'s Peak sunrise hike with 360° views',
      'World-famous Kandy-Ella scenic train journey',
      'Boutique tea estate stays with panoramic mountain views',
    ],
    heroImage: '/images/districts/ella.webp',
    categories: ['Scenic', 'Adventure', 'Nature'],
  },
  'nuwara-eliya': {
    slug: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    tagline: 'The High Country Tea Trail',
    positioning: 'Cool-climate tea country with colonial charm and emerald plantation landscapes.',
    essence:
      'Known as Little England, Nuwara Eliya rests at 1,868 metres where cool mountain air carries the aroma of premium Ceylon tea. Colonial-era bungalows, manicured gardens, and Gregory Lake compose a genteel highland tableau. Nearby Horton Plains National Park delivers dramatic cliff-edge walks through cloud forest ecosystems.',
    atGlance: {
      idealFor: ['Tea Connoisseurs', 'Nature Walkers', 'Wellness Seekers'],
      knownFor: ['Tea Estates', 'Horton Plains', 'Colonial Bungalows'],
      suggestedStay: '2–3 nights',
      travelMood: 'Refined Mountain Leisure',
    },
    whyVisit: [
      'Horton Plains and World\'s End — dramatic escarpment views',
      'Premium tea factory tours and private tasting sessions',
      'Gregory Lake and Victoria Park for tranquil afternoon strolls',
      'Cool climate — perfect respite from tropical heat',
    ],
    heroImage: '/images/districts/nuwara-eliya.webp',
    categories: ['Heritage', 'Wellness', 'Scenic'],
  },
  sigiriya: {
    slug: 'sigiriya',
    name: 'Sigiriya & Matale',
    tagline: 'The Ancient Lion Throne',
    positioning: 'Heritage heartland anchored by the iconic Lion Rock Fortress.',
    essence:
      'Sigiriya\'s Lion Rock rises above jungle canopy like a sentinel from the 5th century — a citadel of frescoes, mirror walls, and royal pleasure gardens. Nearby Dambulla\'s cave temples house centuries of sacred art, while the Knuckles foothills offer spice gardens and village encounters. This is Sri Lanka\'s most iconic archaeological landscape.',
    atGlance: {
      idealFor: ['History Buffs', 'Photographers', 'Cultural Explorers'],
      knownFor: ['Sigiriya Rock Fortress', 'Dambulla Cave Temple', 'Spice Gardens'],
      suggestedStay: '2–4 nights',
      travelMood: 'Ancient & Monumental',
    },
    whyVisit: [
      'Sigiriya Rock — UNESCO World Heritage and 5th-century sky palace',
      'Dambulla Cave Temple — 2,000-year-old Buddhist cave complex',
      'Hot air balloon rides over ancient jungle landscapes',
      'Immersive village walks and traditional cooking experiences',
    ],
    heroImage: '/images/districts/sigiriya.webp',
    categories: ['Heritage', 'Culture', 'Adventure'],
  },
  yala: {
    slug: 'yala',
    name: 'Yala & Hambantota',
    tagline: 'The Sovereign Wilds',
    positioning: 'Premier safari terrain with dramatic coastline and elite wildlife encounters.',
    essence:
      'Yala National Park holds the world\'s highest concentration of leopards per square kilometre. Alongside elephants, sloth bears, and hundreds of bird species, the park\'s biodiversity is staggering. Hambantota\'s rugged coastline frames the wilderness with salt pans, bird sanctuaries, and boutique safari lodges that rival East Africa\'s finest.',
    atGlance: {
      idealFor: ['Wildlife Enthusiasts', 'Safari Lovers', 'Photographers'],
      knownFor: ['Leopard Safari', 'Bundala Birds', 'Coastal Drama'],
      suggestedStay: '3–5 nights',
      travelMood: 'Wild & Immersive',
    },
    whyVisit: [
      'World\'s highest density of wild leopards',
      'Private luxury safari experiences at dawn and dusk',
      'Bundala National Park — flamingos, painted storks, shorebirds',
      'Dramatic coastal landscapes and boutique safari lodges',
    ],
    heroImage: '/images/districts/yala.webp',
    categories: ['Wildlife', 'Adventure', 'Nature'],
  },
  mirissa: {
    slug: 'mirissa',
    name: 'Mirissa & Matara',
    tagline: 'Southern Coast Serenity',
    positioning: 'Golden bays, whale encounters, and indulgent coastal hideaways.',
    essence:
      'Mirissa\'s crescent bay is where blue whales breach close to shore between November and April. Beyond the marine spectacle, the southern coast unfolds as a string of palm-fringed beaches, hilltop temples, and surf-ready bays. This stretch of Sri Lanka is designed for slow mornings, extended sunsets, and ocean-front dining.',
    atGlance: {
      idealFor: ['Couples', 'Beach Lovers', 'Marine Life Fans'],
      knownFor: ['Blue Whale Watching', 'Mirissa Beach', 'Surf Culture'],
      suggestedStay: '3–5 nights',
      travelMood: 'Laid-back Coastal Luxury',
    },
    whyVisit: [
      'Blue and sperm whale watching — some of the world\'s best',
      'Hiriketiya Bay — bohemian charm meets boutique surf culture',
      'Weligama stilt fishermen — an iconic Sri Lankan photograph',
      'Secret beach coves and cliffside dining experiences',
    ],
    heroImage: '/images/districts/mirissa.webp',
    categories: ['Beach', 'Nature', 'Couples'],
  },
  anuradhapura: {
    slug: 'anuradhapura',
    name: 'Anuradhapura',
    tagline: 'Ancient Kingdom Trails',
    positioning: 'A sacred ancient capital of monumental stupas and spiritual heritage.',
    essence:
      'Anuradhapura stands as the first great kingdom of Sri Lanka — a sprawling sacred city where ancient stupas rise above the jungle canopy like white domes against the sky. The Jaya Sri Maha Bodhi, a descendant of the tree under which the Buddha attained enlightenment, draws pilgrims from across the world. Cycling through these ruins at dawn is a transformative experience.',
    atGlance: {
      idealFor: ['Heritage Seekers', 'Spiritual Travellers', 'Cyclists'],
      knownFor: ['Sacred Bodhi Tree', 'Ruwanwelisaya Stupa', 'Mihintale'],
      suggestedStay: '2–4 nights',
      travelMood: 'Sacred & Timeless',
    },
    whyVisit: [
      'Jaya Sri Maha Bodhi — oldest historically documented tree on Earth',
      'Ruwanwelisaya — one of Asia\'s largest and most revered stupas',
      'Mihintale — the birthplace of Buddhism in Sri Lanka',
      'Atmospheric dawn cycling through ancient ruins',
    ],
    heroImage: '/images/districts/anuradhapura.webp',
    categories: ['Heritage', 'Culture', 'Wellness'],
  },
  polonnaruwa: {
    slug: 'polonnaruwa',
    name: 'Polonnaruwa',
    tagline: 'The Royal Ruins',
    positioning: 'Medieval capital of exquisite carvings, reservoirs, and royal architecture.',
    essence:
      'Polonnaruwa succeeds Anuradhapura as the island\'s second great kingdom, offering an even more concentrated and well-preserved archaeological experience. The Gal Vihara stone carvings are among the finest Buddhist sculpture in the world. Nearby Minneriya hosts the famous "Gathering" — Asia\'s largest congregation of wild elephants.',
    atGlance: {
      idealFor: ['History Buffs', 'Art Lovers', 'Safari Enthusiasts'],
      knownFor: ['Gal Vihara', 'Ancient Ruins', 'Minneriya Gathering'],
      suggestedStay: '2–4 nights',
      travelMood: 'Archaeological & Majestic',
    },
    whyVisit: [
      'Gal Vihara — four colossal rock-carved Buddhas of exquisite artistry',
      'Parakrama Samudra — a 12th-century reservoir spanning the horizon',
      'Minneriya elephant gathering (Jul–Oct) — up to 300 wild elephants',
      'Compact UNESCO site perfect for curated half-day tours',
    ],
    heroImage: '/images/districts/polonnaruwa.webp',
    categories: ['Heritage', 'Culture', 'Wildlife'],
  },
  trincomalee: {
    slug: 'trincomalee',
    name: 'Trincomalee',
    tagline: 'Whales & Waves',
    positioning: 'Crystal eastern beaches, marine parks, and one of the world\'s finest natural harbours.',
    essence:
      'Trincomalee commands a natural deep-water harbour so magnificent it drew the attention of every colonial power. Today\'s traveller finds pristine Nilaveli Beach, the coral paradise of Pigeon Island, and summer whale-watching that rivals Mirissa. Fort Frederick and Koneswaram Temple add layers of Dutch and Hindu heritage to this coastal gem.',
    atGlance: {
      idealFor: ['Beach Lovers', 'Divers', 'Marine Enthusiasts'],
      knownFor: ['Pigeon Island', 'Nilaveli Beach', 'Whale Watching'],
      suggestedStay: '2–3 nights',
      travelMood: 'Tropical Marine Paradise',
    },
    whyVisit: [
      'Pigeon Island — snorkelling with reef sharks and sea turtles',
      'Nilaveli — one of Sri Lanka\'s most pristine stretches of sand',
      'Summer whale and dolphin watching season (May–September)',
      'Koneswaram Temple — clifftop Hindu shrine with ocean panoramas',
    ],
    heroImage: '/images/districts/trincomalee.webp',
    categories: ['Beach', 'Nature', 'Wellness'],
  },
  'arugam-bay': {
    slug: 'arugam-bay',
    name: 'Arugam Bay',
    tagline: 'The Sovereign Surf',
    positioning: 'World-class surf culture framed by secluded eastern coastal elegance.',
    essence:
      'Arugam Bay is the east coast\'s crown jewel — a legendary surf break that draws wave riders from across the globe. But look beyond the barrel and you\'ll find Kumana\'s bird-rich wetlands, ancient temple ruins in the jungle, and a bohemian-chic coastal community that rewards slow, immersive exploration.',
    atGlance: {
      idealFor: ['Surfers', 'Adventurers', 'Nature Lovers'],
      knownFor: ['Point Break Surfing', 'Kumana Park', 'Beach Culture'],
      suggestedStay: '2–3 nights',
      travelMood: 'Bohemian & Adventurous',
    },
    whyVisit: [
      'World-class right-hand point break for surfers of all levels',
      'Kumana National Park — bird migration spectacle',
      'Laid-back beach culture with boutique coastal stays',
      'Ancient Muhudu Maha Viharaya temple near the coast',
    ],
    heroImage: '/images/districts/arugam-bay.webp',
    categories: ['Adventure', 'Beach', 'Nature'],
  },
  jaffna: {
    slug: 'jaffna',
    name: 'Jaffna',
    tagline: 'The Northern Heritage',
    positioning: 'A culturally rich northern district with temples, islands, and unique cuisine.',
    essence:
      'Jaffna is Sri Lanka\'s cultural counterpoint — a Tamil heartland where ornate kovils rise in vibrant colour, where the cuisine is distinct in its spice and seafood mastery, and where island-hopping by bridge and ferry reveals a different rhythm of island life. Casuarina Beach and Delft Island offer otherworldly coastal landscapes.',
    atGlance: {
      idealFor: ['Cultural Explorers', 'Food Lovers', 'Off-Path Travellers'],
      knownFor: ['Nallur Kandaswamy Kovil', 'Jaffna Cuisine', 'Island Hopping'],
      suggestedStay: '2–3 nights',
      travelMood: 'Cultural Discovery',
    },
    whyVisit: [
      'Nallur Kandaswamy Kovil — the north\'s most spectacular Hindu temple',
      'Unique Jaffna cuisine — crab curry, palmyra dishes, and fresh seafood',
      'Delft Island — wild ponies, ancient baobabs, and coral stone ruins',
      'Casuarina Beach — arguably Sri Lanka\'s most beautiful northern beach',
    ],
    heroImage: '/images/districts/jaffna.webp',
    categories: ['Culture', 'Heritage', 'Adventure'],
  },
  kalpitiya: {
    slug: 'kalpitiya',
    name: 'Kalpitiya & Puttalam',
    tagline: 'The Untamed West',
    positioning: 'Lagoon adventures, dolphin routes, and raw west-coast wilderness.',
    essence:
      'Kalpitiya\'s finger of sand separates turbulent ocean from mirror-calm lagoon, creating a corridor for hundreds of spinner dolphins and seasonal kitesurfing conditions. The wider Puttalam region includes the revered Wilpattu National Park, where leopards roam through ancient forest around natural lakes called "villus".',
    atGlance: {
      idealFor: ['Nature Seekers', 'Water Sports Fans', 'Wildlife Lovers'],
      knownFor: ['Dolphin Watching', 'Kitesurfing', 'Wilpattu Park'],
      suggestedStay: '1–2 nights',
      travelMood: 'Untamed & Free',
    },
    whyVisit: [
      'Spinner dolphin pods — hundreds at a time in Kalpitiya lagoon',
      'Wilpattu National Park — Sri Lanka\'s largest park with roaming leopards',
      'Kitesurfing on flat lagoon waters from December to March',
      'Mangrove kayaking through pristine coastal ecosystems',
    ],
    heroImage: '/images/districts/kalpitiya.webp',
    categories: ['Nature', 'Adventure', 'Wildlife'],
  },
  ratnapura: {
    slug: 'ratnapura',
    name: 'Ratnapura',
    tagline: 'The City of Gems',
    positioning: 'Sri Lanka\'s legendary gem region and gateway to rainforest frontiers.',
    essence:
      'Ratnapura — the City of Gems — has supplied the world\'s finest sapphires, rubies, and cat\'s eyes for centuries. Beyond its glittering trade, the district guards Sinharaja, a UNESCO-protected primary rainforest teeming with endemic species. Adam\'s Peak (Sri Pada), sacred to four religions, rises above the tree line as a pilgrimage beacon.',
    atGlance: {
      idealFor: ['Nature Lovers', 'Gem Enthusiasts', 'Pilgrims'],
      knownFor: ['Blue Sapphires', 'Sinharaja Rainforest', 'Adam\'s Peak'],
      suggestedStay: '2–3 nights',
      travelMood: 'Mystical & Verdant',
    },
    whyVisit: [
      'Sinharaja Rainforest — UNESCO World Heritage primary rainforest',
      'Traditional gem mining and museum experiences',
      'Adam\'s Peak pilgrimage — sacred to Buddhists, Hindus, Muslims, Christians',
      'Rich biodiversity with endemic birds and rare wildlife',
    ],
    heroImage: '/images/districts/ratnapura.webp',
    categories: ['Heritage', 'Nature', 'Adventure'],
  },
  kegalle: {
    slug: 'kegalle',
    name: 'Kegalle',
    tagline: 'Sovereign Sanctuaries',
    positioning: 'Green river valleys and renowned elephant conservation experiences.',
    essence:
      'Kegalle is a lush inland district where the Maha Oya river carves through verdant valleys, and the Pinnawala Elephant Orphanage offers close encounters with rescued pachyderms. The surrounding terrain of rolling hills and rubber plantations provides a tranquil stopover between Colombo and the highlands.',
    atGlance: {
      idealFor: ['Families', 'Animal Lovers', 'Nature Seekers'],
      knownFor: ['Pinnawala Elephants', 'River Valleys', 'Nature Walks'],
      suggestedStay: '1–2 nights',
      travelMood: 'Gentle & Green',
    },
    whyVisit: [
      'Pinnawala Elephant Orphanage — watch herds bathe in the river',
      'Scenic inland route between Colombo and the hill country',
      'Village-level encounters with rubber and spice plantations',
      'Peaceful countryside ambience with boutique nature stays',
    ],
    heroImage: '/images/districts/kegalle.webp',
    categories: ['Family', 'Nature', 'Wildlife'],
  },
  negombo: {
    slug: 'negombo',
    name: 'Negombo & Gampaha',
    tagline: 'Lagoon Elegance',
    positioning: 'Canal heritage, coastal charm, and effortless airport connectivity.',
    essence:
      'Negombo is the traveller\'s first or last impression of Sri Lanka — and it delivers with grace. Dutch canal cruises, a vibrant fishing harbour at dawn, and lagoon-edge boutique hotels set the tone for the journey ahead. The wider Gampaha district adds Heritance heritage and wetland wonders.',
    atGlance: {
      idealFor: ['Transit Travellers', 'Beach Lovers', 'Heritage Seekers'],
      knownFor: ['Dutch Canals', 'Fishing Harbour', 'Airport Proximity'],
      suggestedStay: '1–2 nights',
      travelMood: 'Relaxed Gateway',
    },
    whyVisit: [
      'Seamless airport proximity — 15 minutes from BIA',
      'Dutch canal boat tours through serene waterways',
      'Vibrant Lellama fish market — an authentic morning experience',
      'Lagoon-edge dining and sunset cocktails',
    ],
    heroImage: '/images/districts/negombo.webp',
    categories: ['Beach', 'Heritage', 'Wellness'],
  },
  kalutara: {
    slug: 'kalutara',
    name: 'Kalutara & Bentota',
    tagline: 'The Bawa Legacy',
    positioning: 'Design heritage, river estuaries, and high-end beach retreats.',
    essence:
      'This stretch of western coastline bears the architectural fingerprint of Geoffrey Bawa, Sri Lanka\'s greatest architect. Bentota\'s river meets the sea at a ribbon of golden sand, framed by curated boutique resorts and the legendary Brief Garden. Kalutara adds the striking white dagoba and riverside colonial charm.',
    atGlance: {
      idealFor: ['Couples', 'Design Enthusiasts', 'Beach Lovers'],
      knownFor: ['Geoffrey Bawa Legacy', 'Bentota Beach', 'River Cruises'],
      suggestedStay: '3–5 nights',
      travelMood: 'Design-Forward Coastal',
    },
    whyVisit: [
      'Brief Garden — Geoffrey Bawa\'s private masterpiece of landscape art',
      'Bentota river safari — spot crocodiles, monitors, and kingfishers',
      'Premium beachfront resorts with world-class spa experiences',
      'Kalutara Bodhiya — dramatic oceanfront Buddhist stupa',
    ],
    heroImage: '/images/districts/kalutara.webp',
    categories: ['Beach', 'Couples', 'Wellness'],
  },
  kurunegala: {
    slug: 'kurunegala',
    name: 'Kurunegala',
    tagline: 'Ethagala Rock Heritage',
    positioning: 'Ancient royal echoes surrounded by dramatic inland rock formations.',
    essence:
      'Kurunegala was a 13th-century royal capital whose legacy is written in massive rock formations rising above lush countryside. Yapahuwa\'s clifftop staircase rivals any ancient monument for drama, while Ethagala ("Elephant Rock") offers panoramic views over a city steeped in medieval history.',
    atGlance: {
      idealFor: ['History Buffs', 'Off-Path Explorers', 'Photographers'],
      knownFor: ['Ethagala Rock', 'Yapahuwa Fortress', 'Ancient Capitals'],
      suggestedStay: '1–2 nights',
      travelMood: 'Historical & Dramatic',
    },
    whyVisit: [
      'Yapahuwa Rock Fortress — monumental 13th-century rock staircase',
      'Ethagala viewpoint — city panoramas from elephant-shaped rock',
      'Strategic stopover between ancient triangle and western coast',
      'Panduwasnuwara ruins — lesser-known ancient capital remains',
    ],
    heroImage: '/images/districts/kurunegala.webp',
    categories: ['Heritage', 'Culture', 'Adventure'],
  },
  batticaloa: {
    slug: 'batticaloa',
    name: 'Batticaloa',
    tagline: 'The Singing Fish Coast',
    positioning: 'Lagoon folklore, calm bays, and understated eastern charm.',
    essence:
      'Batticaloa is where Sri Lanka\'s east coast reveals its quieter, more poetic side. The famous "singing fish" of Kallady lagoon, the Dutch-era fort rising over the waterway, and the gentle warmth of Pasikudah Bay\'s shallow turquoise waters create an experience of understated elegance far from the crowds.',
    atGlance: {
      idealFor: ['Quiet Seekers', 'Beach Lovers', 'Cultural Explorers'],
      knownFor: ['Singing Fish Legend', 'Pasikudah Bay', 'Dutch Fort'],
      suggestedStay: '2–3 nights',
      travelMood: 'Tranquil & Poetic',
    },
    whyVisit: [
      'Pasikudah Bay — one of the world\'s shallowest, calmest beaches',
      'Kallady Bridge and the "singing fish" folklore at full moon',
      'Dutch colonial fort with panoramic lagoon views',
      'Emerging boutique stay scene with authentic eastern hospitality',
    ],
    heroImage: '/images/districts/batticaloa.webp',
    categories: ['Beach', 'Culture', 'Wellness'],
  },
  mannar: {
    slug: 'mannar',
    name: 'Mannar',
    tagline: 'The Island of Baobabs',
    positioning: 'Remote coastal frontiers with unique ecology and layered history.',
    essence:
      'Mannar is Sri Lanka at its most frontier-like — a windswept island connected by causeway, where ancient baobab trees (the largest in Asia) stand alongside Dutch forts and the ghostly pier at Talaimannar that once connected Lanka to India. Flamingos, migratory birds, and raw coastal beauty define this frontier district.',
    atGlance: {
      idealFor: ['Birdwatchers', 'Explorers', 'Off-Grid Seekers'],
      knownFor: ['Giant Baobab Trees', 'Migratory Birds', 'Mannar Fort'],
      suggestedStay: '1–2 nights',
      travelMood: 'Remote & Elemental',
    },
    whyVisit: [
      'Asia\'s largest baobab trees — centuries-old giants on Mannar Island',
      'Flamingo colonies and migratory bird spectacles (Sep–Mar)',
      'Talaimannar Pier — terminal of the former India-Lanka ferry',
      'Raw, uncrowded landscapes for true frontier exploration',
    ],
    heroImage: '/images/districts/mannar.webp',
    categories: ['Adventure', 'Wildlife', 'Nature'],
  },
  kilinochchi: {
    slug: 'kilinochchi',
    name: 'Kilinochchi',
    tagline: 'The Northern Gate',
    positioning: 'Expansive reservoirs and emerging northern heritage landscapes.',
    essence:
      'Kilinochchi marks the gateway to Sri Lanka\'s deep north — a district of wide-open landscapes, massive irrigation reservoirs, and poignant modern history. Iranamadu Tank shimmers under vast skies, and the district\'s resilient communities offer authentic cultural encounters that few tourists ever experience.',
    atGlance: {
      idealFor: ['Curious Travellers', 'History Students', 'Road Trippers'],
      knownFor: ['Iranamadu Tank', 'Northern Heritage', 'Open Landscapes'],
      suggestedStay: '1 night',
      travelMood: 'Reflective & Expansive',
    },
    whyVisit: [
      'Iranamadu Tank — vast reservoir with serene waterscapes',
      'Elephant Pass — historically significant northern landmark',
      'Authentic northern village experiences and local cuisine',
      'Gateway transit point for Jaffna-bound journeys',
    ],
    heroImage: '/images/districts/kilinochchi.webp',
    categories: ['Adventure', 'Culture', 'Scenic'],
  },
  vavuniya: {
    slug: 'vavuniya',
    name: 'Vavuniya',
    tagline: 'The Gateway of the North',
    positioning: 'A cultural bridge linking northern heritage with central traditions.',
    essence:
      'Vavuniya stands at the crossroads of Sri Lanka\'s cultural divide — the transition zone where southern Buddhist traditions begin to blend with northern Tamil heritage. The district\'s museum, ancient temples, and local markets reveal a multicultural identity that enriches any journey between north and south.',
    atGlance: {
      idealFor: ['Cultural Explorers', 'Transit Travellers', 'Anthropology Fans'],
      knownFor: ['Vavuniya Museum', 'Multicultural Heritage', 'Northern Gateway'],
      suggestedStay: '1 night',
      travelMood: 'Cultural Crossroads',
    },
    whyVisit: [
      'Cultural crossroads between Tamil and Sinhalese traditions',
      'Vavuniya Archaeological Museum — northern artifacts and history',
      'Madukanda Vihara — ancient Buddhist site in the north',
      'Strategic overnight stop on northern circuit journeys',
    ],
    heroImage: '/images/districts/vavuniya.webp',
    categories: ['Heritage', 'Culture', 'Wellness'],
  },
  mullaitivu: {
    slug: 'mullaitivu',
    name: 'Mullaitivu',
    tagline: 'The Marine Frontier',
    positioning: 'Untouched shoreline landscapes and peaceful marine-edge terrain.',
    essence:
      'Mullaitivu is Sri Lanka\'s most remote coastal district — a place where pristine beaches stretch unbroken, Nayaru Lagoon teems with aquatic life, and the pace of existence returns to something elemental. For travellers who prize solitude and raw natural beauty over polished infrastructure, this is the frontier.',
    atGlance: {
      idealFor: ['Solitude Seekers', 'Marine Explorers', 'Pioneers'],
      knownFor: ['Nayaru Lagoon', 'Untouched Beaches', 'Coastal Wilderness'],
      suggestedStay: '1–2 nights',
      travelMood: 'Remote & Pristine',
    },
    whyVisit: [
      'Nayaru Lagoon — rich aquatic ecosystem with minimal tourism',
      'Mullaitivu Beach — untouched golden sand with zero crowds',
      'Authentic fishing village encounters and fresh seafood',
      'Ultimate seclusion for those seeking Sri Lanka\'s frontier edge',
    ],
    heroImage: '/images/districts/mullaitivu.webp',
    categories: ['Adventure', 'Nature', 'Scenic'],
  },
  moneragala: {
    slug: 'moneragala',
    name: 'Moneragala',
    tagline: 'The Highland Jungles',
    positioning: 'Wild inland terrain with safari gateways and spiritual landmarks.',
    essence:
      'Moneragala is where Sri Lanka\'s southeastern wilderness begins in earnest. Gal Oya National Park offers boat safaris through elephant-dotted reservoirs — an experience unique in Asia. The Maligawila Buddha, a colossal stone carving emerging from the jungle, adds archaeological wonder to this untamed region.',
    atGlance: {
      idealFor: ['Safari Lovers', 'Adventure Seekers', 'Nature Enthusiasts'],
      knownFor: ['Gal Oya Boat Safari', 'Maligawila Buddha', 'Wild Jungle'],
      suggestedStay: '2–3 nights',
      travelMood: 'Untamed & Immersive',
    },
    whyVisit: [
      'Gal Oya National Park — Asia\'s only elephant boat safari',
      'Maligawila Buddha — 11m standing stone Buddha in jungle clearing',
      'Indigenous Vedda community cultural encounters',
      'Remote wilderness lodges with zero light pollution',
    ],
    heroImage: '/images/districts/moneragala.webp',
    categories: ['Wildlife', 'Adventure', 'Nature'],
  },
};

/** Helper: get district content by slug, or return undefined */
export function getDistrictContent(slug: string): DistrictContentItem | undefined {
  return DISTRICT_CONTENT[slug];
}

/** Helper: get all district contents as an array */
export function getAllDistrictContents(): DistrictContentItem[] {
  return Object.values(DISTRICT_CONTENT);
}

'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
    Loader2, MapPin, X, Eye, ArrowLeft, Sparkles, GripVertical,
    ChevronDown, ChevronUp, Navigation, Gauge, Clock, Route, Gem, Compass
} from 'lucide-react';
import { haversineDistance } from '@/lib/tourUtils';

// Dynamically import Leaflet components (no SSR)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });

import 'leaflet/dist/leaflet.css';

// ─── @dnd-kit imports ────────────────────────────────────────────────────────
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ─── Types ──────────────────────────────────────────────────────────────────

interface HiddenGem {
    name: string;
    category: string;
    teaser: string;
    image_hint: string;
    visit_minutes_est: number;
}

interface YataraDistrict {
    id: string;
    name: string;
    luxury_label: string;
    gems: string[];
    coordinates: [number, number];
    transfer_start: number;
    hidden_gems?: HiddenGem[];
}

interface GemPlace {
    id: string;
    name: string;
    category: string;
    teaser: string;
    districtName: string;
    districtId: string;
    visit_minutes_est: number;
    isHidden?: boolean;
}

type ViewState = 'map' | 'district' | 'preview';

// ─── Name normalization ──────────────────────────────────────────────────────

const NAME_MAP: Record<string, string> = { 'Monaragala': 'Moneragala' };

function extractDistrictName(shapeName: string): string {
    const raw = shapeName.replace(/\s*District$/i, '').trim();
    return NAME_MAP[raw] || raw;
}

// ─── Category helpers ────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
    TEMPLE: '#D97706',
    BEACH: '#0EA5E9',
    NATURE: '#10B981',
    HERITAGE: '#8B5CF6',
    WILDLIFE: '#F59E0B',
    ADVENTURE: '#EF4444',
    CITY: '#6366F1',
    FOOD: '#F97316',
    CULTURE: '#EC4899',
    SCENIC: '#14B8A6',
    OTHER: '#6B7280',
};

// ─── Gem → Category/Teaser mapping ──────────────────────────────────────────

const GEM_DATA: Record<string, { category: string; teaser: string }> = {
    // Colombo
    'Yatara HQ (Colombo 02)': { category: 'CITY', teaser: 'Your luxury journey begins at our flagship concierge lounge' },
    'Dutch Hospital Precinct': { category: 'HERITAGE', teaser: 'Colonial-era complex reimagined as a premium dining & shopping enclave' },
    'Galle Face Green': { category: 'SCENIC', teaser: 'Iconic oceanfront promenade — sunsets over the Indian Ocean' },
    // Matale
    'Sigiriya Lion Rock': { category: 'HERITAGE', teaser: 'Ancient rock fortress rising 200m above the jungle canopy' },
    'Dambulla Cave Temple': { category: 'TEMPLE', teaser: 'Five sacred caves adorned with 150+ Buddha statues since 1st century BC' },
    'Riverston Peak': { category: 'NATURE', teaser: 'Hidden mountain viewpoint — the "Mini World\'s End" of the Knuckles' },
    // Galle
    'Galle Fort Heritage': { category: 'HERITAGE', teaser: 'UNESCO World Heritage — 16th-century Dutch-Portuguese coastal fort' },
    'Unawatuna Beach': { category: 'BEACH', teaser: 'Crescent-shaped bay ranked among the world\'s most beautiful beaches' },
    'Hikkaduwa Marine Park': { category: 'NATURE', teaser: 'Vibrant coral sanctuary teeming with sea turtles and exotic reef life' },
    // Kandy
    'Temple of the Tooth': { category: 'TEMPLE', teaser: 'Sacred shrine housing the relic of Buddha\'s tooth — the spiritual heart of Sri Lanka' },
    'Royal Botanical Gardens': { category: 'NATURE', teaser: '147 acres of exotic orchids, giant bamboo, and colonial-era palm avenues' },
    'Knuckles Range': { category: 'ADVENTURE', teaser: 'Cloud-forest peaks with endemic species and ancient trails' },
    // Badulla / Ella
    'Nine Arches Bridge (Ella)': { category: 'SCENIC', teaser: 'Legendary viaduct arching 24m above tropical forest — peak golden hour' },
    "Little Adam's Peak": { category: 'ADVENTURE', teaser: '45-minute trek rewarded with 360° views of misty Ella valley' },
    'Dunhinda Falls': { category: 'NATURE', teaser: '64m waterfall — the "Smoke Falls" for its perpetual misty veil' },
    // Nuwara Eliya
    'Gregory Lake': { category: 'SCENIC', teaser: 'Serene highland lake surrounded by English-garden charm at 1,900m' },
    'Horton Plains': { category: 'NATURE', teaser: 'Misty plateau ending at World\'s End — an 880m vertical cliff drop' },
    'Bluefield Tea Gardens': { category: 'FOOD', teaser: 'Walk the emerald rows and taste single-origin Ceylon at the source' },
    // Matara
    'Mirissa Beach': { category: 'BEACH', teaser: 'Whale-watching capital of Asia — blue whales pass Nov–Apr' },
    'Hiriketiya Bay': { category: 'BEACH', teaser: 'Secret horseshoe cove loved by surfers and sunset seekers' },
    'Weligama Surf Point': { category: 'ADVENTURE', teaser: 'Gentle swells perfect for beginner surfers and stilt-fisherman sightings' },
    // Hambantota
    'Yala National Park': { category: 'WILDLIFE', teaser: 'Highest leopard density on earth — early-dawn safari magic' },
    'Bundala Bird Sanctuary': { category: 'WILDLIFE', teaser: 'Ramsar wetland hosting flamingos, pelicans, and 200+ bird species' },
    'Ridiyagama Safari': { category: 'WILDLIFE', teaser: 'Sri Lanka\'s only open-range safari park — African-style encounters' },
    // Trincomalee
    'Nilaveli Beach': { category: 'BEACH', teaser: 'Pristine white sand stretching endlessly along the east coast' },
    'Pigeon Island': { category: 'NATURE', teaser: 'National park island with crystal waters and reef shark snorkeling' },
    'Fort Frederick': { category: 'HERITAGE', teaser: 'Dutch-era fort perched on Swami Rock above turquoise Trinco bay' },
    // Jaffna
    'Nallur Kandaswamy Kovil': { category: 'TEMPLE', teaser: 'Magnificent Hindu temple — its annual festival draws millions' },
    'Casuarina Beach': { category: 'BEACH', teaser: 'Untouched northern beach fringed by casuarina pines' },
    'Delft Island': { category: 'HERITAGE', teaser: 'Remote island with wild ponies and crumbling Portuguese-era ruins' },
    // Anuradhapura
    'Jaya Sri Maha Bodhi': { category: 'TEMPLE', teaser: 'Oldest historically documented tree in the world — sacred fig since 288 BC' },
    'Ruwanwelisaya': { category: 'TEMPLE', teaser: 'Gleaming white stupa — one of the tallest ancient structures on earth' },
    'Mihintale': { category: 'HERITAGE', teaser: 'Birthplace of Buddhism in Sri Lanka — 1,840 steps to enlightenment' },
    // Polonnaruwa
    'Ancient City Ruins': { category: 'HERITAGE', teaser: 'UNESCO medieval capital — carved Buddhas and royal courtyards' },
    'Parakrama Samudra': { category: 'SCENIC', teaser: '12th-century reservoir — a "sea" built by a single king\'s vision' },
    'Minneriya Safari': { category: 'WILDLIFE', teaser: '"The Gathering" — up to 300 elephants at the dry-season tank' },
    // Puttalam
    'Kalpitiya Lagoon': { category: 'NATURE', teaser: 'Dolphin pods, kitesurfing, and mangrove kayaking on the Puttalam coast' },
    'Wilpattu National Park': { category: 'WILDLIFE', teaser: 'Sri Lanka\'s largest park — leopard, sloth bear, and ancient lakes' },
    "St. Anne's Church": { category: 'HERITAGE', teaser: 'Historic shrine drawing pilgrims from across the island since 1668' },
    // Ratnapura
    'Sinharaja Rain Forest': { category: 'NATURE', teaser: 'UNESCO virgin rainforest — 50% of Sri Lanka\'s endemic species' },
    "Adam's Peak (Sri Pada)": { category: 'ADVENTURE', teaser: 'Sacred 2,243m pilgrimage peak — sunrise above the cloud sea' },
    'Gem Museum': { category: 'CULTURE', teaser: 'The \'City of Gems\' — sapphires, rubies, and generations of craftsmanship' },
    // Kegalle
    'Pinnawala Elephant Orphanage': { category: 'WILDLIFE', teaser: '80+ rescued elephants bathing in the Maha Oya river daily' },
    'Saradiel Village': { category: 'CULTURE', teaser: 'Legendary folk hero\'s hideout in the Kegalle highlands' },
    'Utuwankanda': { category: 'SCENIC', teaser: 'Dramatic rock outcrop with panoramic views across the valley' },
    // Gampaha
    'Negombo Lagoon': { category: 'NATURE', teaser: 'Vast lagoon system — fishing boats, mangroves, and golden light' },
    'Dutch Canal': { category: 'HERITAGE', teaser: '100km colonial waterway — explore by traditional canoe' },
    'Private Estate Tours': { category: 'FOOD', teaser: 'Cinnamon, coconut, and spice estates with private tastings' },
    // Kalutara
    'Richmond Castle': { category: 'HERITAGE', teaser: 'Edwardian mansion blending Indian and British architectural splendor' },
    'Brief Garden': { category: 'NATURE', teaser: 'Bevis Bawa\'s enchanted garden — sculpture, art, and tropical fantasy' },
    'Kalutara Bodhiya': { category: 'TEMPLE', teaser: 'Hollow stupa housing a sacred Bo tree beside the Kalu River' },
    // Kurunegala
    'Ethagala Rock': { category: 'SCENIC', teaser: 'Elephant-shaped rock towering above the "Tusker Capital"' },
    'Yapahuwa Kingdom': { category: 'HERITAGE', teaser: '13th-century rock fortress with one of Lanka\'s finest carved staircases' },
    'Panduwasnuwara': { category: 'HERITAGE', teaser: 'Ancient royal palace ruins hidden in the Kurunegala lowlands' },
    // Mannar
    'Baobab Tree': { category: 'NATURE', teaser: '700-year-old African baobab — a botanical mystery on Lanka\'s shores' },
    'Mannar Fort': { category: 'HERITAGE', teaser: 'Portuguese star fort guarding the strait to India since 1560' },
    'Talaimannar Pier': { category: 'SCENIC', teaser: 'Historic railhead — the closest point to the Indian subcontinent' },
    // Kilinochchi
    'Elephant Pass': { category: 'HERITAGE', teaser: 'Historic causeway connecting Jaffna peninsula to the mainland' },
    'Iranamadu Tank': { category: 'SCENIC', teaser: 'Vast reservoir amid the northern plains — serene and untouched' },
    // Mullaitivu
    'Nayaru Lagoon': { category: 'NATURE', teaser: 'Pristine lagoon with migratory birds and untouched mangroves' },
    'Maritime Museum': { category: 'CULTURE', teaser: 'Naval heritage and maritime artefacts of the northern coast' },
    // Vavuniya
    'Vavuniya Museum': { category: 'CULTURE', teaser: 'Archaeological treasures from the northern kingdom eras' },
    'Madukanda Vihara': { category: 'TEMPLE', teaser: 'Ancient temple ruins deep in the northern dry zone' },
    // Batticaloa
    'Batticaloa Fort': { category: 'HERITAGE', teaser: 'Dutch fortress surrounded by Batticaloa Lagoon\'s singing fish' },
    'Pasikudah Bay': { category: 'BEACH', teaser: 'Shallow turquoise waters perfect for reef walks and snorkeling' },
    'Kallady Bridge': { category: 'SCENIC', teaser: 'Historic bridge spanning the lagoon — best at sunset' },
    // Ampara
    'Arugam Bay': { category: 'BEACH', teaser: 'World-class surf break — right-hand point break perfection' },
    'Kumana National Park': { category: 'WILDLIFE', teaser: 'Bird sanctuary adjacent to Yala — herons, egrets, and painted storks' },
    'Buddhangala': { category: 'TEMPLE', teaser: 'Ancient forest monastery with massive rock-cut meditation caves' },
    // Moneragala
    'Gal Oya National Park': { category: 'WILDLIFE', teaser: 'Boat safaris past swimming elephants on Senanayake Samudra' },
    'Maligawila Buddha Statue': { category: 'TEMPLE', teaser: '7th-century 11m standing Buddha — the tallest ancient stone statue in Lanka' },
};

function getGemData(gemName: string): { category: string; teaser: string } {
    return GEM_DATA[gemName] || { category: 'OTHER', teaser: 'A curated destination waiting to be explored' };
}

function getCategoryColor(cat: string): string {
    return CATEGORY_COLORS[cat?.toUpperCase()] || '#6B7280';
}

// ─── MapController (uses react-leaflet useMap) ──────────────────────────────

function MapControllerInner({
    selectedDistrict,
    geoData,
    sriLankaBounds,
}: {
    selectedDistrict: YataraDistrict | null;
    geoData: any;
    sriLankaBounds: [[number, number], [number, number]];
}) {
    const { useMap } = require('react-leaflet');
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        if (selectedDistrict && geoData) {
            // Find the GeoJSON feature for this district and compute its bounds
            const L = require('leaflet');
            const feature = geoData.features?.find((f: any) => {
                const name = extractDistrictName(f.properties.shapeName || '');
                return name.toLowerCase() === selectedDistrict.name.toLowerCase();
            });

            if (feature) {
                const geoLayer = L.geoJSON(feature);
                const bounds = geoLayer.getBounds();
                map.fitBounds(bounds, {
                    animate: true,
                    duration: 0.8,
                    padding: [80, 80],
                    maxZoom: 10,
                });
            }
        } else {
            map.fitBounds(sriLankaBounds, {
                animate: true,
                duration: 0.8,
                padding: [20, 20],
            });
        }
    }, [selectedDistrict, geoData, map, sriLankaBounds]);

    return null;
}

const MapController = dynamic(
    () => Promise.resolve(MapControllerInner),
    { ssr: false }
);

// ─── Sortable Basket Item ───────────────────────────────────────────────────

function SortableBasketItem({
    place,
    index,
    onRemove,
}: {
    place: GemPlace;
    index: number;
    onRemove: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: place.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style as any}
            className="drawer-sort-item flex items-center gap-3 px-3 py-2.5 rounded-lg group"
        >
            {/* Drag handle */}
            <button
                {...attributes}
                {...listeners}
                className="p-1 cursor-grab active:cursor-grabbing text-white/30 hover:text-antique-gold transition-colors flex-shrink-0"
            >
                <GripVertical className="w-3.5 h-3.5" />
            </button>

            {/* Order number */}
            <div className="w-6 h-6 bg-antique-gold/20 text-antique-gold flex items-center justify-center font-serif text-[11px] rounded-full flex-shrink-0 border border-antique-gold/30">
                {index + 1}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-serif text-[13px] text-white/90 truncate">{place.name}</p>
                <p className="text-[9px] uppercase tracking-wider text-white/40">{place.districtName}</p>
            </div>

            {/* Category dot */}
            <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: getCategoryColor(place.category) }}
            />

            {/* Remove */}
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(place.id); }}
                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded transition-all flex-shrink-0"
            >
                <X className="w-3 h-3 text-white/50 hover:text-red-400" />
            </button>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BespokeTourPlanner() {
    // Data
    const [geoData, setGeoData] = useState<any>(null);
    const [districts, setDistricts] = useState<YataraDistrict[]>([]);

    // View state
    const [viewState, setViewState] = useState<ViewState>('map');
    const [selectedDistrict, setSelectedDistrict] = useState<YataraDistrict | null>(null);
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

    // Tour basket
    const [basket, setBasket] = useState<GemPlace[]>([]);

    // Gem tab state
    const [gemTab, setGemTab] = useState<'signature' | 'hidden'>('signature');

    // Drawer state (mobile)
    const [drawerExpanded, setDrawerExpanded] = useState(false);

    // Refs
    const geoJsonRef = useRef<any>(null);

    // Constants
    const sriLankaBounds: [[number, number], [number, number]] = [[5.7, 79.2], [10.0, 82.2]];
    const center: [number, number] = [7.8731, 80.7718];

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    // ─── Data fetching on mount ──────────────────────────────────────────────

    useEffect(() => {
        Promise.all([
            fetch('/sri-lanka-districts.geojson').then(r => r.json()),
            fetch('/yatara-districts.json').then(r => r.json()),
        ])
            .then(([geo, yatara]) => {
                setGeoData(geo);
                setDistricts(yatara.districts);
            })
            .catch(err => console.error('Failed to load data', err));
    }, []);

    // ─── Re-style GeoJSON on hover/selection ─────────────────────────────────

    useEffect(() => {
        if (!geoJsonRef.current) return;
        geoJsonRef.current.eachLayer((layer: any) => {
            const name = extractDistrictName(layer.feature.properties.shapeName || '');
            const isSelected = selectedDistrict?.name?.toLowerCase() === name.toLowerCase();
            const isHovered = hoveredDistrict?.toLowerCase() === name.toLowerCase();

            if (viewState === 'district' || viewState === 'preview') {
                // Cinematic dim — only selected district visible
                layer.setStyle({
                    fillColor: isSelected ? '#0a5c3a' : '#16a34a',
                    fillOpacity: isSelected ? 0.55 : 0.06,
                    weight: isSelected ? 3 : 0.3,
                    color: isSelected ? '#D4AF37' : '#ffffff',
                    opacity: isSelected ? 1 : 0.15,
                });
            } else {
                // Full map — vivid
                layer.setStyle({
                    fillColor: isHovered ? '#0a5c3a' : '#16a34a',
                    fillOpacity: isHovered ? 0.5 : 0.25,
                    weight: isHovered ? 2.5 : 1.2,
                    color: isHovered ? '#D4AF37' : '#ffffff',
                    opacity: 1,
                });
            }
        });
    }, [selectedDistrict, hoveredDistrict, viewState]);

    // ─── Basket helpers ──────────────────────────────────────────────────────

    const isInBasket = useCallback((gemId: string) => basket.some(p => p.id === gemId), [basket]);

    const addToBasket = useCallback((gem: GemPlace) => {
        if (!isInBasket(gem.id)) {
            setBasket(prev => [...prev, gem]);
        }
    }, [isInBasket]);

    const removeFromBasket = useCallback((gemId: string) => {
        setBasket(prev => prev.filter(p => p.id !== gemId));
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setBasket(prev => {
                const oldIndex = prev.findIndex(p => p.id === active.id);
                const newIndex = prev.findIndex(p => p.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    }, []);

    // ─── Gem places for current district ─────────────────────────────────────

    const currentGemPlaces: GemPlace[] = useMemo(() => {
        if (!selectedDistrict) return [];
        return selectedDistrict.gems.map((gemName) => {
            const data = getGemData(gemName);
            return {
                id: `${selectedDistrict.id}-${gemName}`,
                name: gemName,
                category: data.category,
                teaser: data.teaser,
                districtName: selectedDistrict.name,
                districtId: selectedDistrict.id,
                visit_minutes_est: 60,
            };
        });
    }, [selectedDistrict]);

    // ─── Hidden gem places for current district ──────────────────────────────

    const currentHiddenGemPlaces: GemPlace[] = useMemo(() => {
        if (!selectedDistrict?.hidden_gems) return [];
        return selectedDistrict.hidden_gems.map((hg) => ({
            id: `${selectedDistrict.id}-hidden-${hg.name}`,
            name: hg.name,
            category: hg.category,
            teaser: hg.teaser,
            districtName: selectedDistrict.name,
            districtId: selectedDistrict.id,
            visit_minutes_est: hg.visit_minutes_est,
            isHidden: true,
        }));
    }, [selectedDistrict]);

    // ─── Active tab places ───────────────────────────────────────────────────

    const activeGemPlaces = gemTab === 'signature' ? currentGemPlaces : currentHiddenGemPlaces;

    // ─── Trip pace ───────────────────────────────────────────────────────────

    const tripPace = useMemo(() => {
        const count = basket.length;
        if (count <= 3) return 'Relaxed';
        if (count <= 6) return 'Balanced';
        return 'Fast';
    }, [basket.length]);

    const paceSpeed = useMemo(() => {
        if (tripPace === 'Relaxed') return 30;
        if (tripPace === 'Balanced') return 40;
        return 50;
    }, [tripPace]);

    // ─── Route positions for preview ─────────────────────────────────────────

    const routePositions = useMemo(() => {
        return basket
            .map(place => {
                const d = districts.find(dd => dd.id === place.districtId);
                return d ? [d.coordinates[0], d.coordinates[1]] as [number, number] : null;
            })
            .filter(Boolean) as [number, number][];
    }, [basket, districts]);

    // ─── Phase-1 Estimation ──────────────────────────────────────────────────

    const tourEstimate = useMemo(() => {
        if (basket.length < 2) return null;

        // Build ordered district stops with place counts
        const districtOrder: { id: string; coords: { lat: number; lng: number }; count: number }[] = [];
        for (const place of basket) {
            const d = districts.find(dd => dd.id === place.districtId);
            if (!d) continue;
            const last = districtOrder[districtOrder.length - 1];
            if (last && last.id === d.id) {
                last.count++;
            } else {
                districtOrder.push({ id: d.id, coords: { lat: d.coordinates[0], lng: d.coordinates[1] }, count: 1 });
            }
        }

        // Inter-district distance (Haversine × road factor)
        let airKm = 0;
        for (let i = 0; i < districtOrder.length - 1; i++) {
            airKm += haversineDistance(districtOrder[i].coords, districtOrder[i + 1].coords);
        }
        const roadKm = Math.round(airKm * 1.35);

        // Intra-district penalties
        let extraKm = 0;
        let extraMinutes = 0;
        for (const stop of districtOrder) {
            if (stop.count > 1) {
                extraKm += (stop.count - 1) * 12;
                extraMinutes += (stop.count - 1) * 25;
            }
        }

        const totalKm = roadKm + extraKm;
        const driveMinutes = (totalKm / paceSpeed) * 60;
        const visitMinutes = basket.reduce((sum, p) => sum + (p.visit_minutes_est || 60), 0);
        const totalMinutes = Math.round(driveMinutes + extraMinutes + visitMinutes);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

        return { totalKm, totalHours, driveMinutes: Math.round(driveMinutes), visitMinutes };
    }, [basket, districts, paceSpeed]);

    // ─── District click handler ──────────────────────────────────────────────

    const handleDistrictClick = useCallback((districtName: string) => {
        if (viewState === 'preview') return;

        const match = districts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
        if (!match) return;

        if (viewState === 'district' && selectedDistrict?.name === match.name) {
            // Same district → go back to full map
            setViewState('map');
            setSelectedDistrict(null);
        } else {
            setSelectedDistrict(match);
            setViewState('district');
        }
    }, [districts, selectedDistrict, viewState]);

    // ─── Back to map ─────────────────────────────────────────────────────────

    const backToMap = useCallback(() => {
        setViewState('map');
        setSelectedDistrict(null);
    }, []);

    // ─── GeoJSON event handler ───────────────────────────────────────────────

    const onEachFeature = useCallback((feature: any, layer: any) => {
        const shapeName = feature.properties.shapeName || '';
        const districtName = extractDistrictName(shapeName);

        layer.bindTooltip(districtName, {
            permanent: false,
            direction: 'center',
            className: 'district-tooltip',
        });

        layer.on({
            click: () => handleDistrictClick(districtName),
            mouseover: () => { if (viewState === 'map') setHoveredDistrict(districtName); },
            mouseout: () => setHoveredDistrict(null),
        });
    }, [handleDistrictClick, viewState]);

    const initialStyle = () => ({
        fillColor: '#16a34a',
        weight: 1.2,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0.25,
    });

    // ─── Loading ─────────────────────────────────────────────────────────────

    if (!geoData || districts.length === 0) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0f0d]">
                <Loader2 className="w-8 h-8 text-antique-gold animate-spin mb-4" />
                <p className="text-white/40 font-serif text-sm tracking-widest uppercase">Preparing your journey</p>
            </div>
        );
    }

    // ─── Preview Tour View ───────────────────────────────────────────────────

    if (viewState === 'preview') {
        return (
            <div className="h-screen w-full bg-[#0a0f0d] flex flex-col">
                {/* Preview Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-deep-emerald/80 backdrop-blur-lg border-b border-antique-gold/20 z-20 relative">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setViewState('map')} className="p-2 hover:bg-white/10 transition-colors rounded-lg">
                            <ArrowLeft className="w-5 h-5 text-antique-gold" />
                        </button>
                        <div>
                            <h2 className="text-xl font-serif text-antique-gold tracking-wide">Tour Preview</h2>
                            <p className="text-white/50 text-xs font-light tracking-wider">{basket.length} destinations curated</p>
                        </div>
                    </div>
                    <button onClick={() => setViewState('map')} className="px-4 py-2 border border-antique-gold/30 text-antique-gold text-xs font-serif uppercase tracking-widest hover:bg-antique-gold/10 transition-colors rounded-lg">
                        Back to Planning
                    </button>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Preview Map */}
                    <div className="w-full lg:w-2/3 h-[50vh] lg:h-full relative build-tour-map">
                        {typeof window !== 'undefined' && (
                            <MapContainer
                                center={center}
                                zoom={8}
                                minZoom={7}
                                maxZoom={10}
                                zoomControl={false}
                                scrollWheelZoom={false}
                                dragging={false}
                                doubleClickZoom={false}
                                touchZoom={false}
                                style={{ height: '100%', width: '100%', background: '#0a0f0d' }}
                                attributionControl={false}
                            >
                                <GeoJSON
                                    data={geoData}
                                    style={() => ({
                                        fillColor: '#16a34a',
                                        weight: 0.8,
                                        opacity: 0.4,
                                        color: '#ffffff',
                                        fillOpacity: 0.12,
                                    })}
                                />
                                {routePositions.length >= 2 && (
                                    <Polyline
                                        positions={routePositions}
                                        pathOptions={{ color: '#D4AF37', weight: 2.5, dashArray: '10 6', opacity: 0.8 }}
                                    />
                                )}
                            </MapContainer>
                        )}

                        {/* Route label */}
                        <div className="absolute bottom-4 left-4 z-[1000] preview-route-label px-4 py-2.5 rounded-lg">
                            <p className="text-white/70 text-[10px] font-light tracking-wider">
                                Estimated path (district centers) · Exact routing confirmed by concierge
                            </p>
                        </div>
                    </div>

                    {/* Preview Summary Panel */}
                    <div className="w-full lg:w-1/3 tour-glass-drawer overflow-y-auto flex flex-col lg:border-l border-antique-gold/15">
                        {/* Trip Pace + Estimation */}
                        <div className="p-6 border-b border-white/5">
                            <div className="flex items-center gap-2 mb-4">
                                <Gauge className="w-4 h-4 text-antique-gold" />
                                <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-white/40">Trip Pace</span>
                            </div>
                            <div className="flex gap-2">
                                {['Relaxed', 'Balanced', 'Fast'].map(pace => (
                                    <span key={pace} className={`pace-pill ${tripPace === pace ? 'active' : 'inactive'}`}>
                                        {pace}
                                    </span>
                                ))}
                            </div>

                            {/* Phase-1 Estimation */}
                            {tourEstimate && (
                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Route className="w-3 h-3 text-antique-gold/70" />
                                            <span className="text-[9px] uppercase tracking-wider text-white/30">Distance</span>
                                        </div>
                                        <p className="text-white/80 font-serif text-lg">~{tourEstimate.totalKm} <span className="text-[10px] text-white/40 font-light">km</span></p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Clock className="w-3 h-3 text-antique-gold/70" />
                                            <span className="text-[9px] uppercase tracking-wider text-white/30">Total Time</span>
                                        </div>
                                        <p className="text-white/80 font-serif text-lg">~{tourEstimate.totalHours} <span className="text-[10px] text-white/40 font-light">hrs</span></p>
                                    </div>
                                </div>
                            )}

                            <p className="text-white/20 text-[9px] mt-3 font-light tracking-wider">
                                Estimated (district-centre approximation) · Exact routing confirmed by concierge
                            </p>
                        </div>

                        {/* Itinerary */}
                        <div className="flex-1 p-6">
                            <h4 className="font-serif text-antique-gold tracking-[0.2em] uppercase text-[10px] mb-5">Your Itinerary</h4>
                            <div className="space-y-3">
                                {basket.map((place, idx) => (
                                    <div key={place.id} className="flex items-start gap-3">
                                        {/* Timeline */}
                                        <div className="flex flex-col items-center flex-shrink-0">
                                            <div className="w-7 h-7 bg-antique-gold/20 text-antique-gold flex items-center justify-center font-serif text-[11px] rounded-full border border-antique-gold/30">
                                                {idx + 1}
                                            </div>
                                            {idx < basket.length - 1 && (
                                                <div className="w-px h-8 bg-antique-gold/15 mt-1" />
                                            )}
                                        </div>
                                        {/* Content */}
                                        <div className="pt-0.5">
                                            <p className="font-serif text-white/90 text-sm">{place.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className="text-[9px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full"
                                                    style={{ backgroundColor: getCategoryColor(place.category) + '25', color: getCategoryColor(place.category) }}
                                                >
                                                    {place.category}
                                                </span>
                                                <span className="text-white/30 text-[10px]">{place.districtName}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary footer */}
                        <div className="p-5 border-t border-white/5">
                            <p className="text-white/30 text-[10px] font-light tracking-wider leading-relaxed">
                                {basket.length} destinations across Sri Lanka · Your concierge will finalize the route, transfers, and timing based on your preferences.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Main Planner View ───────────────────────────────────────────────────

    return (
        <div className="h-screen w-full relative overflow-hidden bg-[#0a0f0d]">

            {/* ── Full-Screen Map ──────────────────────────────────────── */}
            <div className="absolute inset-0 z-0 build-tour-map">
                {typeof window !== 'undefined' && (
                    <MapContainer
                        center={center}
                        zoom={8}
                        minZoom={7}
                        maxZoom={10}
                        zoomControl={false}
                        scrollWheelZoom={false}
                        dragging={false}
                        doubleClickZoom={false}
                        touchZoom={false}
                        boxZoom={false}
                        keyboard={false}
                        maxBounds={sriLankaBounds}
                        maxBoundsViscosity={1.0}
                        style={{ height: '100%', width: '100%', background: '#0a0f0d' }}
                        attributionControl={false}
                    >
                        <GeoJSON
                            ref={geoJsonRef}
                            data={geoData}
                            style={initialStyle}
                            onEachFeature={onEachFeature}
                        />
                        <MapController
                            selectedDistrict={selectedDistrict}
                            geoData={geoData}
                            sriLankaBounds={sriLankaBounds}
                        />
                    </MapContainer>
                )}
            </div>

            {/* ── Top Bar ──────────────────────────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 lg:px-6 py-3">
                {/* Left: Status */}
                <div className="district-label-overlay px-4 py-2.5 rounded-lg flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-antique-gold pulse-dot" />
                    <p className="font-serif text-white/90 tracking-widest text-[11px] uppercase">
                        {viewState === 'district'
                            ? `Exploring ${selectedDistrict?.name}`
                            : 'Select a district to begin'}
                    </p>
                </div>

                {/* Right: Progress + Preview CTA */}
                <div className="flex items-center gap-3">
                    {/* Stop counter */}
                    <div className="district-label-overlay px-4 py-2.5 rounded-lg">
                        <p className="text-white/60 text-[11px] font-serif tracking-wider">
                            <span className="text-antique-gold font-semibold">{basket.length}</span>
                            <span className="text-white/30"> / 10 stops</span>
                        </p>
                    </div>

                    {/* Preview CTA */}
                    <button
                        onClick={() => basket.length >= 2 && setViewState('preview')}
                        disabled={basket.length < 2}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-serif text-[11px] uppercase tracking-widest transition-all duration-500 ${basket.length >= 2
                            ? 'bg-antique-gold text-deep-emerald hover:shadow-lg hover:shadow-antique-gold/30 hover:scale-[1.02]'
                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
                            }`}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Preview Tour
                    </button>
                </div>
            </div>

            {/* ── Back button (district view) ─────────────────────────── */}
            {viewState === 'district' && (
                <button
                    onClick={backToMap}
                    className="absolute top-16 left-4 lg:left-6 z-20 district-label-overlay px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-deep-emerald/80 transition-colors animate-fade-in-up"
                >
                    <ArrowLeft className="w-3.5 h-3.5 text-antique-gold" />
                    <span className="font-serif text-white/70 tracking-wider text-[10px] uppercase">All Districts</span>
                </button>
            )}

            {/* ── District Label Overlay ───────────────────────────────── */}
            {viewState === 'district' && selectedDistrict && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="district-label-overlay px-8 py-4 rounded-xl">
                        <h2 className="text-2xl lg:text-3xl font-serif text-white tracking-wide">{selectedDistrict.name}</h2>
                        <p className="text-antique-gold text-[11px] tracking-[0.25em] uppercase font-light mt-1 gold-shimmer-text">
                            {selectedDistrict.luxury_label}
                        </p>
                    </div>
                </div>
            )}

            {/* ── Gem Place Cards Overlay ──────────────────────────────── */}
            {viewState === 'district' && selectedDistrict && (
                <div className="absolute bottom-4 lg:bottom-8 left-4 lg:left-6 right-4 lg:right-[400px] z-20">
                    {/* Tab buttons */}
                    <div className="flex gap-2 mb-3">
                        <button
                            onClick={() => setGemTab('signature')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-serif uppercase tracking-wider transition-all ${gemTab === 'signature'
                                    ? 'bg-antique-gold/20 text-antique-gold border border-antique-gold/40'
                                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <Sparkles className="w-3 h-3" />
                            Signature
                        </button>
                        <button
                            onClick={() => setGemTab('hidden')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-serif uppercase tracking-wider transition-all ${gemTab === 'hidden'
                                    ? 'bg-antique-gold/20 text-antique-gold border border-antique-gold/40'
                                    : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <Compass className="w-3 h-3" />
                            Hidden Gems
                        </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin" style={{ scrollSnapType: 'x mandatory' }}>
                        {activeGemPlaces.map((gem, idx) => {
                            const inBasket = isInBasket(gem.id);
                            return (
                                <div
                                    key={gem.id}
                                    onClick={() => !inBasket && addToBasket(gem)}
                                    className={`gem-place-card place-card-enter flex-shrink-0 w-[260px] lg:w-[280px] rounded-xl p-4 ${inBasket ? 'added' : ''}`}
                                    style={{
                                        animationDelay: `${idx * 100}ms`,
                                        scrollSnapAlign: 'start',
                                    }}
                                >
                                    {/* Category chip + hidden badge */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full"
                                                style={{
                                                    backgroundColor: getCategoryColor(gem.category) + '25',
                                                    color: getCategoryColor(gem.category),
                                                }}
                                            >
                                                {gem.category}
                                            </span>
                                            {gem.isHidden && (
                                                <span className="text-[8px] text-antique-gold/50 uppercase tracking-wider">Hidden</span>
                                            )}
                                        </div>
                                        {inBasket && (
                                            <span className="text-[9px] text-antique-gold uppercase tracking-wider">Added ✓</span>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <h4 className="font-serif text-white text-[15px] leading-tight mb-2">{gem.name}</h4>

                                    {/* Teaser */}
                                    <p className="text-white/40 text-[11px] font-light leading-relaxed line-clamp-2">{gem.teaser}</p>

                                    {/* Visit time + CTA */}
                                    <div className="flex items-center justify-between mt-3">
                                        {gem.visit_minutes_est > 0 && (
                                            <span className="text-white/25 text-[9px] flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" /> ~{gem.visit_minutes_est} min
                                            </span>
                                        )}
                                        {!inBasket && (
                                            <div className="flex items-center gap-1.5 text-antique-gold/60">
                                                <Sparkles className="w-3 h-3" />
                                                <span className="text-[10px] font-serif uppercase tracking-wider">Add to journey</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Floating Glass Plan Drawer ──────────────────────────── */}
            <div className={`absolute z-30 transition-all duration-500 ease-out
                ${/* Desktop */ ''}
                lg:right-4 lg:bottom-4 lg:top-16 lg:w-[360px]
                ${/* Mobile */ ''}
                bottom-0 left-0 right-0 lg:left-auto
                ${drawerExpanded ? 'max-h-[70vh] lg:max-h-none' : 'max-h-[56px] lg:max-h-none'}
            `}>
                <div className="tour-glass-drawer rounded-t-2xl lg:rounded-xl h-full flex flex-col overflow-hidden">
                    {/* Drawer Header */}
                    <div
                        className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 cursor-pointer lg:cursor-default"
                        onClick={() => setDrawerExpanded(prev => !prev)}
                    >
                        <div className="flex items-center gap-3">
                            <Navigation className="w-4 h-4 text-antique-gold" />
                            <h3 className="font-serif text-white/90 text-sm tracking-wider">Your Journey</h3>
                            {basket.length > 0 && (
                                <span className="w-5 h-5 flex items-center justify-center bg-antique-gold text-deep-emerald font-serif text-[10px] font-bold rounded-full">
                                    {basket.length}
                                </span>
                            )}
                        </div>
                        {/* Mobile toggle */}
                        <button className="lg:hidden p-1 text-white/30">
                            {drawerExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Drawer Content */}
                    <div className={`flex-1 overflow-y-auto px-3 py-2 custom-scrollbar ${drawerExpanded ? '' : 'hidden lg:block'}`}>
                        {basket.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-60">
                                <MapPin className="w-8 h-8 text-antique-gold/40 mb-3" strokeWidth={1} />
                                <p className="font-serif text-white/50 text-xs tracking-wider">
                                    No places selected yet
                                </p>
                                <p className="text-white/25 text-[10px] mt-1.5 font-light max-w-[200px] leading-relaxed">
                                    Click a district, then add gems to build your tour.
                                </p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={basket.map(p => p.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-1">
                                        {basket.map((place, idx) => (
                                            <SortableBasketItem
                                                key={place.id}
                                                place={place}
                                                index={idx}
                                                onRemove={removeFromBasket}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>

                    {/* Preview button inside drawer (mobile) */}
                    {basket.length >= 2 && (
                        <div className={`p-3 border-t border-white/5 ${drawerExpanded ? '' : 'hidden lg:block'}`}>
                            <button
                                onClick={() => setViewState('preview')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-antique-gold text-deep-emerald font-serif text-[11px] uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-antique-gold/30 transition-all"
                            >
                                <Eye className="w-3.5 h-3.5" />
                                Preview Tour
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Global Styles ────────────────────────────────────────── */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.3);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 175, 55, 0.6);
                }
                .district-tooltip {
                    background: rgba(4, 57, 39, 0.92) !important;
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(212, 175, 55, 0.35) !important;
                    color: #FAFAFA !important;
                    font-family: 'Cormorant Garamond', Georgia, serif !important;
                    font-size: 12px !important;
                    font-weight: 600 !important;
                    letter-spacing: 0.08em !important;
                    padding: 8px 16px !important;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
                    border-radius: 8px !important;
                }
                .district-tooltip::before {
                    border-top-color: rgba(212, 175, 55, 0.35) !important;
                }
                .leaflet-container {
                    background: #0a0f0d !important;
                }
            `}</style>
        </div>
    );
}

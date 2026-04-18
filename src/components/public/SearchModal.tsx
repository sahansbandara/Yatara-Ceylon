'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, MapPin, Compass, Sparkles, ArrowRight } from 'lucide-react';

// --- Static Index for Default View (no query) ---
const searchIndex = [
    // Destinations
    { type: 'destination', id: 'd1', title: 'Sigiriya', description: 'The ancient rock fortress', href: '/destinations/sigiriya', icon: MapPin },
    { type: 'destination', id: 'd2', title: 'Kandy', description: 'The cultural capital', href: '/destinations/kandy', icon: MapPin },
    { type: 'destination', id: 'd3', title: 'Galle', description: 'Historic coastal fort', href: '/destinations/galle', icon: MapPin },
    { type: 'destination', id: 'd4', title: 'Ella', description: 'Misty mountains and tea trails', href: '/destinations/ella', icon: MapPin },

    // Journeys — use ?style= to match packets page filter
    { type: 'journey', id: 'j1', title: 'Heritage Trails', description: 'Explore ancient kingdoms and ruins', href: '/packages?style=heritage', icon: Compass },
    { type: 'journey', id: 'j2', title: 'Wildlife & Safari', description: 'Exclusive leopard and elephant safaris', href: '/packages?style=wildlife', icon: Compass },
    { type: 'journey', id: 'j3', title: 'Coastal Retreats', description: 'Pristine beaches and luxury resorts', href: '/packages?style=beach', icon: Compass },
    { type: 'journey', id: 'j4', title: 'All Journeys', description: 'Browse all curated itineraries', href: '/packages', icon: Compass },
];

export function SearchModal() {
    const [open, setOpen] = useState(true);
    const [query, setQuery] = useState('');
    const [liveResults, setLiveResults] = useState<{ type: string, items: any[] }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Debounced search for API
    useEffect(() => {
        if (!query || query.length < 2) {
            setLiveResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/public/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setLiveResults(data.results || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Close the modal and navigate back in history to clear the intercept
    const handleClose = () => {
        setOpen(false);
        router.back();
    };

    const handleSelect = (href: string) => {
        setOpen(false);
        router.back();
        setTimeout(() => {
            router.push(href);
        }, 50);
    };

    // Close on Escape
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                handleClose();
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Initial static results if no query
    const destinations = !query ? searchIndex.filter(r => r.type === 'destination') : [];
    const journeys = !query ? searchIndex.filter(r => r.type === 'journey') : [];


    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={handleClose}
            />

            {/* CMD-K Dialog */}
            <Command
                label="Command Menu"
                className="relative w-full max-w-2xl bg-[rgba(10,20,16,0.55)] backdrop-blur-[18px] backdrop-saturate-[140%] border border-white/[0.08] rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),auto_0_0_0_1px_rgba(255,255,255,0.02)] overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
                shouldFilter={false} // We handle filtering manually via API
            >
                <div className="flex items-center px-5 border-b border-white/[0.08]">
                    <Search className="w-[18px] h-[18px] text-white/50 mr-4" strokeWidth={1.5} />
                    <Command.Input
                        autoFocus
                        value={query}
                        onValueChange={setQuery}
                        placeholder="Search destinations, journeys, experiences..."
                        className="flex-1 h-14 bg-transparent outline-none text-white placeholder:text-white/40 font-nav text-[15px] tracking-wide caret-antique-gold"
                    />
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-nav font-medium tracking-[0.1em] border border-white/10 px-2 py-1 rounded bg-white/[0.04]">
                        <span>ESC to close</span>
                    </div>
                </div>

                {!query && (
                    <div className="px-5 py-5 border-b border-white/[0.04]">
                        <p className="text-[10px] text-white/30 tracking-[0.25em] font-nav uppercase mb-4 pl-1">Popular Quick Links</p>
                        <div className="flex flex-wrap gap-2.5">
                            {[
                                { label: 'Map Search', href: '/build-tour', icon: MapPin },
                                { label: 'All Journeys', href: '/packages', icon: Compass },
                                { label: 'Bespoke Tour', href: '/build-tour', icon: Sparkles },
                            ].map(item => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.label}
                                        onPointerDown={(e) => {
                                            e.preventDefault();
                                            handleSelect(item.href);
                                        }}
                                        className="flex items-center gap-2 px-3.5 py-2 text-[11px] tracking-wide font-nav rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors border border-white/[0.05]"
                                    >
                                        <Icon className="w-3.5 h-3.5 text-antique-gold/70" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <Command.List className="max-h-[60vh] overflow-y-auto p-2 overscroll-contain pb-4 no-scrollbar">
                    {query && liveResults.length === 0 && !isLoading && (
                        <Command.Empty className="py-12 text-center text-white/50 font-nav text-sm tracking-widest">
                            No results found for <span className="text-antique-gold">{query}</span>
                        </Command.Empty>
                    )}
                    
                    {query && isLoading && (
                        <div className="py-12 text-center text-white/50 font-nav text-sm tracking-widest animate-pulse">
                            Searching for <span className="text-antique-gold">{query}</span>...
                        </div>
                    )}

                    {/* LIVE API RESULTS */}
                    {query && liveResults.map((group) => (
                        <Command.Group key={group.type} heading={group.type} className="px-3 py-3 text-[11px] font-nav text-white/30 tracking-widest uppercase mb-1">
                            {group.items.map((item: any) => (
                                <Command.Item
                                    key={item.id}
                                    value={item.id}
                                    onSelect={() => handleSelect(item.href)}
                                    className="flex items-center gap-4 px-4 py-3 mt-1 rounded-xl cursor-pointer transition-all duration-200 aria-selected:bg-white/[0.06] hover:bg-white/[0.06] group"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded bg-white/[0.03] border border-white/10 text-antique-gold/50 group-aria-selected:text-antique-gold transition-colors shrink-0">
                                        {group.type === 'Destinations' ? <MapPin className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className="text-white/90 font-nav font-semibold text-[15px] tracking-wide">{item.title}</span>
                                        <span className="text-white/40 font-nav text-[11px] font-light tracking-wide">{item.description}</span>
                                    </div>
                                    <div className="w-5 h-5 flex items-center justify-center text-white/0 group-hover:text-antique-gold transition-colors duration-300">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Command.Item>
                            ))}
                        </Command.Group>
                    ))}

                    {/* STATIC INITIAL RESULTS */}
                    {!query && destinations.length > 0 && (
                        <Command.Group heading="Destinations" className="px-3 py-3 text-[11px] font-nav text-white/30 tracking-widest uppercase mb-1">
                            {destinations.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Command.Item
                                        key={item.id}
                                        value={item.id}
                                        onSelect={() => handleSelect(item.href)}
                                        className="flex items-center gap-4 px-4 py-3 mt-1 rounded-xl cursor-pointer transition-all duration-200 aria-selected:bg-white/[0.06] hover:bg-white/[0.06] group"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded bg-white/[0.03] border border-white/10 text-antique-gold/50 group-aria-selected:text-antique-gold transition-colors shrink-0">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="text-white/90 font-nav font-semibold text-[15px] tracking-wide">{item.title}</span>
                                            <span className="text-white/40 font-nav text-[11px] font-light tracking-wide">{item.description}</span>
                                        </div>
                                        <div className="w-5 h-5 flex items-center justify-center text-white/0 group-hover:text-antique-gold transition-colors duration-300">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Command.Item>
                                );
                            })}
                        </Command.Group>
                    )}

                    {!query && journeys.length > 0 && (
                        <Command.Group heading="Journeys" className="px-3 py-3 text-[11px] font-nav text-white/30 tracking-widest uppercase border-t border-white/[0.04] mt-2 mb-1">
                            {journeys.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Command.Item
                                        key={item.id}
                                        value={item.id}
                                        onSelect={() => handleSelect(item.href)}
                                        className="flex items-center gap-4 px-4 py-3 mt-1 rounded-xl cursor-pointer transition-all duration-200 aria-selected:bg-white/[0.06] hover:bg-white/[0.06] group"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded bg-white/[0.03] border border-white/10 text-antique-gold/50 group-aria-selected:text-antique-gold transition-colors shrink-0">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="text-white/90 font-nav font-semibold text-[15px] tracking-wide">{item.title}</span>
                                            <span className="text-white/40 font-nav text-[11px] font-light tracking-wide">{item.description}</span>
                                        </div>
                                        <div className="w-5 h-5 flex items-center justify-center text-white/0 group-hover:text-antique-gold transition-colors duration-300">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Command.Item>
                                );
                            })}
                        </Command.Group>
                    )}
                </Command.List>
            </Command>
        </div>
    );
}

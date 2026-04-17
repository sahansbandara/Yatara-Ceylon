'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
    Search,
    CalendarCheck,
    Package,
    MapPin,
    Car,
    Handshake,
    Users,
    X,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
    Bookings: CalendarCheck,
    Packages: Package,
    Destinations: MapPin,
    Vehicles: Car,
    Partners: Handshake,
    Users: Users,
};

interface SearchItem {
    _id: string;
    label: string;
    sublabel: string;
    href: string;
}

interface SearchResult {
    type: string;
    items: SearchItem[];
}

export function CommandBar() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // ⌘K / Ctrl+K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(o => !o);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const search = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        }
        setLoading(false);
    }, []);

    const handleInputChange = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(value), 300);
    };

    const handleSelect = (href: string) => {
        setOpen(false);
        setQuery('');
        setResults([]);
        router.push(href);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setOpen(false)}
            />

            {/* Command panel */}
            <div className="relative mx-auto mt-[15vh] w-full max-w-xl">
                <Command
                    className="rounded-2xl border border-white/10 bg-[#0c1612] shadow-2xl overflow-hidden"
                    shouldFilter={false}
                >
                    {/* Input */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                        <Search className="h-5 w-5 text-white/30 flex-shrink-0" />
                        <Command.Input
                            value={query}
                            onValueChange={handleInputChange}
                            placeholder="Search bookings, packages, vehicles, partners..."
                            className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                            autoFocus
                        />
                        {loading && (
                            <div className="w-4 h-4 border-2 border-antique-gold/30 border-t-antique-gold rounded-full animate-spin" />
                        )}
                        <button
                            onClick={() => setOpen(false)}
                            className="p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
                        >
                            <X className="h-4 w-4 text-white/30" />
                        </button>
                    </div>

                    {/* Results */}
                    <Command.List className="max-h-[50vh] overflow-y-auto p-2">
                        {query.length < 2 ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-xs text-white/30">
                                    Type at least 2 characters to search
                                </p>
                                <p className="text-[10px] text-white/20 mt-1">
                                    ⌘K to toggle · ESC to close
                                </p>
                            </div>
                        ) : results.length === 0 && !loading ? (
                            <Command.Empty className="px-4 py-8 text-center">
                                <p className="text-xs text-white/30">
                                    No results found for "{query}"
                                </p>
                            </Command.Empty>
                        ) : (
                            results.map(group => {
                                const GroupIcon = ICON_MAP[group.type] || Search;
                                return (
                                    <Command.Group
                                        key={group.type}
                                        heading={
                                            <div className="flex items-center gap-2 px-3 py-2 text-[10px] tracking-[0.15em] uppercase text-white/25 font-semibold">
                                                <GroupIcon className="h-3 w-3" />
                                                {group.type}
                                            </div>
                                        }
                                    >
                                        {group.items.map(item => (
                                            <Command.Item
                                                key={item._id}
                                                value={item.label}
                                                onSelect={() => handleSelect(item.href)}
                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-white/[0.04] data-[selected=true]:bg-white/[0.06] transition-colors"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white/85 text-xs font-medium truncate">
                                                        {item.label}
                                                    </p>
                                                    <p className="text-[10px] text-white/35 truncate">
                                                        {item.sublabel}
                                                    </p>
                                                </div>
                                            </Command.Item>
                                        ))}
                                    </Command.Group>
                                );
                            })
                        )}
                    </Command.List>
                </Command>
            </div>
        </div>
    );
}

// Trigger button for the sidebar
export function CommandBarTrigger({ onClick }: { onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/35 hover:text-white/60 hover:bg-white/[0.04] border border-transparent transition-all duration-300"
        >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="text-[9px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
                ⌘K
            </kbd>
        </button>
    );
}

'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function HeroSection() {
    const [date, setDate] = useState<Date>();
    const [location, setLocation] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);

    // Attempted autoplay fix
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
        }
    }, []);

    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-deep-emerald font-sans">
            {/* Background Video/Image */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full opacity-60 mix-blend-overlay"
                    poster="https://images.unsplash.com/photo-1588258387711-540e53db3838?q=80&w=1920&auto=format&fit=crop"
                >
                    <source src="/Hero-Section.mp4" type="video/mp4" />
                </video>
                {/* Overlay - Subtler luxury tint */}
                <div className="absolute inset-0 bg-deep-emerald/30 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-deep-emerald/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-off-white px-4 md:px-8 max-w-7xl mx-auto pt-20">
                <div className="text-center space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block py-1 px-4 text-xs tracking-[0.2em] uppercase font-medium text-antique-gold border border-antique-gold/30 rounded-none bg-deep-emerald/40 backdrop-blur-md">
                        High-End Boutique Travel
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif tracking-normal leading-tight">
                        <span className="italic font-light">The Soul of Your</span> <br />
                        Island Journey.
                    </h1>
                    <p className="text-lg md:text-xl text-off-white/80 max-w-2xl mx-auto font-light leading-relaxed">
                        Experience a synchronized odyssey through the heart of Ceylon.
                        Bespoke itineraries, private transitions, and heritage unlocked.
                    </p>

                    {/* Minimalist CTA */}
                    <div className="mt-8">
                        <Button className="h-12 px-8 bg-transparent border border-antique-gold text-antique-gold hover:bg-antique-gold hover:text-deep-emerald font-medium uppercase tracking-widest text-sm transition-all duration-300 rounded-none">
                            Begin Your Journey
                        </Button>
                    </div>
                </div>

                {/* Search Box - Luxury Redesign */}
                <div className="w-full max-w-4xl bg-black/20 backdrop-blur-md border border-off-white/10 rounded-none p-4 md:p-2 shadow-2xl animate-in fade-in zoom-in duration-1000 delay-300">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Location Input */}
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-antique-gold/50 group-focus-within:text-antique-gold transition-colors">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Where to?"
                                className="w-full h-12 pl-10 pr-4 bg-black/20 border border-off-white/10 rounded-none focus:outline-none focus:ring-1 focus:ring-antique-gold focus:bg-black/40 text-off-white placeholder:text-off-white/50 transition-all font-light tracking-wide"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        {/* Date Picker */}
                        <div className="relative">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full h-12 justify-start text-left font-light tracking-wide bg-black/20 border-off-white/10 text-off-white hover:bg-black/40 hover:text-off-white focus:ring-1 focus:ring-antique-gold rounded-none",
                                            !date && "text-off-white/50"
                                        )}
                                    >
                                        <Calendar className="mr-2 h-4 w-4 text-antique-gold/50" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 border-antique-gold/20 bg-deep-emerald text-off-white rounded-none" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        className="bg-deep-emerald text-off-white font-sans"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Package Type */}
                        <div className="relative">
                            <Select>
                                <SelectTrigger className="w-full h-12 bg-black/20 border-off-white/10 text-off-white hover:bg-black/40 focus:ring-1 focus:ring-antique-gold rounded-none font-light tracking-wide">
                                    <SelectValue placeholder="Tour Type" />
                                </SelectTrigger>
                                <SelectContent className="bg-deep-emerald border-antique-gold/20 text-off-white rounded-none">
                                    <SelectItem value="beach" className="focus:bg-antique-gold/20 focus:text-antique-gold">Beach Relax</SelectItem>
                                    <SelectItem value="adventure" className="focus:bg-antique-gold/20 focus:text-antique-gold">Adventure</SelectItem>
                                    <SelectItem value="cultural" className="focus:bg-antique-gold/20 focus:text-antique-gold">Cultural</SelectItem>
                                    <SelectItem value="wildlife" className="focus:bg-antique-gold/20 focus:text-antique-gold">Wildlife</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Button */}
                        <Button className="h-12 w-full bg-antique-gold hover:bg-antique-gold/80 hover:scale-[1.02] text-deep-emerald font-semibold uppercase tracking-widest rounded-none transition-all duration-300 flex items-center justify-center gap-2">
                            <Search className="h-4 w-4" />
                            Search
                        </Button>
                    </div>
                </div>

                {/* Scrolldown indicator */}
                <div className="absolute bottom-8 animate-bounce hidden md:block">
                    <span className="text-antique-gold/60 text-xs tracking-[0.3em] uppercase">Scroll to explore</span>
                </div>
            </div>
        </div>
    );
}

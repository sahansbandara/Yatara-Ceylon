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
        <div className="relative h-[85vh] w-full overflow-hidden">
            {/* Background Video/Image */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full"
                    poster="https://images.unsplash.com/photo-1588258387711-540e53db3838?q=80&w=1920&auto=format&fit=crop"
                >
                    <source src="https://videos.pexels.com/video-files/2435348/2435348-uhd_2560_1440_30fps.mp4" type="video/mp4" />
                    {/* Fallback image if video fails or blocked */}
                    <div className="absolute inset-0 bg-ocean-900" />
                </video>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 md:px-8 max-w-7xl mx-auto pt-20">
                <div className="text-center space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide">
                        Explore Sri Lanka with Us
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                        Discover the Pearl of the <br />
                        <span className="text-ocean-300">Indian Ocean</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light">
                        Experience breathtaking landscapes, pristine beaches, and rich culture.
                        Your perfect island getaway starts here.
                    </p>
                </div>

                {/* Search Box */}
                <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-2 shadow-2xl animate-in fade-in zoom-in duration-1000 delay-300">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Location Input */}
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-ocean-400 transition-colors">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Where to?"
                                className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:bg-white/10 text-white placeholder:text-gray-400 transition-all font-medium"
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
                                            "w-full h-12 justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white border-white/10 focus:ring-2 focus:ring-ocean-400",
                                            !date && "text-gray-400"
                                        )}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Package Type */}
                        <div className="relative">
                            <Select>
                                <SelectTrigger className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 focus:ring-2 focus:ring-ocean-400">
                                    <SelectValue placeholder="Tour Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beach">Beach Relax</SelectItem>
                                    <SelectItem value="adventure">Adventure</SelectItem>
                                    <SelectItem value="cultural">Cultural</SelectItem>
                                    <SelectItem value="wildlife">Wildlife</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Search Button */}
                        <Button className="h-12 w-full bg-ocean-600 hover:bg-ocean-700 text-white font-bold rounded-xl shadow-lg hover:shadow-ocean-500/30 transition-all flex items-center justify-center gap-2">
                            <Search className="h-5 w-5" />
                            Search
                        </Button>
                    </div>
                </div>

                {/* Scrolldown indicator */}
                <div className="absolute bottom-8 animate-bounce hidden md:block">
                    <span className="text-white/60 text-sm tracking-widest uppercase">Scroll to explore</span>
                </div>
            </div>
        </div>
    );
}

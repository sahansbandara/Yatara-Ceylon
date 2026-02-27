'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { tourCategories } from '@/data/tourCategories';

import 'swiper/css';
import 'swiper/css/navigation';

export default function TourCategoriesCarousel() {
    return (
        <section className="py-24 md:py-28 relative overflow-hidden bg-ocean-50/60">
            {/* Subtle decorative background */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-ocean-200/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-antique-gold/5 blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                {/* Header Row — title left, description center, CTA right */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                    {/* Title */}
                    <div>
                        <span className="inline-block mb-3 text-xs tracking-[0.3em] font-medium text-antique-gold uppercase">
                            Explore by Interest
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald leading-tight">
                            Tour<br />Categories
                        </h2>
                    </div>

                    {/* Description + CTA */}
                    <div className="flex items-center gap-6">
                        <p className="text-gray-500 font-light max-w-sm text-[15px] leading-relaxed hidden md:block">
                            From ancient heritage trails to serene wellness retreats, discover your perfect Sri Lankan journey.
                        </p>

                        {/* Icon circle CTA (Walkers pattern) */}
                        <Link
                            href="/packages"
                            className="flex items-center gap-3 text-deep-emerald hover:text-antique-gold transition-colors group shrink-0"
                        >
                            <div className="w-10 h-10 rounded-full border-2 border-deep-emerald group-hover:border-antique-gold flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:shadow-antique-gold/15">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-xs tracking-[0.2em] font-semibold uppercase">EXPLORE</span>
                        </Link>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex gap-3 mb-6 justify-end">
                    <button
                        id="cat-prev"
                        aria-label="Previous category"
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-deep-emerald hover:border-deep-emerald transition-all duration-300"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        id="cat-next"
                        aria-label="Next category"
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-deep-emerald hover:border-deep-emerald transition-all duration-300"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Swiper Slider */}
            <div className="pl-4 md:pl-8 lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))]">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView="auto"
                    navigation={{
                        prevEl: '#cat-prev',
                        nextEl: '#cat-next',
                    }}
                    breakpoints={{
                        0: { slidesPerView: 1.2, spaceBetween: 16 },
                        480: { slidesPerView: 1.5, spaceBetween: 16 },
                        640: { slidesPerView: 2.2, spaceBetween: 20 },
                        1024: { slidesPerView: 3.2, spaceBetween: 24 },
                        1280: { slidesPerView: 3.8, spaceBetween: 24 },
                    }}
                    className="pb-4"
                >
                    {tourCategories.map((cat, idx) => (
                        <SwiperSlide key={idx} className="!w-auto">
                            <Link
                                href={cat.href}
                                className="block w-[280px] md:w-[320px] group"
                            >
                                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        sizes="(max-width: 768px) 280px, 320px"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-deep-emerald/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <div className="flex items-center gap-3 text-white">
                                            <Plus className="w-5 h-5" />
                                            <span className="text-xs tracking-[0.2em] font-semibold uppercase">EXPLORE</span>
                                        </div>
                                    </div>

                                    {/* Bottom label with gold underline accent */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-white font-display text-lg tracking-wide">
                                            {cat.title}
                                        </h3>
                                        <div className="h-0.5 w-12 bg-antique-gold mt-2 group-hover:w-20 transition-all duration-500" />
                                        <p className="text-white/60 text-xs font-light mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                                            {cat.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

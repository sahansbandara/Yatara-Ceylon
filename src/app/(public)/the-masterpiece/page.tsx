import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TheMasterpiecePage() {
    return (
        <div className="min-h-screen bg-[#F9F8F6] pt-24">
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden m-4 md:m-8 rounded-3xl">
                <Image
                    src="/images/home/faq-luxury-experience.webp"
                    alt="The Masterpiece"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/50" />
                
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <span className="block text-xs md:text-sm tracking-[0.4em] text-white/80 font-nav uppercase mb-6 drop-shadow-md">
                        The Yatara Standard
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display text-white mb-8 leading-tight drop-shadow-xl font-light">
                        Discover The <span className="italic">Masterpiece</span>
                    </h1>
                </div>
            </section>

            <section className="py-20 md:py-28 px-6 max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-display text-deep-emerald mb-8">
                    Crafting Unparalleled Experiences
                </h2>
                <p className="text-gray-600 font-light leading-relaxed mb-12 text-lg">
                    Every Yatara journey is a masterpiece—meticulously curated, flawlessly executed, and deeply personal. We believe that true luxury lies in the details that others overlook. From private after-hours access to sacred archaeological sites to Michelin-caliber dining on secluded shores, we orchestrate moments that transcend the ordinary. Your dedicated 24/7 concierge ensures absolute exclusivity and seamless perfection, allowing you to immerse yourself fully in the magic of Sri Lanka.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-deep-emerald hover:text-[#D4AF37] uppercase transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Return Home
                </Link>
            </section>
        </div>
    );
}

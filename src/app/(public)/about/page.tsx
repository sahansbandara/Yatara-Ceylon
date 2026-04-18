import Image from 'next/image';
import Link from 'next/link';
import AboutExperienceSection from './_components/AboutExperienceSection';
import AboutWhyYataraSection from './_components/AboutWhyYataraSection';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/images/home/curated-kingdoms.png"
                    alt="Sri Lanka aerial"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Est. 2012 — Colombo, Sri Lanka
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Sri Lanka&apos;s Leading<br />
                            <span className="italic font-light text-[#D4AF37]">Destination Management</span><br />
                            Company
                        </h1>
                    </div>
                </div>
            </section>

            {/* About Section — 3-Column Layout */}
            <AboutExperienceSection />

            {/* Why Book With Us Section */}
            <AboutWhyYataraSection />

            {/* Premium Call to Action Divider */}
            <div className="relative py-8 md:py-12 w-full overflow-hidden flex items-center justify-center bg-[#E3EFE9]">
                <div
                    className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply"
                    style={{
                        backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                        backgroundSize: '400px',
                        backgroundPosition: 'top left',
                        backgroundRepeat: 'repeat'
                    }}
                />
                <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
                    <span className="inline-block mb-3 md:mb-4 text-xs md:text-sm tracking-[0.4em] font-medium text-[#D4AF37] uppercase drop-shadow-sm">
                        Your Journey Starts Here
                    </span>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-deep-emerald font-normal leading-tight tracking-tight mb-8">
                        Ready to Explore <span className="italic font-light text-[#D4AF37]">Ceylon</span>?
                    </h3>
                    <Link
                        href="/inquire"
                        className="inline-block px-10 py-4 rounded-full bg-[#D4AF37] text-[#0a1f15] text-xs md:text-sm tracking-[0.2em] font-semibold uppercase hover:bg-[#D4AF37]/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                    >
                        START PLANNING
                    </Link>
                </div>
            </div>
        </div>
    );
}

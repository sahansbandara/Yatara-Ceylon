import Image from 'next/image';

const TRUST_LOGOS = [
    {
        name: 'Sri Lanka Tourism',
        src: '/images/partners/sltda-logo.webp',
        alt: 'Sri Lanka Tourism Development Authority',
    },
    {
        name: 'PATA',
        src: '/images/partners/pata-logo.webp',
        alt: 'Pacific Asia Travel Association',
    },
    {
        name: 'Travelife',
        src: '/images/partners/travelife-logo.webp',
        alt: 'Travelife member',
    },
    {
        name: 'TourCert',
        src: '/images/partners/tourcert-logo.webp',
        alt: 'TourCert certification',
    },
    {
        name: 'Tripadvisor',
        src: '/images/partners/tripadvisor-logo.webp',
        alt: 'Tripadvisor presence',
    },
    {
        name: 'Biodiversity Sri Lanka',
        src: '/images/partners/biodiversity-logo.webp',
        alt: 'Biodiversity Sri Lanka partner',
    },
];

export default function TrustedByStrip() {
    return (
        <section className="border-y border-deep-emerald/8 bg-white py-6 md:py-8">
            <div className="home-section-inner">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-xl">
                        <p className="text-[10px] font-nav font-semibold uppercase tracking-[0.3em] text-antique-gold">
                            Trust & Memberships
                        </p>
                        <p className="mt-3 text-sm font-light leading-relaxed tracking-normal text-deep-emerald/70">
                            Accreditations, sustainability memberships, and travel partnerships that reinforce the care behind every private departure.
                        </p>
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:max-w-3xl lg:grid-cols-6">
                        {TRUST_LOGOS.map((logo) => (
                            <div
                                key={logo.name}
                                className="flex h-16 items-center justify-center rounded-2xl border border-deep-emerald/8 bg-off-white/70 px-4"
                            >
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    width={120}
                                    height={48}
                                    className="max-h-10 w-auto object-contain opacity-80"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

import Image from 'next/image';

export default function HeritageStory() {
    return (
        <section className="py-32 bg-white text-deep-emerald relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-antique-gold/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-deep-emerald/3 rounded-full blur-3xl opacity-50" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Column 1: Cinematic Image with Glass Overlay */}
                    <div className="relative">
                        <div className="relative h-[650px] w-full lg:w-11/12 rounded-2xl overflow-hidden shadow-2xl group">
                            <Image
                                src="/images/home/heritage-story.png"
                                alt="Sri Lankan Heritage"
                                fill
                                className="object-cover transform group-hover:scale-[1.03] transition-transform duration-1000"
                            />
                            {/* Inner vignette overlay */}
                            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(4,57,39,0.2)]" />
                            {/* Glass stat overlay */}
                            <div className="absolute bottom-6 left-6 right-6 liquid-glass-button rounded-xl px-6 py-4 flex items-center justify-between">
                                <div className="text-center">
                                    <p className="text-xl font-display text-white">3,000+</p>
                                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/60">Years of History</p>
                                </div>
                                <div className="h-8 w-px bg-white/20" />
                                <div className="text-center">
                                    <p className="text-xl font-display text-white">8</p>
                                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/60">UNESCO Sites</p>
                                </div>
                                <div className="h-8 w-px bg-white/20" />
                                <div className="text-center">
                                    <p className="text-xl font-display text-white">26</p>
                                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/60">National Parks</p>
                                </div>
                            </div>
                        </div>
                        {/* Decorative background box */}
                        <div className="absolute -bottom-6 -right-6 lg:-right-0 w-3/4 h-3/4 border border-antique-gold/20 rounded-2xl -z-10" />
                    </div>

                    {/* Column 2: Story Text with Glass Accent */}
                    <div className="lg:pl-8">
                        <span className="inline-block mb-5 text-xs tracking-[0.3em] font-medium text-antique-gold uppercase">
                            Our Heritage Story
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-display text-deep-emerald mb-8 leading-tight">
                            Synchronizing your journey with the <span className="italic font-light">heartbeat of Ceylon.</span>
                        </h2>

                        <div className="space-y-6 text-gray-600 font-light leading-relaxed text-[15px]">
                            <p>
                                Yatara Ceylon is born from a desire to show you the island not as a tourist, but as a welcomed guest into a profound cultural tapestry. We sidestep the crowded paths to offer you the quiet dignity of ancient kingdoms, the pristine isolation of southern shorelines, and the rolling mists of the high country.
                            </p>
                            <p>
                                Every itinerary we craft is an original composition—a synchronized odyssey blending absolute luxury with raw, authentic heritage.
                            </p>
                        </div>

                        {/* Founder attribution */}
                        <div className="mt-10 pt-6 border-t border-deep-emerald/[0.06]">
                            <p className="text-[11px] tracking-[0.2em] uppercase text-deep-emerald/40 font-nav">
                                Curators of Fine Travel · Est. 2014
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

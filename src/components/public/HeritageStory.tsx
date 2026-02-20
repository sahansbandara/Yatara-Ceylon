import Image from 'next/image';

export default function HeritageStory() {
    return (
        <section className="py-24 bg-white text-deep-emerald relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-antique-gold/5 rounded-full blur-3xl opacity-50" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Column 1: Cinematic Image */}
                    <div className="relative">
                        <div className="relative h-[650px] w-full lg:w-11/12 rounded-none overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&auto=format&fit=crop&q=80"
                                alt="Sri Lankan Heritage"
                                fill
                                className="object-cover transform hover:scale-105 transition-transform duration-1000"
                            />
                            {/* Inner vignette overlay */}
                            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(4,57,39,0.2)]" />
                        </div>
                        {/* Decorative background box */}
                        <div className="absolute -bottom-6 -right-6 lg:-right-0 w-3/4 h-3/4 border border-antique-gold/30 -z-10" />
                    </div>

                    {/* Column 2: Story Text */}
                    <div className="lg:pl-8">
                        <span className="inline-block mb-4 text-xs tracking-[0.2em] font-medium text-antique-gold uppercase">
                            Our Heritage Story
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-serif text-deep-emerald mb-8 leading-tight">
                            Synchronizing your journey with the <span className="italic font-light">heartbeat of Ceylon.</span>
                        </h2>

                        <div className="space-y-6 text-gray-600 font-light leading-relaxed">
                            <p>
                                Yatara Ceylon is born from a desire to show you the island not as a tourist, but as a welcomed guest into a profound cultural tapestry. We sidestep the crowded paths to offer you the quiet dignity of ancient kingdoms, the pristine isolation of southern shorelines, and the rolling mists of the high country.
                            </p>
                            <p>
                                Every itinerary we craft is an original composition—a synchronized odyssey blending absolute luxury with raw, authentic heritage.
                            </p>
                        </div>

                        <div className="mt-12 flex items-center gap-6">
                            <div className="h-12 w-12 rounded-full border border-antique-gold flex items-center justify-center">
                                <span className="font-serif text-antique-gold text-xl italic">Y</span>
                            </div>
                            <div>
                                <p className="text-xs tracking-[0.2em] uppercase text-deep-emerald font-semibold">The Founders</p>
                                <p className="text-sm font-light text-gray-500">Curators of Fine Travel</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

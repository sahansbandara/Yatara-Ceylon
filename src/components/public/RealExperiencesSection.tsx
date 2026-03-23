import { Star } from 'lucide-react';
import { testimonials, trustStats } from '@/data/testimonials';

const TESTIMONIAL_FOCUS: Record<string, string> = {
    'Charlotte & James': 'Honeymoon',
    'Marc Delafosse': 'Cultural Circuit',
    'Sarah Mitchell': 'Family Journey',
};

export default function RealExperiencesSection() {
    const featuredTestimonials = testimonials.slice(0, 3);

    return (
        <section className="home-section-shell bg-white">
            <div className="home-section-inner">
                <div className="mb-12 max-w-2xl">
                    <p className="home-kicker">Real Experiences</p>
                    <h2 className="home-heading mt-4">
                        Social proof feels stronger when it sounds grounded
                    </h2>
                    <p className="home-copy mt-5">
                        These cards stay short, contextual, and close to the conversion end of the page. That keeps the proof credible instead of turning it into decorative filler.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {featuredTestimonials.map((testimonial) => (
                        <article
                            key={testimonial.name}
                            className="flex h-full flex-col rounded-[28px] border border-deep-emerald/8 bg-off-white p-6 shadow-[0_14px_36px_rgba(4,57,39,0.05)]"
                        >
                            <div className="flex gap-1 text-antique-gold">
                                {Array.from({ length: testimonial.rating }).map((_, index) => (
                                    <Star
                                        key={`${testimonial.name}-${index}`}
                                        className="h-4 w-4 fill-current"
                                    />
                                ))}
                            </div>

                            <p className="mt-6 text-lg font-display leading-relaxed tracking-tight text-deep-emerald">
                                “{testimonial.quote}”
                            </p>

                            <div className="mt-8 border-t border-deep-emerald/8 pt-5">
                                <p className="text-xl font-display tracking-tight text-deep-emerald">
                                    {testimonial.name}
                                </p>
                                <p className="mt-2 text-[10px] font-nav font-semibold uppercase tracking-[0.2em] text-antique-gold">
                                    {testimonial.country} · {TESTIMONIAL_FOCUS[testimonial.name] || 'Private Journey'} · Private planning
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {trustStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-[24px] border border-deep-emerald/8 bg-[#f3f6f2] p-5 text-center"
                        >
                            <p className="text-3xl font-display tracking-tight text-deep-emerald">
                                {stat.value}
                                {stat.suffix}
                            </p>
                            <p className="mt-2 text-[10px] font-nav font-semibold uppercase tracking-[0.2em] text-deep-emerald/40">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

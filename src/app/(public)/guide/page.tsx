import { Metadata } from 'next';
import SectionHeading from '@/components/public/SectionHeading';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Sri Lanka Travel Guide | Yatara Ceylon',
    description: 'Expert insider guides to Sri Lanka — from the best time to visit to hidden cultural gems. Curated by our local concierge team.',
};

const articles = [
    {
        id: 'best-time-to-visit',
        title: 'The Best Time to Visit Sri Lanka',
        blurb: 'Navigate the dual monsoon seasons and discover why every month offers something extraordinary on this tropical island.',
        category: 'Planning',
        readTime: '5 min read',
    },
    {
        id: 'tea-country-guide',
        title: 'A Connoisseur\'s Guide to Ceylon Tea Country',
        blurb: 'From Nuwara Eliya to Ella — the private estate visits, railway journeys, and colonial bungalows that define hill country luxury.',
        category: 'Experiences',
        readTime: '8 min read',
    },
    {
        id: 'wildlife-safari-tips',
        title: 'Safari in Sri Lanka: Beyond Yala',
        blurb: 'Leopard tracking in Wilpattu, elephant gatherings at Minneriya, and the birding paradise of Bundala — a wildlife insider\'s perspective.',
        category: 'Wildlife',
        readTime: '7 min read',
    },
    {
        id: 'temple-etiquette',
        title: 'Temple Etiquette & Sacred Sites',
        blurb: 'Essential cultural protocols for visiting Sri Lanka\'s most revered Buddhist, Hindu, and colonial-era heritage sites with grace.',
        category: 'Culture',
        readTime: '4 min read',
    },
    {
        id: 'southern-coast-beaches',
        title: 'The Southern Coast: Sri Lanka\'s Riviera',
        blurb: 'A stretch of coast from Galle Fort to Tangalle that rivals any in Asia — private villas, surf breaks, and whale watching.',
        category: 'Coastal',
        readTime: '6 min read',
    },
    {
        id: 'hill-country-railway',
        title: 'The Legendary Kandy-to-Ella Railway',
        blurb: 'Often called the world\'s most scenic train journey. Here\'s how to experience it in first class — or with a private car alongside.',
        category: 'Experiences',
        readTime: '5 min read',
    },
    {
        id: 'ayurveda-wellness',
        title: 'Ayurveda & Wellness Retreats',
        blurb: 'Sri Lanka\'s 3,000-year Ayurvedic tradition meets modern luxury wellness — the island\'s best retreats and what to expect.',
        category: 'Wellness',
        readTime: '6 min read',
    },
    {
        id: 'culinary-journey',
        title: 'A Culinary Journey Through Ceylon',
        blurb: 'Hoppers at dawn, crab curry in Colombo, spice garden tastings in Matale — the essential food experiences for luxury travelers.',
        category: 'Culinary',
        readTime: '7 min read',
    },
    {
        id: 'sigiriya-cultural-triangle',
        title: 'Sigiriya & the Cultural Triangle',
        blurb: 'UNESCO World Heritage sites, ancient cave temples, and royal ruins — how to experience 2,500 years of history with a private historian.',
        category: 'Heritage',
        readTime: '8 min read',
    },
];

const categoryColors: Record<string, string> = {
    Planning: 'bg-ocean-100 text-ocean-700',
    Experiences: 'bg-antique-gold/10 text-antique-gold',
    Wildlife: 'bg-forest-100 text-forest-600',
    Culture: 'bg-sand-100 text-sand-500',
    Coastal: 'bg-ocean-50 text-ocean-600',
    Wellness: 'bg-forest-50 text-forest-500',
    Culinary: 'bg-sand-50 text-sand-500',
    Heritage: 'bg-antique-gold/5 text-deep-emerald',
};

export default function GuidePage() {
    return (
        <div className="min-h-screen bg-off-white pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block py-1 px-4 text-xs tracking-[0.2em] uppercase font-medium text-antique-gold border border-antique-gold/30 mb-6 bg-deep-emerald/5">
                        Insider Knowledge
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-deep-emerald mb-4">
                        Sri Lanka Travel Guide
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Expert insights from our local concierge team — everything you need to know before,
                        during, and after your journey through Ceylon.
                    </p>
                    <div className="h-px w-24 bg-antique-gold mt-6 opacity-50 mx-auto" />
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <article
                            key={article.id}
                            className="group bg-white border border-gray-100 hover:border-antique-gold/30 hover:shadow-lg transition-all duration-500 flex flex-col"
                        >
                            {/* Category + Reading time bar */}
                            <div className="px-8 pt-8 flex items-center justify-between">
                                <span className={`text-[10px] tracking-[0.15em] uppercase font-medium px-3 py-1 ${categoryColors[article.category] || 'bg-gray-100 text-gray-500'}`}>
                                    {article.category}
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-300 text-xs">
                                    <Clock className="w-3 h-3" strokeWidth={1.5} />
                                    {article.readTime}
                                </span>
                            </div>

                            <div className="px-8 pb-8 pt-5 flex flex-col flex-1">
                                <h3 className="text-xl font-serif text-deep-emerald mb-3 group-hover:text-antique-gold transition-colors duration-300 leading-snug">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-gray-400 font-light leading-relaxed flex-1 mb-6">
                                    {article.blurb}
                                </p>
                                <Link
                                    href="#"
                                    className="inline-flex items-center text-xs tracking-[0.15em] text-deep-emerald hover:text-antique-gold uppercase font-medium transition-colors duration-300 group/link"
                                >
                                    Read Guide
                                    <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform duration-200" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-20 py-16 border-t border-gray-200">
                    <h3 className="text-2xl font-serif text-deep-emerald mb-4">Ready to experience it yourself?</h3>
                    <p className="text-gray-400 font-light mb-8 max-w-lg mx-auto">
                        Our concierge team turns these guides into real itineraries — tailored to you.
                    </p>
                    <Link
                        href="/inquire"
                        className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] bg-deep-emerald text-white px-10 py-4 hover:bg-antique-gold hover:text-deep-emerald transition-all duration-300"
                    >
                        Request a Curated Proposal
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

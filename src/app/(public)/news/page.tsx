import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

const featuredArticle = {
    title: 'Sri Lanka Named Top Travel Destination for 2026',
    excerpt: 'Leading travel publications have recognised Sri Lanka as one of the must-visit destinations for 2026, citing its rich cultural heritage, diverse wildlife, and rapidly growing luxury tourism infrastructure.',
    date: 'February 28, 2026',
    category: 'Industry News',
    image: '/images/home/curated-kingdoms.png',
};

const articles = [
    {
        title: 'Yatara Ceylon Launches New Wellness Tourism Division',
        excerpt: 'Our new wellness brand combines traditional Ayurveda with modern luxury, offering curated retreat experiences across the island.',
        date: 'February 20, 2026',
        category: 'Company News',
        image: '/images/cat-ayurvedic.png',
    },
    {
        title: 'The Best Time to Visit Sri Lanka: A Season-by-Season Guide',
        excerpt: 'Sri Lanka is a year-round destination, but timing your visit right can unlock unique experiences from whale migrations to cultural festivals.',
        date: 'February 15, 2026',
        category: 'Travel Tips',
        image: '/images/cat-coastal.png',
    },
    {
        title: 'New Luxury Train Experience Launches on Colombo-Kandy Route',
        excerpt: 'A premium rail experience offering panoramic windows, gourmet dining, and heritage storytelling along one of Asia\'s most scenic railways.',
        date: 'February 10, 2026',
        category: 'Industry News',
        image: '/images/cat-hillcountry.png',
    },
    {
        title: '5 Hidden Gems in Sri Lanka Most Tourists Miss',
        excerpt: 'Beyond Sigiriya and Ella — discover lesser-known treasures from secret waterfalls to untouched coastal villages.',
        date: 'February 5, 2026',
        category: 'Travel Tips',
        image: '/images/home/heritage-story.png',
    },
    {
        title: 'Yatara Ceylon Partners with Global Sustainability Initiative',
        excerpt: 'We are proud to join the Global Sustainable Tourism Council, reinforcing our commitment to responsible and eco-conscious travel.',
        date: 'January 28, 2026',
        category: 'Sustainability',
        image: '/images/home/signature-wildlife.png',
    },
    {
        title: 'Sri Lanka\'s Culinary Renaissance: A Food Lover\'s Guide',
        excerpt: 'From Michelin-quality restaurants in Colombo to ancestral recipes in village kitchens — Sri Lanka\'s food scene is booming.',
        date: 'January 20, 2026',
        category: 'Travel Tips',
        image: '/images/home/signature-ceylon.png',
    },
];

export default function NewsPage() {
    return (
        <div className="min-h-screen bg-off-white">
            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <Image
                    src="/images/home/signature-ceylon.png"
                    alt="News & Travel Insights"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-deep-emerald/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f15]/80 via-transparent to-deep-emerald/90" />

                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center max-w-3xl px-4">
                        <span className="inline-block mb-4 text-xs tracking-[0.4em] font-medium text-[#D4AF37] uppercase">
                            Stories & Insights
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display text-white leading-tight">
                            Travel<br />
                            <span className="italic font-light text-[#D4AF37]">Bites</span>
                        </h1>
                        <p className="mt-6 text-white/70 font-light text-lg max-w-xl mx-auto">
                            Latest news, travel tips, and insights from the heart of Sri Lankan tourism.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            <section className="py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden border border-deep-emerald/5 shadow-sm hover:shadow-xl transition-all duration-500">
                        <div className="relative h-72 lg:h-auto overflow-hidden">
                            <Image
                                src={featuredArticle.image}
                                alt={featuredArticle.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs tracking-[0.15em] uppercase text-[#D4AF37] font-medium flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {featuredArticle.category}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {featuredArticle.date}
                                </span>
                            </div>
                            <h2 className="text-3xl font-display text-deep-emerald mb-4 leading-snug">
                                {featuredArticle.title}
                            </h2>
                            <p className="text-gray-500 font-light leading-relaxed mb-6">
                                {featuredArticle.excerpt}
                            </p>
                            <span className="text-xs tracking-[0.15em] uppercase text-[#D4AF37] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">
                                READ MORE <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Grid */}
            <section className="pb-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">Latest Stories</span>
                        <h2 className="text-4xl md:text-5xl font-display text-deep-emerald mt-3">
                            Recent Articles
                        </h2>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article, idx) => (
                            <article key={idx} className="group rounded-2xl overflow-hidden bg-white border border-deep-emerald/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                                <div className="relative h-48 overflow-hidden">
                                    <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4">
                                        <span className="text-[10px] tracking-[0.1em] uppercase bg-[#D4AF37] text-[#0a1f15] font-semibold px-3 py-1 rounded-full">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <span className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                                        <Calendar className="w-3 h-3" /> {article.date}
                                    </span>
                                    <h3 className="text-lg font-display text-deep-emerald mb-2 leading-snug group-hover:text-[#D4AF37] transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-500 font-light text-sm leading-relaxed mb-4">{article.excerpt}</p>
                                    <span className="text-xs tracking-[0.15em] uppercase text-[#D4AF37] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">
                                        READ MORE <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 bg-deep-emerald">
                <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
                        Stay Inspired
                    </h2>
                    <p className="text-white/60 font-light mb-8">
                        Subscribe to our newsletter for exclusive travel insights, insider tips, and special offers from Yatara Ceylon.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 font-light text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.15em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                        >
                            SUBSCRIBE
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

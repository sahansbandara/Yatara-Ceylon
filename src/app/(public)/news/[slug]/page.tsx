import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Tag, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { featuredArticle, articles } from '@/data/news';

export const dynamic = 'force-dynamic';

function getArticle(slug: string) {
    if (featuredArticle.slug === slug) return featuredArticle;
    return articles.find(a => a.slug === slug) || null;
}

function getRelatedArticles(currentSlug: string) {
    const all = [featuredArticle, ...articles];
    return all.filter(a => a.slug !== currentSlug).slice(0, 3);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticle(slug);
    if (!article) return { title: 'Article Not Found' };
    
    return {
        title: `${article.title} | Yatara Ceylon News`,
        description: article.excerpt,
    };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = getArticle(slug);

    if (!article) {
        notFound();
    }

    const relatedArticles = getRelatedArticles(slug);

    return (
        <div className="min-h-screen bg-off-white pb-24">
            {/* Hero Image */}
            <div className="relative h-[55vh] md:h-[65vh] w-full">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f15] via-[#0a1f15]/50 to-transparent" />
                
                {/* Back Link */}
                <div className="absolute top-12 left-6 md:left-12 z-20">
                    <Link href="/news" className="inline-flex items-center gap-2 text-white/80 hover:text-[#D4AF37] text-xs tracking-[0.15em] uppercase font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to News
                    </Link>
                </div>
                
                {/* Hero Content */}
                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-4xl mx-auto px-6 md:px-12 pb-16 w-full text-center">
                        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                            <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#D4AF37] bg-[#D4AF37]/10 backdrop-blur-sm px-3 py-1 rounded-full border border-[#D4AF37]/20">
                                {article.category}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display text-white mb-6 leading-tight drop-shadow-lg">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap justify-center items-center gap-6 text-white/60 text-sm font-light">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                                {article.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#D4AF37]" />
                                {article.readTime}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-6 md:px-12 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl p-8 md:p-14 shadow-xl border border-gray-100/80 mb-16">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-10">
                        <div>
                            <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium">Author</p>
                            <p className="text-deep-emerald font-medium mt-1">{article.author}</p>
                        </div>
                        {/* Social Share Mock */}
                        <div className="flex gap-4">
                            <button className="text-gray-400 hover:text-[#D4AF37] transition-colors text-xs font-medium tracking-widest uppercase">Share</button>
                        </div>
                    </div>
                    
                    {/* Render HTML Safely (mock data is strictly controlled by us) */}
                    <div 
                        className="prose prose-lg prose-gray max-w-none text-gray-600 font-light leading-relaxed prose-headings:font-display prose-headings:text-deep-emerald prose-headings:font-normal prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:mb-6 prose-a:text-[#D4AF37] prose-blockquote:border-l-[#D4AF37] prose-blockquote:bg-gray-50 prose-blockquote:p-6 prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:rounded-r-xl"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-display text-deep-emerald">More Stories</h2>
                        <Link href="/news" className="text-xs tracking-[0.15em] uppercase text-[#D4AF37] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedArticles.map((rel, idx) => (
                            <Link key={idx} href={`/news/${rel.slug}`} className="group block">
                                <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100/80 h-full hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={rel.image}
                                            alt={rel.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#0a1f15] bg-[#D4AF37] px-3 py-1 rounded-full shadow-md">
                                                {rel.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <span className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                                            <Calendar className="w-3 h-3" /> {rel.date}
                                        </span>
                                        <h3 className="font-display text-deep-emerald text-lg mb-2 group-hover:text-[#D4AF37] transition-colors leading-snug">
                                            {rel.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Newsletter Minimal */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 pb-20">
                <div className="bg-[#E3EFE9] text-deep-emerald rounded-2xl p-10 md:p-14 text-center relative overflow-hidden border border-deep-emerald/5">
                   {/* Background Pattern Overlay */}
                    <div
                        className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply"
                        style={{
                            backgroundImage: "url('/images/home/curated-bg-pattern.webp')",
                            backgroundSize: '400px',
                            backgroundPosition: 'top left',
                            backgroundRepeat: 'repeat'
                        }}
                    />
                   <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-antique-gold/[0.04] rounded-full blur-3xl pointer-events-none" />
                   <div className="relative z-10 max-w-2xl mx-auto">
                        <Tag className="w-8 h-8 text-[#D4AF37] mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl font-display text-deep-emerald mb-4">Never Miss a Journey</h2>
                        <p className="text-deep-emerald/70 font-light mb-8">Subscribe for hand-picked stories from Sri Lanka and exclusive travel insights.</p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-5 py-3 rounded-full bg-white border border-deep-emerald/20 text-deep-emerald placeholder:text-deep-emerald/40 font-light text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 rounded-full bg-[#D4AF37] text-[#0a1f15] text-sm tracking-[0.15em] font-semibold uppercase hover:bg-[#D4AF37]/90 transition-all shadow-lg"
                            >
                                Subscribe
                            </button>
                        </form>
                   </div>
                </div>
            </div>
        </div>
    );
}

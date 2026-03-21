'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface PackageFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function PackageForm({ initialData, isEdit = false }: PackageFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        summary: initialData?.summary || '',
        fullDescription: initialData?.fullDescription || '',
        priceMin: initialData?.priceMin || 0,
        priceMax: initialData?.priceMax || 0,
        duration: initialData?.duration || '',
        durationDays: initialData?.durationDays || '',
        type: initialData?.type || 'journey',
        style: initialData?.style || '',
        itinerary: initialData?.itinerary || [{ day: 1, title: '', description: '', activity: '' }],
        isPublished: initialData?.isPublished || false,
        isFeatured: initialData?.isFeatured || false,
    });

    // Text areas for array fields (one per line)
    const [highlightsText, setHighlightsText] = useState(initialData?.highlights?.join('\n') || '');
    const [inclusionsText, setInclusionsText] = useState(initialData?.inclusions?.join('\n') || '');
    const [exclusionsText, setExclusionsText] = useState(initialData?.exclusions?.join('\n') || '');
    const [tagsText, setTagsText] = useState(initialData?.tags?.join('\n') || '');
    const [imagesText, setImagesText] = useState(initialData?.images?.join('\n') || '');

    const handleItineraryChange = (index: number, field: string, value: string) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const addItineraryDay = () => {
        setFormData({
            ...formData,
            itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: '', description: '', activity: '' }],
        });
    };

    const removeItineraryDay = (index: number) => {
        const newItinerary = formData.itinerary.filter((_: any, i: number) => i !== index);
        const reindexed = newItinerary.map((item: any, i: number) => ({ ...item, day: i + 1 }));
        setFormData({ ...formData, itinerary: reindexed });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: Record<string, any> = {
            title: formData.title,
            slug: formData.slug,
            summary: formData.summary,
            fullDescription: formData.fullDescription,
            priceMin: formData.priceMin,
            priceMax: formData.priceMax,
            duration: formData.duration,
            durationDays: formData.durationDays ? Number(formData.durationDays) : undefined,
            type: formData.type,
            style: formData.style || undefined,
            itinerary: formData.itinerary.map((item: any) => ({
                day: item.day,
                title: item.title,
                description: item.description || '',
                activity: item.activity || undefined,
            })),
            highlights: highlightsText.split('\n').filter((s: string) => s.trim()),
            inclusions: inclusionsText.split('\n').filter((s: string) => s.trim()),
            exclusions: exclusionsText.split('\n').filter((s: string) => s.trim()),
            tags: tagsText.split('\n').filter((s: string) => s.trim()),
            images: imagesText.split('\n').filter((s: string) => s.trim()),
            isPublished: formData.isPublished,
            isFeatured: formData.isFeatured,
        };

        try {
            const url = isEdit ? `/api/packages/${initialData._id}` : '/api/packages';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/dashboard/packages');
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || error.error || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl liquid-glass-stat-dark p-8 rounded-2xl border border-white/[0.08] shadow-2xl text-white">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 text-sm text-white/80 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="rounded border-white/20 bg-white/5 text-antique-gold focus:ring-antique-gold/50 h-5 w-5"
                        />
                        Published
                    </label>
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="border-antique-gold/40 text-antique-gold hover:bg-antique-gold/10 rounded-xl h-10 px-6 transition-all">Cancel</Button>
                    <Button type="submit" disabled={loading} className="bg-antique-gold hover:bg-antique-gold/90 text-[#020b08] shadow-[0_0_20px_rgba(212,175,55,0.2)] rounded-xl h-10 px-6 font-semibold transition-all">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#020b08]/60" /> : null}
                        {isEdit ? 'Update Package' : 'Create Package'}
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:w-[600px] bg-black/40 border border-white/10 rounded-xl p-1 h-12">
                    <TabsTrigger value="general" className="data-[state=active]:bg-antique-gold data-[state=active]:text-[#020b08] text-white/60 rounded-lg h-full transition-all">General</TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-antique-gold data-[state=active]:text-[#020b08] text-white/60 rounded-lg h-full transition-all">Details</TabsTrigger>
                    <TabsTrigger value="itinerary" className="data-[state=active]:bg-antique-gold data-[state=active]:text-[#020b08] text-white/60 rounded-lg h-full transition-all">Itinerary</TabsTrigger>
                    <TabsTrigger value="media" className="data-[state=active]:bg-antique-gold data-[state=active]:text-[#020b08] text-white/60 rounded-lg h-full transition-all">Media</TabsTrigger>
                    <TabsTrigger value="tags" className="data-[state=active]:bg-antique-gold data-[state=active]:text-[#020b08] text-white/60 rounded-lg h-full transition-all">Tags & Meta</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-6">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-1">Basic Information</h3>
                            <p className="text-sm text-white/40">Core details of the tour package.</p>
                        </div>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="text-white/70">Package Title</Label>
                                <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: isEdit ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-11 rounded-xl" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug" className="text-white/70">Slug (URL)</Label>
                                <Input id="slug" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-11 rounded-xl" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="summary" className="text-white/70">Short Summary</Label>
                                <Textarea id="summary" required value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} placeholder="One-line promise for this package" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" />
                            </div>
                            <div className="grid grid-cols-3 gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="priceMin" className="text-white/70">Price Min (LKR)</Label>
                                    <Input id="priceMin" type="number" required value={formData.priceMin} onChange={(e) => setFormData({ ...formData, priceMin: Number(e.target.value) })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-11 rounded-xl" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="priceMax" className="text-white/70">Price Max (LKR)</Label>
                                    <Input id="priceMax" type="number" required value={formData.priceMax} onChange={(e) => setFormData({ ...formData, priceMax: Number(e.target.value) })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-11 rounded-xl" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="duration" className="text-white/70">Duration (display)</Label>
                                    <Input id="duration" required placeholder="e.g. 10 Days / 9 Nights" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                                </div>
                            </div>

                            {/* Type / Style / Duration Days */}
                            <div className="grid grid-cols-3 gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="type" className="text-white/70">Type</Label>
                                    <select
                                        id="type"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-[#030d09] px-3 py-2 text-sm text-white focus-visible:outline-none focus:ring-2 focus:ring-antique-gold/20 transition-all cursor-pointer hover:bg-white/[0.02]"
                                    >
                                        <option value="journey">Journey</option>
                                        <option value="transfer">Transfer</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="style" className="text-white/70">Style</Label>
                                    <select
                                        id="style"
                                        value={formData.style}
                                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                                        className="flex h-11 w-full rounded-xl border border-white/[0.08] bg-[#030d09] px-3 py-2 text-sm text-white focus-visible:outline-none focus:ring-2 focus:ring-antique-gold/20 transition-all cursor-pointer hover:bg-white/[0.02]"
                                    >
                                        <option value="">— No style —</option>
                                        <option value="cultural">Cultural</option>
                                        <option value="wildlife">Wildlife</option>
                                        <option value="heritage">Heritage</option>
                                        <option value="experiences">Experiences</option>
                                        <option value="wellness">Wellness</option>
                                        <option value="family">Family</option>
                                        <option value="luxury">Luxury</option>
                                        <option value="adventure">Adventure</option>
                                        <option value="beach">Beach</option>
                                        <option value="marine">Marine</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="durationDays" className="text-white/70">Duration (days number)</Label>
                                    <Input id="durationDays" type="number" min={1} placeholder="e.g. 10" value={formData.durationDays} onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                                </div>
                            </div>

                            {/* Featured toggle */}
                            <label className="flex items-center gap-3 text-sm text-white/80 cursor-pointer pt-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="rounded border-white/20 bg-white/5 text-antique-gold focus:ring-antique-gold/50 h-5 w-5"
                                />
                                Featured Journey (shown in featured row)
                            </label>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-6">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-1">Description & Inclusions</h3>
                            <p className="text-sm text-white/40">Full editorial description and package features.</p>
                        </div>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="fullDescription" className="text-white/70">Full Description</Label>
                                <Textarea id="fullDescription" className="min-h-[200px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} placeholder="Editorial description of this journey..." />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="highlights" className="text-white/70">Highlights / Signature Moments (One per line)</Label>
                                <Textarea id="highlights" className="min-h-[150px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} placeholder="Private Cultural Triangle day with sunrise option&#10;Tea estate afternoon + tasting experience&#10;Scenic train segment (reserved seats)" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="inclusions" className="text-white/70">Inclusions (One per line)</Label>
                                    <Textarea id="inclusions" className="min-h-[150px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" value={inclusionsText} onChange={(e) => setInclusionsText(e.target.value)} placeholder="Private air-conditioned vehicle + driver&#10;Curated hotel collection (4–5 star)&#10;Daily breakfast" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="exclusions" className="text-white/70">Exclusions (One per line)</Label>
                                    <Textarea id="exclusions" className="min-h-[150px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" value={exclusionsText} onChange={(e) => setExclusionsText(e.target.value)} placeholder="International flights&#10;Visa fees&#10;Lunch & dinner (unless stated)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-4 mt-6">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                        <div className="flex flex-row items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Daily Itinerary</h3>
                                <p className="text-sm text-white/40">Plan the trip day by day.</p>
                            </div>
                            <Button type="button" size="sm" onClick={addItineraryDay} className="bg-antique-gold hover:bg-antique-gold/90 text-[#020b08] font-medium rounded-lg h-9">
                                <Plus className="mr-2 h-4 w-4" /> Add Day
                            </Button>
                        </div>
                        <div className="space-y-5">
                            {formData.itinerary.map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 items-start border border-white/[0.08] p-5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors relative group">
                                    <div className="mt-1 text-sm font-bold bg-antique-gold/10 text-antique-gold border-antique-gold/30 w-10 h-10 flex items-center justify-center rounded-full border shadow-sm shrink-0">
                                        {item.day}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="grid gap-2">
                                            <Label className="text-white/70">Title</Label>
                                            <Input value={item.title} onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} placeholder="Arrival in Colombo" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-white/70">Description</Label>
                                            <Textarea value={item.description} onChange={(e) => handleItineraryChange(index, 'description', e.target.value)} placeholder="Activities for the day..." className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 min-h-[100px] rounded-xl" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-white/70">Highlight Activity (optional)</Label>
                                            <Input value={item.activity || ''} onChange={(e) => handleItineraryChange(index, 'activity', e.target.value)} placeholder="e.g. Sigiriya Sunrise, Safari Drive" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all h-8 w-8" onClick={() => removeItineraryDay(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-6">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-1">Images</h3>
                            <p className="text-sm text-white/40">First image is the hero/featured image. Add one URL per line.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="images" className="text-white/70">Image URLs (One per line, first = hero)</Label>
                                <Textarea id="images" className="min-h-[150px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder="/images/home/signature-heritage.png&#10;/images/home/pkg_ramayana_1772119639135.png" />
                            </div>
                            {imagesText.split('\n').filter((s: string) => s.trim()).length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {imagesText.split('\n').filter((s: string) => s.trim()).slice(0, 6).map((url: string, i: number) => (
                                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-black/40">
                                            <img src={url.trim()} alt={`Preview ${i + 1}`} className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity" />
                                            {i === 0 && <span className="absolute top-2 left-2 text-[10px] uppercase font-bold tracking-wider bg-antique-gold text-[#020b08] px-2 py-1 rounded-md shadow-lg">Hero</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="tags" className="space-y-4 mt-6">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-1">Tags & Metadata</h3>
                            <p className="text-sm text-white/40">Tags help with filtering and categorization.</p>
                        </div>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="tags" className="text-white/70">Tags (One per line)</Label>
                                <Textarea id="tags" className="min-h-[120px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Luxury&#10;First-Time&#10;Couples&#10;Private Guide&#10;Boutique Stays" />
                            </div>
                            {tagsText.split('\n').filter((s: string) => s.trim()).length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tagsText.split('\n').filter((s: string) => s.trim()).map((tag: string, i: number) => (
                                        <span key={i} className="text-xs font-medium bg-antique-gold/10 text-antique-gold px-3 py-1.5 rounded-full border border-antique-gold/20 backdrop-blur-sm">
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    );
}

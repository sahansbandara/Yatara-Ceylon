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
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            className="rounded border-gray-300"
                        />
                        Published
                    </label>
                </div>
                <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading} className="bg-ocean-600 hover:bg-ocean-700">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isEdit ? 'Update Package' : 'Create Package'}
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="tags">Tags & Meta</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Core details of the tour package.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Package Title</Label>
                                <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: isEdit ? formData.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input id="slug" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="summary">Short Summary</Label>
                                <Textarea id="summary" required value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} placeholder="One-line promise for this package" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="priceMin">Price Min (LKR)</Label>
                                    <Input id="priceMin" type="number" required value={formData.priceMin} onChange={(e) => setFormData({ ...formData, priceMin: Number(e.target.value) })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="priceMax">Price Max (LKR)</Label>
                                    <Input id="priceMax" type="number" required value={formData.priceMax} onChange={(e) => setFormData({ ...formData, priceMax: Number(e.target.value) })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="duration">Duration (display)</Label>
                                    <Input id="duration" required placeholder="e.g. 10 Days / 9 Nights" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                                </div>
                            </div>

                            {/* Type / Style / Duration Days */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        id="type"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="journey">Journey</option>
                                        <option value="transfer">Transfer</option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="style">Style</Label>
                                    <select
                                        id="style"
                                        value={formData.style}
                                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                    <Label htmlFor="durationDays">Duration (days number)</Label>
                                    <Input id="durationDays" type="number" min={1} placeholder="e.g. 10" value={formData.durationDays} onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })} />
                                </div>
                            </div>

                            {/* Featured toggle */}
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="rounded border-gray-300"
                                />
                                Featured Journey (shown in featured row)
                            </label>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description & Inclusions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="fullDescription">Full Description</Label>
                                <Textarea id="fullDescription" className="min-h-[200px]" value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} placeholder="Editorial description of this journey..." />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="highlights">Highlights / Signature Moments (One per line)</Label>
                                <Textarea id="highlights" className="min-h-[150px]" value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} placeholder="Private Cultural Triangle day with sunrise option&#10;Tea estate afternoon + tasting experience&#10;Scenic train segment (reserved seats)" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="inclusions">Inclusions (One per line)</Label>
                                    <Textarea id="inclusions" className="min-h-[150px]" value={inclusionsText} onChange={(e) => setInclusionsText(e.target.value)} placeholder="Private air-conditioned vehicle + driver&#10;Curated hotel collection (4–5 star)&#10;Daily breakfast" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="exclusions">Exclusions (One per line)</Label>
                                    <Textarea id="exclusions" className="min-h-[150px]" value={exclusionsText} onChange={(e) => setExclusionsText(e.target.value)} placeholder="International flights&#10;Visa fees&#10;Lunch & dinner (unless stated)" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Daily Itinerary</CardTitle>
                                <CardDescription>Plan the trip day by day.</CardDescription>
                            </div>
                            <Button type="button" size="sm" onClick={addItineraryDay} variant="secondary">
                                <Plus className="mr-2 h-4 w-4" /> Add Day
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {formData.itinerary.map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 items-start border p-4 rounded-lg bg-gray-50/50">
                                    <div className="mt-2 text-sm font-bold bg-emerald-950/40 text-antique-gold border-antique-gold/30 w-8 h-8 flex items-center justify-center rounded-full border shadow-sm shrink-0">
                                        {item.day}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="grid gap-2">
                                            <Label>Title</Label>
                                            <Input value={item.title} onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} placeholder="Arrival in Colombo" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Description</Label>
                                            <Textarea value={item.description} onChange={(e) => handleItineraryChange(index, 'description', e.target.value)} placeholder="Activities for the day..." />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Highlight Activity (optional)</Label>
                                            <Input value={item.activity || ''} onChange={(e) => handleItineraryChange(index, 'activity', e.target.value)} placeholder="e.g. Sigiriya Sunrise, Safari Drive" />
                                        </div>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItineraryDay(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                            <CardDescription>First image is the hero/featured image. Add one URL per line.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="images">Image URLs (One per line, first = hero)</Label>
                                <Textarea id="images" className="min-h-[150px]" value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder="/images/home/signature-heritage.png&#10;/images/home/pkg_ramayana_1772119639135.png" />
                            </div>
                            {imagesText.split('\n').filter((s: string) => s.trim()).length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {imagesText.split('\n').filter((s: string) => s.trim()).slice(0, 6).map((url: string, i: number) => (
                                        <div key={i} className="relative aspect-video rounded-lg overflow-hidden border bg-gray-100">
                                            <img src={url.trim()} alt={`Preview ${i + 1}`} className="object-cover w-full h-full" />
                                            {i === 0 && <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">Hero</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tags" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags & Metadata</CardTitle>
                            <CardDescription>Tags help with filtering and categorization.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="tags">Tags (One per line)</Label>
                                <Textarea id="tags" className="min-h-[120px]" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Luxury&#10;First-Time&#10;Couples&#10;Private Guide&#10;Boutique Stays" />
                            </div>
                            {tagsText.split('\n').filter((s: string) => s.trim()).length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tagsText.split('\n').filter((s: string) => s.trim()).map((tag: string, i: number) => (
                                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border">
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </form>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
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
        description: initialData?.description || '',
        price: initialData?.price || 0,
        duration: initialData?.duration || '',
        groupSize: initialData?.groupSize || '',
        difficulty: initialData?.difficulty || '',
        imageUrl: initialData?.imageUrl || '',
        gallery: initialData?.gallery || [],
        itinerary: initialData?.itinerary || [{ day: 1, title: '', description: '' }],
        includes: initialData?.includes || [],
        excludes: initialData?.excludes || [],
        isPublished: initialData?.isPublished || false,
        isFeatured: initialData?.isFeatured || false,
    });

    // Helper to handle itinerary changes
    const handleItineraryChange = (index: number, field: string, value: string) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const addItineraryDay = () => {
        setFormData({
            ...formData,
            itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: '', description: '' }],
        });
    };

    const removeItineraryDay = (index: number) => {
        const newItinerary = formData.itinerary.filter((_: any, i: number) => i !== index);
        // Re-index days
        const reindexed = newItinerary.map((item: any, i: number) => ({ ...item, day: i + 1 }));
        setFormData({ ...formData, itinerary: reindexed });
    };

    // Helper for string arrays (includes/excludes/gallery)
    const handleArrayChange = (field: 'includes' | 'excludes' | 'gallery', value: string) => {
        // Simple comma-separated input for now, or distinct inputs?
        // Let's use textarea line-separated or comma-separated for simplicity in this version
        setFormData({ ...formData, [field]: value.split('\n').filter(s => s.trim()) });
    };

    // Using simple text areas for arrays for now to save UI complexity
    const [includesText, setIncludesText] = useState(initialData?.includes?.join('\n') || '');
    const [excludesText, setExcludesText] = useState(initialData?.excludes?.join('\n') || '');
    const [galleryText, setGalleryText] = useState(initialData?.gallery?.join('\n') || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            includes: includesText.split('\n').filter((s: string) => s.trim()),
            excludes: excludesText.split('\n').filter((s: string) => s.trim()),
            gallery: galleryText.split('\n').filter((s: string) => s.trim()),
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
                alert(`Error: ${error.message || 'Something went wrong'}`);
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
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-ocean-600 hover:bg-ocean-700">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isEdit ? 'Update Package' : 'Create Package'}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
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
                                <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: isEdit ? formData.slug : e.target.value.toLowerCase().replace(/ /g, '-') })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input id="slug" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="summary">Short Summary</Label>
                                <Textarea id="summary" required value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input id="price" type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input id="duration" required placeholder="e.g. 5 Days / 4 Nights" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="groupSize">Group Size</Label>
                                    <Input id="groupSize" placeholder="2-10 People" value={formData.groupSize} onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="difficulty">Difficulty</Label>
                                    <Input id="difficulty" placeholder="Easy / Moderate / Hard" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Full Description (Markdown supported)</Label>
                                <Textarea id="description" className="min-h-[200px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="includes">Included (One per line)</Label>
                                    <Textarea id="includes" className="min-h-[150px]" value={includesText} onChange={(e) => setIncludesText(e.target.value)} placeholder="Airport transfer&#10;Breakfast&#10;Guide" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="excludes">Excluded (One per line)</Label>
                                    <Textarea id="excludes" className="min-h-[150px]" value={excludesText} onChange={(e) => setExcludesText(e.target.value)} placeholder="Flight tickets&#10;Lunch&#10;Tips" />
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
                                    <div className="mt-2 text-sm font-bold bg-white w-8 h-8 flex items-center justify-center rounded-full border shadow-sm shrink-0">
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
                            <CardDescription>Manage package images.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="imageUrl">Featured Image URL</Label>
                                <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
                                {formData.imageUrl && (
                                    <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border bg-gray-100 mt-2">
                                        <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gallery">Gallery Image URLs (One per line)</Label>
                                <Textarea id="gallery" className="min-h-[150px]" value={galleryText} onChange={(e) => setGalleryText(e.target.value)} placeholder="https://image1.jpg&#10;https://image2.jpg" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </form>
    );
}

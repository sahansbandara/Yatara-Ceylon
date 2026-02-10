'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface DestinationFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function DestinationForm({ initialData, isEdit = false }: DestinationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        location: initialData?.location || '',
        description: initialData?.description || '',
        longDescription: initialData?.longDescription || '',
        images: initialData?.images || [],
        isPublished: initialData?.isPublished || false,
    });

    const [imagesText, setImagesText] = useState(initialData?.images?.join('\n') || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            images: imagesText.split('\n').filter((s: string) => s.trim())
        };

        try {
            const url = isEdit ? `/api/destinations/${initialData._id}` : '/api/destinations';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/dashboard/destinations');
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-ocean-600 hover:bg-ocean-700">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isEdit ? 'Update Destination' : 'Create Destination'}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Destination Details</CardTitle>
                    <CardDescription>Information about the destination.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: isEdit ? formData.slug : e.target.value.toLowerCase().replace(/ /g, '-') })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="location">Location (City/District)</Label>
                        <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Kandy, Central Province" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Short Description</Label>
                        <Textarea id="description" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="longDescription">Long Description (Markdown supported)</Label>
                        <Textarea id="longDescription" className="min-h-[200px]" value={formData.longDescription} onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="images">Images (URLs, one per line)</Label>
                        <Textarea id="images" className="min-h-[150px]" value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder="https://image1.jpg&#10;https://image2.jpg" />
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

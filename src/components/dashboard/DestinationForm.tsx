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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl liquid-glass-stat-dark p-8 rounded-2xl border border-white/[0.08] shadow-2xl text-white">
            <div className="flex flex-col mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">Destination Details</h2>
                <p className="text-white/40 text-sm">Information about the destination.</p>
            </div>

            <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-white/70">Title</Label>
                        <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: isEdit ? formData.slug : e.target.value.toLowerCase().replace(/ /g, '-') })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-11 rounded-xl" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug" className="text-white/70">Slug (URL)</Label>
                        <Input id="slug" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-11 rounded-xl" />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="location" className="text-white/70">Location (City/District)</Label>
                    <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Kandy, Central Province" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description" className="text-white/70">Short Description</Label>
                    <Textarea id="description" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 min-h-[100px] rounded-xl" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="longDescription" className="text-white/70">Long Description (Markdown supported)</Label>
                    <Textarea id="longDescription" className="min-h-[200px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 rounded-xl" value={formData.longDescription} onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="images" className="text-white/70">Images (URLs, one per line)</Label>
                    <Textarea id="images" className="min-h-[150px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder="https://image1.jpg&#10;https://image2.jpg" />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.06] mt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} className="border-antique-gold/40 text-antique-gold hover:bg-antique-gold/10 rounded-xl h-10 px-6 transition-all">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-antique-gold hover:bg-antique-gold/90 text-[#020b08] shadow-[0_0_20px_rgba(212,175,55,0.2)] rounded-xl h-10 px-6 font-semibold transition-all">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#020b08]/60" /> : null}
                    {isEdit ? 'Update Destination' : 'Create Destination'}
                </Button>
            </div>
        </form>
    );
}

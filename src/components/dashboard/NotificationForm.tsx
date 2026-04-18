'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Eye, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface NotificationFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function NotificationForm({ initialData, isEdit = false }: NotificationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        body: initialData?.body || '',
        type: initialData?.type || 'UPDATE',
        visibleTo: initialData?.visibleTo || 'ALL',
        isPublished: initialData?.isPublished ?? true,
    });
    const audienceLabels: Record<string, string> = {
        ALL: 'All Users',
        CUSTOMERS: 'Customers Only',
        STAFF: 'Staff Only',
        VEHICLE_OWNERS: 'Vehicle Owners',
        HOTEL_OWNERS: 'Hotel Owners',
    };
    const typeAccents: Record<string, string> = {
        ALERT: 'bg-rose-500',
        OFFER: 'bg-emerald-500',
        UPDATE: 'bg-blue-500',
    };

    const audienceLabel = audienceLabels[formData.visibleTo] || formData.visibleTo;
    const typeAccent = typeAccents[formData.type] || 'bg-blue-500';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/notifications/${initialData._id}` : '/api/notifications';
            const res = await fetch(url, {
                method: isEdit ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard/notifications');
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || error.message || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-6xl liquid-glass-stat-dark p-8 rounded-2xl border border-white/[0.08] shadow-2xl text-white">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-6">
                    <div className="flex flex-col mb-4">
                        <h2 className="text-xl font-semibold text-white mb-2">Notification Details</h2>
                        <p className="text-white/40 text-sm">
                            {isEdit ? 'Update visibility, publish status, and message content.' : 'Configure who sees this notification and its importance.'}
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-white/70">Title</Label>
                            <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" placeholder="System Update" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="body" className="text-white/70">Message Body</Label>
                            <Textarea id="body" required value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl min-h-[120px]" placeholder="We will be undergoing maintenance..." />
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="type" className="text-white/70">Type</Label>
                                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                        <SelectItem value="UPDATE" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Update</SelectItem>
                                        <SelectItem value="OFFER" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Offer</SelectItem>
                                        <SelectItem value="ALERT" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Alert</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="visibleTo" className="text-white/70">Target Audience</Label>
                                <Select value={formData.visibleTo} onValueChange={(val) => setFormData({ ...formData, visibleTo: val })}>
                                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                        <SelectValue placeholder="Select audience" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                        <SelectItem value="ALL" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">All Users</SelectItem>
                                        <SelectItem value="CUSTOMERS" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Customers Only</SelectItem>
                                        <SelectItem value="STAFF" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Staff Only</SelectItem>
                                        <SelectItem value="VEHICLE_OWNERS" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Vehicle Owners</SelectItem>
                                        <SelectItem value="HOTEL_OWNERS" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Hotel Owners</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="isPublished" className="text-white/70">Publish Status</Label>
                                <Select value={formData.isPublished ? 'true' : 'false'} onValueChange={(val) => setFormData({ ...formData, isPublished: val === 'true' })}>
                                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                        <SelectValue placeholder="Select publish status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                        <SelectItem value="true" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Published</SelectItem>
                                        <SelectItem value="false" className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.06] mt-4">
                        <Button type="button" variant="glass-outline" onClick={() => router.back()} className="text-white/60 hover:text-white">Cancel</Button>
                        <Button type="submit" variant="glass-outline" disabled={loading} className="font-semibold text-antique-gold">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-antique-gold/60" /> : null}
                            {isEdit ? 'Update Notification' : 'Send Notification'}
                        </Button>
                    </div>
                </div>

                <aside className="xl:sticky xl:top-24 h-fit rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2 text-white/70">
                            <Eye className="h-4 w-4 text-antique-gold" />
                            <span className="text-sm font-semibold">Live Preview</span>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                            formData.isPublished
                                ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                                : 'border border-white/10 bg-white/[0.04] text-white/45'
                        }`}>
                            {formData.isPublished ? 'Published' : 'Draft'}
                        </span>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-[#061a15]/80 shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-white/70" />
                                <span className="text-sm font-medium text-white/90">Notification Center</span>
                            </div>
                            <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full">
                                {audienceLabel}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1 p-4 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${typeAccent}`} />
                                <span className="text-xs font-semibold text-white/85">
                                    {formData.title || 'Your notification title will appear here'}
                                </span>
                            </div>
                            <p className="text-[12px] text-white/55 pl-4 leading-5">
                                {formData.body || 'Your message preview updates as you type so you can check tone, length, and clarity before publishing.'}
                            </p>
                        </div>

                        <div className="grid gap-3 p-4 text-[11px] text-white/45">
                            <div className="flex items-center justify-between gap-3">
                                <span>Type</span>
                                <span className="text-white/70">{formData.type}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Audience</span>
                                <span className="text-white/70">{audienceLabel}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Status</span>
                                <span className="text-white/70">{formData.isPublished ? 'Visible immediately' : 'Saved as draft only'}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </form>
    );
}

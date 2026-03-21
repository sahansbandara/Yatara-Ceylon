'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function NotificationForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        type: 'UPDATE',
        visibleTo: 'ALL',
        isPublished: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard/notifications');
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
                <h2 className="text-xl font-semibold text-white mb-2">Notification Details</h2>
                <p className="text-white/40 text-sm">Configure who sees this notification and its importance.</p>
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

                <div className="grid grid-cols-2 gap-5">
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
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.06] mt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} className="border-antique-gold/40 text-antique-gold hover:bg-antique-gold/10 rounded-xl h-10 px-6 transition-all">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-antique-gold hover:bg-antique-gold/90 text-[#020b08] shadow-[0_0_20px_rgba(212,175,55,0.2)] rounded-xl h-10 px-6 font-semibold">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#020b08]/60" /> : null}
                    Send Notification
                </Button>
            </div>
        </form>
    );
}

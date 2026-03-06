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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0a1f15]">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Send Notification
                </Button>
            </div>

            <Card className="liquid-glass-stat-dark border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Notification Details</CardTitle>
                    <CardDescription className="text-white/60">Configure who sees this notification and its importance.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-white/80">Title</Label>
                        <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-black/20 border-white/10 text-white placeholder:text-white/30" placeholder="System Update" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="body" className="text-white/80">Message Body</Label>
                        <Textarea id="body" required value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="bg-black/20 border-white/10 text-white placeholder:text-white/30 min-h-[100px]" placeholder="We will be undergoing maintenance..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type" className="text-white/80">Type</Label>
                            <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UPDATE">Update</SelectItem>
                                    <SelectItem value="OFFER">Offer</SelectItem>
                                    <SelectItem value="ALERT">Alert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="visibleTo" className="text-white/80">Target Audience</Label>
                            <Select value={formData.visibleTo} onValueChange={(val) => setFormData({ ...formData, visibleTo: val })}>
                                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                                    <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Users</SelectItem>
                                    <SelectItem value="CUSTOMERS">Customers Only</SelectItem>
                                    <SelectItem value="STAFF">Staff Only</SelectItem>
                                    <SelectItem value="VEHICLE_OWNERS">Vehicle Owners</SelectItem>
                                    <SelectItem value="HOTEL_OWNERS">Hotel Owners</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

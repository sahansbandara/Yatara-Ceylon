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
import { PartnerTypes, PartnerStatus } from '@/lib/constants';

interface PartnerFormProps {
    initialData?: any;
    isEdit?: boolean;
    redirectPath?: string;
    hideStatus?: boolean;
    fixedType?: string;
}

export default function PartnerForm({ initialData, isEdit = false, redirectPath = '/dashboard/partners', hideStatus = false, fixedType }: PartnerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: fixedType || initialData?.type || PartnerTypes.GUIDE,
        name: initialData?.name || '',
        contactPerson: initialData?.contactPerson || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        address: initialData?.address || '',
        status: initialData?.status || PartnerStatus.ACTIVE,
        notes: initialData?.notes || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/partners/${initialData._id}` : '/api/partners';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push(redirectPath);
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
                <h2 className="text-xl font-semibold text-white mb-2">Partner Information</h2>
                <p className="text-white/40 text-sm">Details about the partner (guide, hotel, driver, etc.).</p>
            </div>

            <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-5">
                    {!fixedType && (
                        <div className="grid gap-2">
                            <Label htmlFor="type" className="text-white/70">Partner Type</Label>
                            <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                    {Object.values(PartnerTypes).map((type) => (
                                        <SelectItem key={type} value={type} className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {!hideStatus && (
                        <div className="grid gap-2">
                            <Label htmlFor="status" className="text-white/70">Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                    {Object.values(PartnerStatus).map((status) => (
                                        <SelectItem key={status} value={status} className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name" className="text-white/70">Business / Partner Name</Label>
                    <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Kandy Heritage Hotel" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="contactPerson" className="text-white/70">Contact Person</Label>
                        <Input id="contactPerson" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} placeholder="e.g. John Doe" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-white/70">Phone</Label>
                        <Input id="phone" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+94 77 123 4567" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-white/70">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="partner@example.com" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="address" className="text-white/70">Address</Label>
                    <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123 Main St, Colombo" className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="notes" className="text-white/70">Notes</Label>
                    <Textarea id="notes" className="min-h-[100px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Any additional notes about this partner..." />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.06] mt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} className="border-antique-gold/40 text-antique-gold hover:bg-antique-gold/10 rounded-xl h-10 px-6 transition-all">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-antique-gold hover:bg-antique-gold/90 text-[#020b08] shadow-[0_0_20px_rgba(212,175,55,0.2)] rounded-xl h-10 px-6 font-semibold transition-all">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#020b08]/60" /> : null}
                    {isEdit ? 'Update Partner' : 'Add Partner'}
                </Button>
            </div>
        </form>
    );
}

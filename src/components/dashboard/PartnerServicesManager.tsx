'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Trash2, Edit2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface Service {
    _id: string;
    serviceName: string;
    rate: number;
    unit: string;
    description?: string;
    isActive: boolean;
}

interface PartnerServicesManagerProps {
    partnerId: string;
    initialServices: Service[];
}

export default function PartnerServicesManager({ partnerId, initialServices }: PartnerServicesManagerProps) {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>(initialServices);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        serviceName: '',
        rate: '',
        unit: 'PER_DAY',
        description: '',
        isActive: true,
    });

    const resetForm = () => {
        setFormData({
            serviceName: '',
            rate: '',
            unit: 'PER_DAY',
            description: '',
            isActive: true,
        });
        setEditingId(null);
    };

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
    };

    const handleEdit = (service: Service) => {
        setFormData({
            serviceName: service.serviceName,
            rate: service.rate.toString(),
            unit: service.unit,
            description: service.description || '',
            isActive: service.isActive ?? true,
        });
        setEditingId(service._id);
        setIsDialogOpen(true);
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const res = await fetch(`/api/partner-services/${serviceId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setServices(services.filter(s => s._id !== serviceId));
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || 'Failed to delete service'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete service');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingId 
                ? `/api/partner-services/${editingId}`
                : `/api/partners/${partnerId}`;
            
            const method = editingId ? 'PATCH' : 'POST';
            
            const payload = {
                ...formData,
                rate: Number(formData.rate),
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                if (editingId) {
                    setServices(services.map(s => s._id === editingId ? data.service : s));
                } else {
                    setServices([data.service, ...services]);
                }
                setIsDialogOpen(false);
                resetForm();
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl liquid-glass-stat-dark p-8 rounded-2xl border border-white/[0.08] shadow-2xl text-white mt-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Service Rate Cards</h2>
                    <p className="text-white/40 text-sm">Manage services and pricing for this partner.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button variant="glass" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#020b08] border-white/[0.08] text-white">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="serviceName">Service Name</Label>
                                <Input
                                    id="serviceName"
                                    required
                                    value={formData.serviceName}
                                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                                    className="bg-white/[0.04] border-white/[0.08]"
                                    placeholder="e.g. Standard Double Room"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="rate">Rate (LKR/USD)</Label>
                                    <Input
                                        id="rate"
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.rate}
                                        onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                        className="bg-white/[0.04] border-white/[0.08]"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Select value={formData.unit} onValueChange={(val) => setFormData({ ...formData, unit: val })}>
                                        <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                            <SelectItem value="PER_DAY">Per Day</SelectItem>
                                            <SelectItem value="PER_NIGHT">Per Night</SelectItem>
                                            <SelectItem value="PER_TRIP">Per Trip</SelectItem>
                                            <SelectItem value="PER_PERSON">Per Person</SelectItem>
                                            <SelectItem value="FLAT">Flat Rate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="isActive">Status</Label>
                                <Select value={formData.isActive ? 'true' : 'false'} onValueChange={(val) => setFormData({ ...formData, isActive: val === 'true' })}>
                                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                        <SelectItem value="true">Active</SelectItem>
                                        <SelectItem value="false">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Notes (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-white/[0.04] border-white/[0.08]"
                                    placeholder="Any specific terms or conditions..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} className="bg-antique-gold text-deep-emerald hover:bg-antique-gold/90">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingId ? 'Update' : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {services.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                    <p>No services defined for this partner yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {services.map((service) => (
                        <div key={service._id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-white">{service.serviceName}</h4>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${service.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {service.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-sm text-white/60">
                                    <span>Rate: {service.rate.toLocaleString()} / {service.unit.replace('_', ' ').toLowerCase()}</span>
                                </div>
                                {service.description && (
                                    <p className="mt-2 text-sm text-white/40">{service.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(service)} className="text-white/60 hover:text-white">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(service._id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

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
import { VehicleStatus, VehicleTypes } from '@/lib/constants';

interface VehicleFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function VehicleForm({ initialData, isEdit = false }: VehicleFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: initialData?.type || VehicleTypes.CAR,
        model: initialData?.model || '',
        plateNumber: initialData?.plateNumber || '',
        seats: initialData?.seats || 4,
        luggage: initialData?.luggage || 2,
        dailyRate: initialData?.dailyRate || 0,
        status: initialData?.status || VehicleStatus.AVAILABLE,
        images: initialData?.images || [],
        features: initialData?.features || [],
        transferTypes: initialData?.transferTypes || [],
    });

    const toggleTransferType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            transferTypes: prev.transferTypes.includes(type)
                ? prev.transferTypes.filter((t: string) => t !== type)
                : [...prev.transferTypes, type]
        }));
    };

    const [imagesText, setImagesText] = useState(initialData?.images?.join('\n') || '');
    const [featuresText, setFeaturesText] = useState(initialData?.features?.join('\n') || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            images: imagesText.split('\n').filter((s: string) => s.trim()),
            features: featuresText.split('\n').filter((s: string) => s.trim())
        };

        try {
            const url = isEdit ? `/api/vehicles/${initialData._id}` : '/api/vehicles';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/dashboard/vehicles');
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
                    {isEdit ? 'Update Vehicle' : 'Add Vehicle'}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Information</CardTitle>
                    <CardDescription>Details about the fleet vehicle.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Vehicle Type</Label>
                            <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(VehicleTypes).map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="model">Model Name</Label>
                            <Input id="model" required value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="e.g. Toyota Prius" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="seats">Seats</Label>
                            <Input id="seats" type="number" required min={1} value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="luggage">Luggage Capacity</Label>
                            <Input id="luggage" type="number" min={0} value={formData.luggage} onChange={(e) => setFormData({ ...formData, luggage: Number(e.target.value) })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dailyRate">Daily Rate (LKR)</Label>
                            <Input id="dailyRate" type="number" required min={0} value={formData.dailyRate} onChange={(e) => setFormData({ ...formData, dailyRate: Number(e.target.value) })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="plateNumber">Plate Number</Label>
                            <Input id="plateNumber" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} placeholder="e.g. WP CAA-1234" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(VehicleStatus).map((status) => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Transfer Types / Categories</Label>
                        <div className="flex gap-4 items-center mt-2">
                            {['AIRPORT_PICKUP', 'AIRPORT_DROP', 'CITY_TOUR'].map(type => (
                                <label key={type} className="flex items-center space-x-2 border p-3 rounded cursor-pointer hover:bg-slate-50">
                                    <input
                                        type="checkbox"
                                        checked={formData.transferTypes.includes(type)}
                                        onChange={() => toggleTransferType(type)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {type.replace('_', ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="features">Features (One per line)</Label>
                        <Textarea id="features" className="min-h-[100px]" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="AC&#10;Bluetooth&#10;Sunroof" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="images">Images (URLs, one per line)</Label>
                        <Textarea id="images" className="min-h-[100px]" value={imagesText} onChange={(e) => setImagesText(e.target.value)} placeholder="https://image1.jpg&#10;https://image2.jpg" />
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

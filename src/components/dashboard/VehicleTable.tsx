'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Car, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { VehicleStatus } from '@/lib/constants';

interface Vehicle {
    _id: string;
    type: string;
    model: string;
    plateNumber?: string;
    seats: number;
    luggage?: number;
    dailyRate: number;
    status: string;
    images: string[];
}

interface VehicleTableProps {
    initialVehicles: Vehicle[];
}

export default function VehicleTable({ initialVehicles }: VehicleTableProps) {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setVehicles(vehicles.filter(v => v._id !== id));
                router.refresh();
            } else {
                alert('Failed to delete vehicle');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting vehicle');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm('Approve this vehicle? It will become active immediately.')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/vehicles/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: VehicleStatus.AVAILABLE })
            });

            if (res.ok) {
                setVehicles(vehicles.map(v => v._id === id ? { ...v, status: VehicleStatus.AVAILABLE } : v));
                router.refresh();
            } else {
                alert('Failed to approve vehicle');
            }
        } catch (error) {
            console.error(error);
            alert('Error approving vehicle');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case VehicleStatus.AVAILABLE: return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
            case VehicleStatus.MAINTENANCE: return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
            case VehicleStatus.UNAVAILABLE: return 'bg-red-500/15 text-red-300 border-red-500/30';
            case VehicleStatus.PENDING_APPROVAL: return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
            case VehicleStatus.REJECTED: return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
            default: return 'bg-white/10 text-white/60';
        }
    };

    return (
        <div className="rounded-md border border-white/10 bg-transparent">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Plate No</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Rate per km</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <TableRow key={vehicle._id}>
                                <TableCell>
                                    <div className="relative h-10 w-16 rounded overflow-hidden bg-white/5 flex items-center justify-center text-white/30">
                                        {vehicle.images && vehicle.images[0] ? (
                                            <Image
                                                src={vehicle.images[0]}
                                                alt={vehicle.model}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <Car className="h-5 w-5" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-off-white">{vehicle.model}</TableCell>
                                <TableCell>{vehicle.type}</TableCell>
                                <TableCell>{vehicle.plateNumber || '-'}</TableCell>
                                <TableCell>
                                    <div className="text-xs text-white/50 space-y-1">
                                        <div>{vehicle.seats} Seats</div>
                                        {vehicle.luggage && <div>{vehicle.luggage} Lugg.</div>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-white/70">LKR {(vehicle.dailyRate ?? 0).toLocaleString()} per km</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                                        {vehicle.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {vehicle.status === 'PENDING_APPROVAL' && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                                                onClick={() => handleApprove(vehicle._id)}
                                                title="Approve Vehicle"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-white/10"
                                            onClick={() => router.push(`/dashboard/vehicles/${vehicle._id}`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-white/10"
                                            onClick={() => handleDelete(vehicle._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                No vehicles found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

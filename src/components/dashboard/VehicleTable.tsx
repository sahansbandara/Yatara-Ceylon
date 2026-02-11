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
import { Trash2, Edit, Car } from 'lucide-react';
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case VehicleStatus.AVAILABLE: return 'bg-green-100 text-green-800 border-green-200';
            case VehicleStatus.MAINTENANCE: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case VehicleStatus.UNAVAILABLE: return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Plate No</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Daily Rate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <TableRow key={vehicle._id}>
                                <TableCell>
                                    <div className="relative h-10 w-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400">
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
                                <TableCell className="font-medium">{vehicle.model}</TableCell>
                                <TableCell>{vehicle.type}</TableCell>
                                <TableCell>{vehicle.plateNumber || '-'}</TableCell>
                                <TableCell>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <div>{vehicle.seats} Seats</div>
                                        {vehicle.luggage && <div>{vehicle.luggage} Lugg.</div>}
                                    </div>
                                </TableCell>
                                <TableCell>${vehicle.dailyRate}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                                        {vehicle.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-blue-600"
                                            onClick={() => router.push(`/dashboard/vehicles/${vehicle._id}`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-600"
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

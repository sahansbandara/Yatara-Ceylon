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
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Destination {
    _id: string;
    title: string;
    slug: string;
    location?: string;
    images: string[];
    isPublished: boolean;
}

interface DestinationTableProps {
    initialDestinations: Destination[];
}

export default function DestinationTable({ initialDestinations }: DestinationTableProps) {
    const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this destination?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDestinations(destinations.filter(d => d._id !== id));
                router.refresh();
            } else {
                alert('Failed to delete destination');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting destination');
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (dest: Destination) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/destinations/${dest._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !dest.isPublished })
            });
            if (res.ok) {
                setDestinations(destinations.map(d => d._id === dest._id ? { ...d, isPublished: !d.isPublished } : d));
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {destinations.length > 0 ? (
                        destinations.map((dest) => (
                            <TableRow key={dest._id}>
                                <TableCell>
                                    <div className="relative h-10 w-16 rounded overflow-hidden bg-gray-100">
                                        {dest.images && dest.images[0] ? (
                                            <Image
                                                src={dest.images[0]}
                                                alt={dest.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{dest.title}</span>
                                        <span className="text-xs text-muted-foreground">/{dest.slug}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dest.location || '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={dest.isPublished ? 'default' : 'secondary'} className={dest.isPublished ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200' : ''}>
                                        {dest.isPublished ? 'Published' : 'Draft'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-gray-500"
                                            onClick={() => togglePublish(dest)}
                                            title={dest.isPublished ? "Unpublish" : "Publish"}
                                        >
                                            {dest.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-blue-600"
                                            onClick={() => router.push(`/dashboard/destinations/${dest._id}`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-600"
                                            onClick={() => handleDelete(dest._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No destinations found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

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
import { Trash2, Edit, Eye, EyeOff, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Package {
    _id: string;
    title: string;
    slug: string;
    price: number;
    duration: string;
    imageUrl?: string;
    isPublished: boolean;
    isFeatured?: boolean;
}

interface PackageTableProps {
    initialPackages: Package[];
}

export default function PackageTable({ initialPackages }: PackageTableProps) {
    const [packages, setPackages] = useState<Package[]>(initialPackages);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this package?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPackages(packages.filter(p => p._id !== id));
                router.refresh();
            } else {
                alert('Failed to delete package');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting package');
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (pkg: Package) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/packages/${pkg._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !pkg.isPublished })
            });
            if (res.ok) {
                setPackages(packages.map(p => p._id === pkg._id ? { ...p, isPublished: !p.isPublished } : p));
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
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {packages.length > 0 ? (
                        packages.map((pkg) => (
                            <TableRow key={pkg._id}>
                                <TableCell>
                                    <div className="relative h-10 w-16 rounded overflow-hidden bg-gray-100">
                                        {pkg.imageUrl ? (
                                            <Image
                                                src={pkg.imageUrl}
                                                alt={pkg.title}
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
                                        <span>{pkg.title}</span>
                                        <span className="text-xs text-muted-foreground">/{pkg.slug}</span>
                                    </div>
                                </TableCell>
                                <TableCell>${pkg.price.toLocaleString()}</TableCell>
                                <TableCell>{pkg.duration}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Badge variant={pkg.isPublished ? 'default' : 'secondary'} className={pkg.isPublished ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200' : ''}>
                                            {pkg.isPublished ? 'Published' : 'Draft'}
                                        </Badge>
                                        {pkg.isFeatured && (
                                            <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
                                                <Star className="h-3 w-3 mr-1 fill-yellow-500" /> Featured
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-gray-500"
                                            onClick={() => togglePublish(pkg)}
                                            title={pkg.isPublished ? "Unpublish" : "Publish"}
                                        >
                                            {pkg.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-blue-600"
                                            onClick={() => router.push(`/dashboard/packages/${pkg._id}`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-600"
                                            onClick={() => handleDelete(pkg._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No packages found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

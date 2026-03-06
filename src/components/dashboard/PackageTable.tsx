'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
        <div className="dashboard-table-glass overflow-hidden rounded-2xl w-full">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold w-[80px]">Image</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Title</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Price</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Duration</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Status</th>
                            <th className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.length > 0 ? (
                            packages.map((pkg) => (
                                <tr key={pkg._id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-antique-gold/[0.03] transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="relative h-10 w-14 rounded overflow-hidden bg-white/5 border border-white/10">
                                            {pkg.imageUrl ? (
                                                <Image
                                                    src={pkg.imageUrl}
                                                    alt={pkg.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[9px] uppercase tracking-wider text-white/20">No Img</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-white/85 text-xs">{pkg.title}</span>
                                            <span className="text-[10px] text-white/35 mt-0.5">/{pkg.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-xs font-bold text-white/85">LKR {(pkg.price ?? 0).toLocaleString()}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-white/60 text-xs">{pkg.duration}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-2 items-center">
                                            <span className={`status-pill ${pkg.isPublished ? 'status-pill-success' : 'status-pill-neutral'}`}>
                                                {pkg.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                            {pkg.isFeatured && (
                                                <span className="status-pill status-pill-gold flex items-center pr-2.5">
                                                    <Star className="h-2.5 w-2.5 mr-1 fill-antique-gold text-antique-gold" /> Featured
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                                onClick={() => togglePublish(pkg)}
                                                title={pkg.isPublished ? "Unpublish" : "Publish"}
                                            >
                                                {pkg.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-antique-gold hover:bg-white/10 transition-colors"
                                                onClick={() => router.push(`/dashboard/packages/${pkg._id}`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                onClick={() => handleDelete(pkg._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-white/40 text-sm">
                                    No packages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

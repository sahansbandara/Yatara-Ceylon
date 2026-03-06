'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
        <div className="dashboard-table-glass overflow-hidden rounded-2xl w-full">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold w-[80px]">Image</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Title</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Location</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Status</th>
                            <th className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {destinations.length > 0 ? (
                            destinations.map((dest) => (
                                <tr key={dest._id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-antique-gold/[0.03] transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="relative h-10 w-14 rounded overflow-hidden bg-white/5 border border-white/10">
                                            {dest.images && dest.images[0] ? (
                                                <Image
                                                    src={dest.images[0]}
                                                    alt={dest.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[9px] uppercase tracking-wider text-white/20">No Img</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white/85 text-xs">{dest.title}</span>
                                            <span className="text-[10px] text-white/35 mt-0.5">/{dest.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-white/60 text-xs">{dest.location || '—'}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`status-pill ${dest.isPublished ? 'status-pill-success' : 'status-pill-neutral'}`}>
                                            {dest.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                                onClick={() => togglePublish(dest)}
                                                title={dest.isPublished ? "Unpublish" : "Publish"}
                                            >
                                                {dest.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-antique-gold hover:bg-white/10 transition-colors"
                                                onClick={() => router.push(`/dashboard/destinations/${dest._id}`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                onClick={() => handleDelete(dest._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center text-white/40 text-sm">
                                    No destinations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

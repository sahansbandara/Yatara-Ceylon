'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArchiveRestore, Trash2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ArchivedItem {
    _id: string;
    collectionName: 'Users' | 'Packages' | 'Vehicles' | 'Bookings';
    deletedAt?: string;
    updatedAt: string;
    // Fields varying by collection
    name?: string;
    email?: string;
    title?: string;
    model?: string;
    plateNumber?: string;
    bookingNo?: string;
    customerName?: string;
}

export default function ArchiveCenterPage() {
    const router = useRouter();
    const [items, setItems] = useState<ArchivedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchArchive = async () => {
        try {
            const res = await fetch('/api/admin/archive');
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
            } else {
                alert('Failed to load archived items');
            }
        } catch (error) {
            alert('An error occurred while loading archive');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArchive();
    }, []);

    const handleAction = async (id: string, collectionName: string, action: 'restore' | 'delete') => {
        if (action === 'delete' && !confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) {
            return;
        }

        setProcessingId(id);
        try {
            const res = await fetch('/api/admin/archive/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, collectionName, action })
            });

            if (res.ok) {
                alert(`Item ${action === 'restore' ? 'restored' : 'permanently deleted'} successfully`);
                fetchArchive();
            } else {
                alert('Failed to process action');
            }
        } catch (error) {
            alert('An error occurred');
        } finally {
            setProcessingId(null);
        }
    };

    const getItemName = (item: ArchivedItem) => {
        switch (item.collectionName) {
            case 'Users': return item.name || item.email || 'Unknown User';
            case 'Packages': return item.title || 'Unknown Package';
            case 'Vehicles': return `${item.model} ${item.plateNumber ? `(${item.plateNumber})` : ''}`;
            case 'Bookings': return `${item.bookingNo} - ${item.customerName}`;
            default: return 'Unknown Item';
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-antique-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Database className="h-8 w-8 text-antique-gold" />
                    Archive Center
                </h1>
                <p className="text-white/60">
                    Manage and restore soft-deleted records across the system.
                </p>
            </div>

            <Card className="glass-panel border-white/10 bg-black/40">
                <CardHeader>
                    <CardTitle className="text-white">Archived Records ({items.length})</CardTitle>
                    <CardDescription className="text-white/60">
                        Items that have been marked as deleted but are still recoverable.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-white/50 border border-dashed border-white/10 rounded-lg bg-black/20">
                            <Database className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p>No archived items found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 gap-4 transition-colors hover:bg-white/10">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="mt-1">
                                            <Badge variant="outline" className="bg-white/5 text-white/80 border-white/20">
                                                {item.collectionName}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{getItemName(item)}</p>
                                            <p className="text-sm text-white/50">
                                                ID: {item._id}
                                            </p>
                                            <p className="text-xs text-white/40 mt-1">
                                                Deleted: {item.deletedAt ? format(new Date(item.deletedAt), 'MMM d, yyyy HH:mm') : format(new Date(item.updatedAt), 'MMM d, yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-antique-gold/30 text-antique-gold hover:bg-antique-gold/10 flex-1 sm:flex-none"
                                            onClick={() => handleAction(item._id, item.collectionName, 'restore')}
                                            disabled={processingId === item._id}
                                        >
                                            {processingId === item._id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <ArchiveRestore className="h-4 w-4 mr-2" />
                                            )}
                                            Restore
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 flex-1 sm:flex-none"
                                            onClick={() => handleAction(item._id, item.collectionName, 'delete')}
                                            disabled={processingId === item._id}
                                        >
                                            {processingId === item._id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4 mr-2" />
                                            )}
                                            Permanently Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

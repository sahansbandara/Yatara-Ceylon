'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { VehicleBlockReasons } from '@/lib/constants';

interface VehicleBlock {
    _id: string;
    from: string;
    to: string;
    reason: string;
}

export default function VehicleBlockManager({ vehicleId, initialBlocks }: { vehicleId: string, initialBlocks: VehicleBlock[] }) {
    const [blocks, setBlocks] = useState<VehicleBlock[]>(initialBlocks);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [reason, setReason] = useState<string>('MAINTENANCE');

    const handleAddBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/vehicles/${vehicleId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from, to, reason }),
            });

            if (res.ok) {
                const data = await res.json();
                setBlocks([...blocks, data.block]);
                setFrom('');
                setTo('');
                setReason('MAINTENANCE');
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || 'Failed to add block'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Error adding block');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlock = async (blockId: string) => {
        if (!confirm('Are you sure you want to remove this block?')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/blocks/${blockId}`, { method: 'DELETE' });
            if (res.ok) {
                setBlocks(blocks.filter(b => b._id !== blockId));
                router.refresh();
            } else {
                alert('Failed to delete block');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting block');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Availability Blocks</CardTitle>
                <CardDescription>Block this vehicle from being booked for maintenance or other reasons.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAddBlock} className="flex gap-4 items-end mb-6">
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="from">From Date</Label>
                        <Input id="from" type="date" required value={from} onChange={e => setFrom(e.target.value)} />
                    </div>
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="to">To Date</Label>
                        <Input id="to" type="date" required value={to} onChange={e => setTo(e.target.value)} />
                    </div>
                    <div className="grid gap-2 flex-1">
                        <Label htmlFor="reason">Reason</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(VehicleBlockReasons).map(r => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" disabled={loading} className="w-[120px]">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Block
                    </Button>
                </form>

                <div className="space-y-4">
                    {blocks.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No active blocks.</p>
                    ) : (
                        blocks.map((block) => (
                            <div key={block._id} className="flex items-center justify-between border p-3 rounded-md">
                                <div className="flex gap-6 items-center">
                                    <div className="text-sm">
                                        <span className="font-semibold">{format(new Date(block.from), 'MMM d, yyyy')}</span>
                                        <span className="mx-2">to</span>
                                        <span className="font-semibold">{format(new Date(block.to), 'MMM d, yyyy')}</span>
                                    </div>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{block.reason}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 h-8 w-8 p-0"
                                    onClick={() => handleDeleteBlock(block._id)}
                                    disabled={loading}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

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

export default function VehicleBlockManager({ vehicleId, initialBlocks, hideTitle = false }: { vehicleId: string, initialBlocks: VehicleBlock[], hideTitle?: boolean }) {
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
        <div className={hideTitle ? "mt-2" : "liquid-glass-stat-dark rounded-2xl p-8 border border-white/[0.08] shadow-2xl mt-6 text-white max-w-3xl"}>
            {!hideTitle && (
                <>
                    <h2 className="text-xl font-semibold mb-2">Availability Blocks</h2>
                    <p className="text-white/40 text-sm mb-6">Block this vehicle from being booked for maintenance or other reasons.</p>
                </>
            )}

            <form onSubmit={handleAddBlock} className="flex flex-col md:flex-row gap-4 items-end mb-4 bg-white/[0.02] p-5 rounded-xl border border-white/[0.06]">
                <div className="grid gap-2 flex-1 w-full">
                    <Label htmlFor="from" className="text-white/70">From Date</Label>
                    <Input id="from" type="date" required value={from} onChange={e => setFrom(e.target.value)} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 [color-scheme:dark] rounded-xl h-11" />
                </div>
                <div className="grid gap-2 flex-1 w-full">
                    <Label htmlFor="to" className="text-white/70">To Date</Label>
                    <Input id="to" type="date" required value={to} onChange={e => setTo(e.target.value)} className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 [color-scheme:dark] rounded-xl h-11" />
                </div>
                <div className="grid gap-2 flex-1 w-full">
                    <Label htmlFor="reason" className="text-white/70">Reason</Label>
                    <Select value={reason} onValueChange={setReason}>
                        <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 h-11 rounded-xl">
                            <SelectValue placeholder="Reason" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                            {Object.values(VehicleBlockReasons).map(r => (
                                <SelectItem key={r} value={r} className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" disabled={loading} className="w-full md:w-[120px] h-11 rounded-xl bg-antique-gold hover:bg-antique-gold/90 text-[#020b08] shadow-[0_0_15px_rgba(212,175,55,0.15)] font-medium">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#020b08]/60" />}
                    Add Block
                </Button>
            </form>

            <div className="space-y-3">
                {blocks.length === 0 ? (
                    <p className="text-sm text-white/30 italic text-center py-6">No active availability blocks.</p>
                ) : (
                    blocks.map((block) => (
                        <div key={block._id} className="flex items-center justify-between border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl transition-all">
                            <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center">
                                <div className="text-sm text-off-white font-medium flex items-center gap-2">
                                    <span className="bg-white/5 py-1 px-2.5 rounded-lg border border-white/10">{format(new Date(block.from), 'MMM d, yyyy')}</span>
                                    <span className="text-white/30 text-xs">to</span>
                                    <span className="bg-white/5 py-1 px-2.5 rounded-lg border border-white/10">{format(new Date(block.to), 'MMM d, yyyy')}</span>
                                </div>
                                <span className={`text-[10px] tracking-wider uppercase px-2.5 py-1 rounded border font-semibold ${block.reason === 'OFF_SEASON' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : block.reason === 'UNAVAILABLE' ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {block.reason.replace('_', ' ')}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8 rounded-lg"
                                onClick={() => handleDeleteBlock(block._id)}
                                disabled={loading}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

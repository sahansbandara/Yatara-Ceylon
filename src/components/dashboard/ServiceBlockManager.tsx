'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ServiceBlockReasons } from '@/lib/constants';

interface PartnerServiceBlock {
    _id: string;
    from: string;
    to: string;
    reason: string;
}

export default function ServiceBlockManager({ serviceId, initialBlocks, hideTitle = false }: { serviceId: string, initialBlocks: PartnerServiceBlock[], hideTitle?: boolean }) {
    const [blocks, setBlocks] = useState<PartnerServiceBlock[]>(initialBlocks || []);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [reason, setReason] = useState<string>('RENOVATION');

    const handleAddBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/partner-service-blocks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceId, from, to, reason }),
            });

            if (res.ok) {
                const data = await res.json();
                setBlocks([...blocks, data.block]);
                setFrom('');
                setTo('');
                setReason('RENOVATION');
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
            const res = await fetch(`/api/partner-service-blocks/${blockId}`, { method: 'DELETE' });
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
        <div className={hideTitle ? "mt-4" : "mt-4"}>
            {!hideTitle && (
                <>
                    <h2 className="text-lg font-semibold mb-2 text-white">Service Availability Blocks</h2>
                    <p className="text-white/40 text-xs mb-4">Temporarily remove this service from bookings without deleting it.</p>
                </>
            )}

            <div className="mb-4">
                <p className="text-[11px] font-medium text-white/50 mb-2 uppercase tracking-wide">Blocking</p>
                <form onSubmit={handleAddBlock} className="flex flex-col gap-3">
                    {/* Date Row */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                           <Input 
                             id="from" 
                             type="date" 
                             required 
                             value={from} 
                             onChange={e => setFrom(e.target.value)} 
                             className="w-full bg-transparent border border-white/10 text-white/80 focus-visible:ring-1 focus-visible:ring-antique-gold/50 rounded-lg h-10 text-[13px] [color-scheme:dark] pl-9" 
                           />
                           <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                           </div>
                        </div>
                        <span className="text-white/20">-</span>
                        <div className="flex-1 relative">
                           <Input 
                             id="to" 
                             type="date" 
                             required 
                             value={to} 
                             onChange={e => setTo(e.target.value)} 
                             className="w-full bg-transparent border border-white/10 text-white/80 focus-visible:ring-1 focus-visible:ring-antique-gold/50 rounded-lg h-10 text-[13px] [color-scheme:dark] pl-9" 
                           />
                           <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                           </div>
                        </div>
                    </div>

                    {/* Reason Row */}
                    <Select value={reason} onValueChange={setReason}>
                        <SelectTrigger className="w-full bg-transparent border border-white/10 text-white/80 hover:bg-white/[0.02] focus-visible:ring-1 focus-visible:ring-antique-gold/50 h-10 rounded-lg text-[13px] transition-all">
                            <SelectValue placeholder="Select your reason" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1f2226] border-white/[0.08] text-white">
                            {Object.values(ServiceBlockReasons).map(r => (
                                <SelectItem key={r} value={r} className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer text-[13px]">{r.replace('_', ' ')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Submit Button */}
                    <Button type="submit" disabled={loading} className="w-full h-10 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:brightness-110 text-[#08110d] shadow-[0_4px_15px_rgba(212,175,55,0.15)] font-semibold text-[13px] tracking-wide mt-1 transition-all">
                        {loading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-[#08110d]/60" />}
                        Apply Block
                    </Button>
                </form>
            </div>

            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                {blocks.length === 0 ? (
                    null // No active blocks message removed to clean up UI as per image 
                ) : (
                    blocks.map((block) => (
                        <div key={block._id} className="flex flex-col gap-2 border border-white/5 bg-white/[0.01] p-3 rounded-lg transition-all relative group">
                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] tracking-wider uppercase font-semibold ${block.reason === 'BOOKING' ? 'text-blue-400' : block.reason === 'PERSONAL' ? 'text-neutral-400' : 'text-red-400'}`}>
                                    {block.reason.replace('_', ' ')}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white/20 hover:text-red-400 hover:bg-transparent h-6 w-6 rounded-md p-0 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteBlock(block._id)}
                                    disabled={loading}
                                    title="Remove block"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-white/60">
                                <span>{format(new Date(block.from), 'MMM d, yyyy')}</span>
                                <span className="text-white/20">-</span>
                                <span>{format(new Date(block.to), 'MMM d, yyyy')}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

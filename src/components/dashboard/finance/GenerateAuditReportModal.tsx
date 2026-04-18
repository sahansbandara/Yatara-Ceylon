'use client';

import { useState } from 'react';
import { Download, Loader2, FileSpreadsheet, CalendarDays } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export default function GenerateAuditReportModal() {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [format, setFormat] = useState<'csv' | 'json'>('csv');
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    // Quick presets
    const setPreset = (preset: string) => {
        const today = new Date();
        const yyyy = (d: Date) => d.toISOString().split('T')[0];

        if (preset === 'this-month') {
            setStartDate(yyyy(new Date(today.getFullYear(), today.getMonth(), 1)));
            setEndDate(yyyy(today));
        } else if (preset === 'last-month') {
            const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            setStartDate(yyyy(firstDayLastMonth));
            setEndDate(yyyy(lastDayLastMonth));
        } else if (preset === 'this-quarter') {
            const quarter = Math.floor(today.getMonth() / 3);
            const qStart = new Date(today.getFullYear(), quarter * 3, 1);
            setStartDate(yyyy(qStart));
            setEndDate(yyyy(today));
        } else if (preset === 'this-year') {
            setStartDate(`${today.getFullYear()}-01-01`);
            setEndDate(yyyy(today));
        } else if (preset === 'last-30') {
            const d30 = new Date(today);
            d30.setDate(d30.getDate() - 30);
            setStartDate(yyyy(d30));
            setEndDate(yyyy(today));
        }
    };

    const handleGenerate = async () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date must be before end date.');
            return;
        }

        setGenerating(true);
        setError('');

        try {
            const url = `/api/finance/audit?startDate=${startDate}&endDate=${endDate}&format=${format}`;
            const res = await fetch(url);

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to generate report');
            }

            if (format === 'csv') {
                const blob = await res.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `yatara-audit-${startDate}-to-${endDate}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(blobUrl);
            } else {
                const data = await res.json();
                const jsonStr = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `yatara-audit-${startDate}-to-${endDate}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(blobUrl);
            }

            setOpen(false);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-deep-emerald bg-antique-gold hover:bg-antique-gold/90 transition-all shadow-[0_0_16px_rgba(212,175,55,0.2)] uppercase tracking-wider">
                    <FileSpreadsheet className="h-4 w-4" /> Generate Audit Report
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <Dialog.Content className="pointer-events-auto relative w-full max-w-[520px] rounded-[2rem] bg-gradient-to-br from-[#111A16] to-[#0A100D] border border-white/[0.05] shadow-2xl p-8 outline-none text-off-white">
                    <Dialog.Title className="text-xl font-display font-semibold text-antique-gold mb-1 tracking-wide">
                        Finance Audit Report
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-white/40 mb-6 font-light">
                        Select a date range to generate a comprehensive financial report with payments, invoices, and outstanding balances.
                    </Dialog.Description>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Quick Presets */}
                    <div className="mb-6">
                        <p className="text-[11px] font-medium text-white/50 tracking-wide uppercase mb-2">Quick Presets</p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: 'Last 30 Days', val: 'last-30' },
                                { label: 'This Month', val: 'this-month' },
                                { label: 'Last Month', val: 'last-month' },
                                { label: 'This Quarter', val: 'this-quarter' },
                                { label: 'This Year', val: 'this-year' },
                            ].map(preset => (
                                <button
                                    key={preset.val}
                                    type="button"
                                    onClick={() => setPreset(preset.val)}
                                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-white/10 text-white/60 hover:text-antique-gold hover:border-antique-gold/30 hover:bg-antique-gold/5 transition-all"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Inputs */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-medium text-white/50 tracking-wide uppercase flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" /> From
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl text-sm bg-black/30 border border-white/10 text-white focus:border-antique-gold/50 focus:outline-none transition-colors [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-medium text-white/50 tracking-wide uppercase flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" /> To
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl text-sm bg-black/30 border border-white/10 text-white focus:border-antique-gold/50 focus:outline-none transition-colors [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Format Selection */}
                    <div className="mb-8">
                        <p className="text-[11px] font-medium text-white/50 tracking-wide uppercase mb-2">Export Format</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setFormat('csv')}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${format === 'csv' ? 'bg-antique-gold/10 border-antique-gold/40 text-antique-gold' : 'bg-black/20 border-white/10 text-white/40 hover:text-white/60'}`}
                            >
                                📄 CSV (Excel)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormat('json')}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${format === 'json' ? 'bg-antique-gold/10 border-antique-gold/40 text-antique-gold' : 'bg-black/20 border-white/10 text-white/40 hover:text-white/60'}`}
                            >
                                {'{ }'} JSON (API)
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={generating}
                            className="rounded-xl px-6 py-2.5 text-sm font-medium bg-transparent border border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={generating}
                            className="px-8 py-2.5 rounded-xl text-sm font-semibold bg-antique-gold hover:bg-antique-gold/90 text-deep-emerald transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 flex items-center gap-2"
                        >
                            {generating ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                            ) : (
                                <><Download className="h-4 w-4" /> Download Report</>
                            )}
                        </button>
                    </div>
                </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

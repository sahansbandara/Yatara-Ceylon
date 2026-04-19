import { useState, useEffect, useMemo } from 'react';
import { X, CheckCircle, Car, Hotel, Calendar, Users, AlertCircle } from 'lucide-react';

interface RequestProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    estimatedPrice: number; // This is the per-person base price from the map
    defaultDates?: { from?: string; to?: string };
    defaultContact?: { name?: string; email?: string; phone?: string };
    isSaving?: boolean;
}

/** Returns YYYY-MM-DD string for a date offset by `days` from today */
function getDateString(daysFromNow: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
}

/** Add N days to a YYYY-MM-DD string and return YYYY-MM-DD */
function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
}

function formatLKR(amount: number): string {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(amount);
}

const MIN_LEAD_DAYS = 5;
const MIN_TRIP_DAYS = 2; // Minimum 2-day trip

export default function RequestProposalModal({ isOpen, onClose, onSubmit, estimatedPrice, defaultDates, defaultContact, isSaving }: RequestProposalModalProps) {
    const minStartDate = useMemo(() => getDateString(MIN_LEAD_DAYS), []);

    const [formData, setFormData] = useState({
        name: defaultContact?.name || '',
        email: defaultContact?.email || '',
        phone: defaultContact?.phone || '',
        dateFrom: defaultDates?.from || '',
        dateTo: defaultDates?.to || '',
        pax: 2,
        hotelPreference: '4-Star',
        transferPreference: 'Car',
        notes: '',
    });

    const [dateError, setDateError] = useState('');

    // Price calculations — estimatedPrice is per person
    const perPersonPrice = estimatedPrice;
    const totalPrice = perPersonPrice * (formData.pax || 1);

    // Update form when defaultContact changes
    useEffect(() => {
        if (defaultContact) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || defaultContact.name || '',
                email: prev.email || defaultContact.email || '',
                phone: prev.phone || defaultContact.phone || '',
            }));
        }
    }, [defaultContact]);

    // Compute the minimum end date (start + MIN_TRIP_DAYS)
    const minEndDate = useMemo(() => {
        if (formData.dateFrom) {
            return addDays(formData.dateFrom, MIN_TRIP_DAYS);
        }
        return addDays(minStartDate, MIN_TRIP_DAYS);
    }, [formData.dateFrom, minStartDate]);

    // Validate dates whenever they change
    useEffect(() => {
        if (formData.dateFrom && formData.dateFrom < minStartDate) {
            setDateError(`Start date must be at least ${MIN_LEAD_DAYS} days from today (${minStartDate} or later)`);
        } else if (formData.dateFrom && formData.dateTo) {
            const from = new Date(formData.dateFrom + 'T00:00:00');
            const to = new Date(formData.dateTo + 'T00:00:00');
            const diffDays = Math.round((to.getTime() - from.getTime()) / 86400000);
            if (diffDays < MIN_TRIP_DAYS) {
                setDateError(`Trip must be at least ${MIN_TRIP_DAYS} days. End date must be ${minEndDate} or later.`);
            } else {
                setDateError('');
            }
        } else {
            setDateError('');
        }
    }, [formData.dateFrom, formData.dateTo, minStartDate, minEndDate]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (dateError) return;
        await onSubmit({ ...formData, estimatedCost: totalPrice });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            {/* Modal */}
            <div className="relative w-full max-w-lg bg-[#f4f1eb] rounded-3xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 bg-white/50">
                    <div>
                        <h2 className="font-serif text-2xl text-deep-emerald capitalize">Request Proposal</h2>
                        <p className="text-xs text-deep-emerald/60 mt-1">Get a finalized quote for this exact itinerary</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-deep-emerald/50 hover:text-deep-emerald">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar space-y-5">
                    
                    {/* Price Estimate Banner — shows per-person and total */}
                    <div className="bg-antique-gold/10 border border-antique-gold/20 p-4 rounded-xl space-y-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-antique-gold/80 mb-1">Per Person</p>
                                <p className="text-sm text-deep-emerald/60 leading-snug">Base price per traveler</p>
                            </div>
                            <span className="text-lg font-bold font-serif text-deep-emerald/70 shrink-0 ml-4">
                                {formatLKR(perPersonPrice)}
                            </span>
                        </div>
                        <div className="border-t border-antique-gold/15 pt-3 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-antique-gold/80 mb-1">
                                    Total for {formData.pax || 1} {(formData.pax || 1) === 1 ? 'Traveler' : 'Travelers'}
                                </p>
                                <p className="text-xs text-deep-emerald/50 leading-snug">Final price may vary with hotel &amp; vehicle</p>
                            </div>
                            <span className="text-2xl font-bold font-serif text-deep-emerald shrink-0 ml-4">
                                {formatLKR(totalPrice)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-deep-emerald/70 uppercase tracking-wider">Your Name *</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-deep-emerald/20 transition-all text-sm" placeholder="John Doe" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-deep-emerald/70 uppercase tracking-wider">Email *</label>
                            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-deep-emerald/20 transition-all text-sm" placeholder="john@example.com" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-deep-emerald/70 uppercase tracking-wider">Phone / WhatsApp *</label>
                            <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-deep-emerald/20 transition-all text-sm" placeholder="+1 234 567 8900" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-deep-emerald/70 uppercase tracking-wider flex items-center gap-1"><Users className="w-3 h-3"/> Travelers *</label>
                            <input
                                required
                                type="number"
                                min="1"
                                max="50"
                                value={formData.pax}
                                onChange={e => {
                                    const val = parseInt(e.target.value) || 1;
                                    setFormData({...formData, pax: Math.max(1, val)});
                                }}
                                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-deep-emerald/20 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-deep-emerald/70 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3"/> Start Date *</label>
                            <input
                                required
                                type="date"
                                min={minStartDate}
                                value={formData.dateFrom}
                                onChange={e => {
                                    const newFrom = e.target.value;
                                    const newMinEnd = addDays(newFrom, MIN_TRIP_DAYS);
                                    setFormData(prev => ({
                                        ...prev,
                                        dateFrom: newFrom,
                                        // Auto-clear end date if it doesn't meet the minimum trip length
                                        dateTo: prev.dateTo && prev.dateTo < newMinEnd ? '' : prev.dateTo,
                                    }));
                                }}
                                className={`w-full px-4 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                                    dateError && formData.dateFrom && formData.dateFrom < minStartDate
                                        ? 'border-red-400 focus:ring-red-200'
                                        : 'border-black/10 focus:ring-deep-emerald/20'
                                }`}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-deep-emerald/70 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3"/> End Date *</label>
                            <input
                                required
                                type="date"
                                min={minEndDate}
                                value={formData.dateTo}
                                onChange={e => setFormData({...formData, dateTo: e.target.value})}
                                className={`w-full px-4 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                                    dateError && formData.dateTo
                                        ? 'border-red-400 focus:ring-red-200'
                                        : 'border-black/10 focus:ring-deep-emerald/20'
                                }`}
                            />
                            {formData.dateFrom && (
                                <p className="text-[10px] text-deep-emerald/40">Min {MIN_TRIP_DAYS}-day trip ({minEndDate} or later)</p>
                            )}
                        </div>
                    </div>

                    {/* Date validation error */}
                    {dateError && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{dateError}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-deep-emerald/70 uppercase tracking-wider flex items-center gap-1"><Hotel className="w-3 h-3"/> Hotel Level</label>
                            <select value={formData.hotelPreference} onChange={e => setFormData({...formData, hotelPreference: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-deep-emerald/20 transition-all text-sm">
                                <option value="Budget">Budget</option>
                                <option value="3-Star">3-Star / Standard</option>
                                <option value="4-Star">4-Star / Premium</option>
                                <option value="5-Star">5-Star / Luxury</option>
                                <option value="Boutique">Boutique Villas</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-deep-emerald/70 uppercase tracking-wider flex items-center gap-1"><Car className="w-3 h-3"/> Transfer Type</label>
                            <select value={formData.transferPreference} onChange={e => setFormData({...formData, transferPreference: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-deep-emerald/20 transition-all text-sm">
                                <option value="Car">Sedan Car (1-3 pax)</option>
                                <option value="Van">Minivan (4-8 pax)</option>
                                <option value="SUV">Luxury SUV</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-deep-emerald/70 uppercase tracking-wider">Special Requests</label>
                        <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-deep-emerald/20 transition-all text-sm resize-none" placeholder="Any specific requirements...?" />
                    </div>

                    <div className="pt-2">
                        <button disabled={isSaving || !!dateError} type="submit" className="w-full py-3.5 rounded-xl bg-deep-emerald text-white shadow-[0_8px_20px_rgba(4,57,39,0.15)] hover:-translate-y-0.5 transition-all text-sm font-bold tracking-widest uppercase flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                            {isSaving ? "Submitting..." : (
                                <>
                                    Submit Request <CheckCircle className="w-4 h-4"/>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

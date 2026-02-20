'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, MapPin, CheckCircle2, BookmarkIcon } from 'lucide-react';
import MapWrapper from './MapWrapper';
import { useRouter } from 'next/navigation';

interface TourBuilderProps {
    districts: any[];
    places: any[];
}

export default function TourBuilder({ districts, places }: TourBuilderProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        arrivalDate: undefined as Date | undefined,
        duration: '',
        adults: '2',
        children: '0',
        budget: '',
        message: '',
        selectedDistricts: [] as string[],
        selectedPlaces: [] as string[],
        interests: [] as string[]
    });

    const categories = ['Beach', 'Wildlife', 'Culture', 'Adventure', 'Relaxation'];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const toggleDistrict = (idOrName: string) => {
        // Handle GeoJSON name or direct ID
        const distMatched = districts.find(d => d.name.toLowerCase() === idOrName.toLowerCase());
        const targetId = distMatched ? distMatched._id : idOrName;

        setFormData(prev => ({
            ...prev,
            selectedDistricts: prev.selectedDistricts.includes(targetId)
                ? prev.selectedDistricts.filter(d => d !== targetId)
                : [...prev.selectedDistricts, targetId]
        }));
    };

    const togglePlace = (id: string) => {
        setFormData(prev => ({
            ...prev,
            selectedPlaces: prev.selectedPlaces.includes(id)
                ? prev.selectedPlaces.filter(p => p !== id)
                : [...prev.selectedPlaces, id]
        }));
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const buildPayload = (isDraft: boolean) => {
        return {
            customerName: formData.name || 'Draft Itinerary',
            email: formData.email || 'draft@yataraceylon.com',
            phone: formData.phone || '',
            type: isDraft ? 'DRAFT' : 'CUSTOM',
            message: `
                ${isDraft ? '[DRAFT]' : ''} Bespoke Tour Request
                Duration: ${formData.duration} days
                Adults: ${formData.adults}, Children: ${formData.children}
                Arrival: ${formData.arrivalDate ? format(formData.arrivalDate, 'yyyy-MM-dd') : 'Not set'}
                Investment Scale: ${formData.budget}
                Interests: ${formData.interests.join(', ')}
                Selected Places: ${formData.selectedPlaces.map(pid => places.find(p => p._id === pid)?.name).join(', ')}
                Notes: ${formData.message}
            `
        };
    };

    const handleSaveDraft = async () => {
        setDraftLoading(true);
        try {
            const res = await fetch('/api/public/booking-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildPayload(true))
            });

            if (res.ok) {
                alert("Itinerary saved to drafts! You can resume planning later.");
            } else {
                alert("Something went wrong saving the draft.");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving draft.");
        } finally {
            setDraftLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/public/booking-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildPayload(false))
            });

            if (res.ok) {
                alert("Tour request submitted successfully! A concierge will contact you shortly.");
                router.push('/');
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-none shadow-2xl overflow-hidden border border-antique-gold/20 min-h-[600px] flex flex-col md:flex-row">
            {/* Sidebar Steps */}
            <div className="bg-deep-emerald text-off-white p-8 md:w-1/4 flex flex-col justify-between">
                <div>
                    <h2 className="text-3xl font-serif text-antique-gold mb-8">Bespoke Planning</h2>
                    <div className="space-y-6">
                        {[
                            { step: 1, label: 'Trip Details', icon: CalendarIcon },
                            { step: 2, label: 'Destinations', icon: MapPin },
                            { step: 3, label: 'Review & Submit', icon: CheckCircle2 }
                        ].map((s) => (
                            <div key={s.step} className={cn("flex items-center gap-4 transition-all duration-300", step === s.step ? "text-off-white translate-x-1" : "text-off-white/50")}>
                                <div className={cn("h-8 w-8 rounded-none flex items-center justify-center border font-serif", step === s.step ? "bg-antique-gold text-deep-emerald border-antique-gold font-bold" : "border-off-white/30")}>
                                    {s.step}
                                </div>
                                <span className={cn("font-light tracking-wide", step === s.step ? "font-medium" : "")}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-antique-gold/70 font-serif text-sm mt-8 uppercase tracking-widest">
                    Step {step} of 3
                </div>
            </div>

            {/* Form Content */}
            <div className="p-8 md:w-3/4 bg-off-white/30 overflow-y-auto max-h-[800px]">
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                        <h3 className="text-2xl font-serif text-deep-emerald">Tell us about your trip</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald/70">Arrival Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("w-full justify-start text-left font-light rounded-none h-12 border-deep-emerald/20 hover:border-antique-gold transition-colors", !formData.arrivalDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.arrivalDate ? format(formData.arrivalDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={formData.arrivalDate} onSelect={(date) => setFormData({ ...formData, arrivalDate: date })} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald/70">Duration (Days)</label>
                                <Input type="number" min="1" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 7" className="rounded-none h-12 border-deep-emerald/20 focus-visible:ring-antique-gold" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald/70">Adults</label>
                                <Select value={formData.adults} onValueChange={(val) => setFormData({ ...formData, adults: val })}>
                                    <SelectTrigger className="rounded-none h-12 border-deep-emerald/20 focus:ring-antique-gold"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald/70">Children</label>
                                <Select value={formData.children} onValueChange={(val) => setFormData({ ...formData, children: val })}>
                                    <SelectTrigger className="rounded-none h-12 border-deep-emerald/20 focus:ring-antique-gold"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[0, 1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald/70">Interests (Select all that apply)</label>
                            <div className="flex flex-wrap gap-3">
                                {categories.map(cat => (
                                    <div
                                        key={cat}
                                        onClick={() => toggleInterest(cat)}
                                        className={cn("px-6 py-3 rounded-none border cursor-pointer transition-all duration-300 text-sm font-light tracking-wide",
                                            formData.interests.includes(cat) ? "bg-antique-gold/10 border-antique-gold text-deep-emerald font-medium" : "bg-white border-deep-emerald/10 text-deep-emerald/70 hover:border-antique-gold/50"
                                        )}
                                    >
                                        {cat}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-serif text-deep-emerald">Select Your Sovereign Gems</h3>
                            <span className="text-sm tracking-wider font-light text-deep-emerald/60">{formData.selectedPlaces.length} places selected</span>
                        </div>

                        <p className="text-sm font-light text-deep-emerald/80 mb-6">
                            Click directly on the map to select a district and reveal its Sovereign Gems.
                        </p>

                        {/* Interactive Map */}
                        <MapWrapper
                            places={places}
                            selectedPlaces={formData.selectedPlaces}
                            onSelectPlace={togglePlace}
                            selectedDistricts={formData.selectedDistricts}
                            onSelectDistrict={toggleDistrict}
                        />

                        <div className="space-y-4 mt-8">
                            {/* Places List for Selected Districts */}
                            {formData.selectedDistricts.length > 0 ? (
                                <div className="space-y-4">
                                    <h4 className="font-serif tracking-widest uppercase text-sm text-antique-gold">Sovereign Gems in selected regions</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {places
                                            .filter(p => formData.selectedDistricts.includes(p.districtId || p.district))
                                            .map(place => (
                                                <div
                                                    key={place._id}
                                                    onClick={() => togglePlace(place._id)}
                                                    className={cn("p-4 rounded-none border cursor-pointer flex items-center justify-between transition-all duration-300",
                                                        formData.selectedPlaces.includes(place._id) ? "border-antique-gold bg-antique-gold/5" : "border-deep-emerald/10 bg-white hover:border-antique-gold/40"
                                                    )}
                                                >
                                                    <div className="text-sm font-light tracking-wide text-deep-emerald">{place.name}</div>
                                                    {formData.selectedPlaces.includes(place._id) && <CheckCircle2 className="h-5 w-5 text-antique-gold" />}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-deep-emerald/50 font-light italic">
                                    Please select a region on the map to view available Sovereign Gems.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                        <h3 className="text-2xl font-serif text-deep-emerald">Final Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald/70">Your Name</label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="rounded-none h-12 border-deep-emerald/20 focus-visible:ring-antique-gold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald/70">Email Address</label>
                                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="rounded-none h-12 border-deep-emerald/20 focus-visible:ring-antique-gold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald/70">WhatsApp / Phone</label>
                                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 890" className="rounded-none h-12 border-deep-emerald/20 focus-visible:ring-antique-gold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald/70">Investment Scale (Per Person)</label>
                                <Select value={formData.budget} onValueChange={(val) => setFormData({ ...formData, budget: val })}>
                                    <SelectTrigger className="rounded-none h-12 border-deep-emerald/20 focus:ring-antique-gold"><SelectValue placeholder="Select scale" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="250-500">Standard Luxury (USD 250 - 500/day)</SelectItem>
                                        <SelectItem value="500-1000">Premium Bespoke (USD 500 - 1000/day)</SelectItem>
                                        <SelectItem value="1000+">Sovereign Access (USD 1000+/day)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald/70">Additional Notes / Special Requests</label>
                            <Textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Any specific requirements? Dietary restrictions? Accessibility needs?"
                                className="min-h-[120px] rounded-none border-deep-emerald/20 focus-visible:ring-antique-gold font-light"
                            />
                        </div>

                        <div className="bg-deep-emerald p-6 rounded-none border border-antique-gold/30">
                            <h4 className="font-serif text-lg text-antique-gold mb-3">Itinerary Summary</h4>
                            <p className="text-sm font-light text-off-white/90 leading-relaxed tracking-wide">
                                {formData.duration || '-'} days planned • {formData.adults} Adults, {formData.children} Children • {formData.selectedPlaces.length} Destinations curated
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="mt-12 pt-8 border-t border-deep-emerald/10 flex justify-between items-center">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handleBack} className="rounded-none border-deep-emerald/20 text-deep-emerald hover:bg-deep-emerald/5 hover:text-deep-emerald font-light tracking-wider px-8 h-12">
                            Back
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    <div className="flex gap-4">
                        {step === 3 && (
                            <Button onClick={handleSaveDraft} disabled={draftLoading} variant="outline" className="rounded-none border-antique-gold text-antique-gold hover:bg-antique-gold hover:text-deep-emerald font-medium tracking-wider px-6 h-12 transition-all duration-300">
                                {draftLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BookmarkIcon className="h-4 w-4 mr-2" />}
                                Save as Draft
                            </Button>
                        )}

                        {step < 3 ? (
                            <Button onClick={handleNext} className="rounded-none bg-deep-emerald hover:bg-deep-emerald/90 text-off-white font-medium tracking-wider px-8 h-12 shadow-lg">
                                Next Step
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={loading} className="rounded-none bg-deep-emerald hover:bg-deep-emerald/90 text-antique-gold font-medium tracking-wider px-8 h-12 min-w-[180px] shadow-lg border border-transparent hover:border-antique-gold/50 transition-all duration-300">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Submit Request
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

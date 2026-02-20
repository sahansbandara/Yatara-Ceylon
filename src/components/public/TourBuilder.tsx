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
import { CalendarIcon, Loader2, MapPin, CheckCircle2 } from 'lucide-react';
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

    const toggleDistrict = (id: string) => {
        setFormData(prev => ({
            ...prev,
            selectedDistricts: prev.selectedDistricts.includes(id)
                ? prev.selectedDistricts.filter(d => d !== id)
                : [...prev.selectedDistricts, id]
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

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/public/booking-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    type: 'CUSTOM', // Important: Type is CUSTOM
                    message: `
                        Custom Tour Request
                        Duration: ${formData.duration} days
                        Adults: ${formData.adults}, Children: ${formData.children}
                        Arrival: ${formData.arrivalDate ? format(formData.arrivalDate, 'yyyy-MM-dd') : 'Not set'}
                        Investment Scale: ${formData.budget}
                        Interests: ${formData.interests.join(', ')}
                        Selected Places: ${formData.selectedPlaces.map(pid => places.find(p => p._id === pid)?.name).join(', ')}
                        Notes: ${formData.message}
                    `,
                    // We can also pass structured data if API supports it, 
                    // but for now I'm stuffing it into message or if API expects customization object.
                    // The Booking model has `customPlanId` but maybe I should just create a booking request?
                    // The API `src/app/api/public/booking-request` handles creating a Booking.
                    // It expects { customerName, email, phone, packageId, message, type }.
                    // I'll assume standard fields.
                })
            });

            if (res.ok) {
                // Success
                alert("Tour request submitted successfully! We will contact you shortly.");
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 min-h-[600px] flex flex-col md:flex-row">
            {/* Sidebar Steps */}
            <div className="bg-ocean-900 text-white p-8 md:w-1/4 flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-8">Plan Your Trip</h2>
                    <div className="space-y-6">
                        {[
                            { step: 1, label: 'Trip Details', icon: CalendarIcon },
                            { step: 2, label: 'Destinations', icon: MapPin },
                            { step: 3, label: 'Review & Submit', icon: CheckCircle2 }
                        ].map((s) => (
                            <div key={s.step} className={cn("flex items-center gap-3", step === s.step ? "text-white" : "text-ocean-300")}>
                                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center border", step === s.step ? "bg-white text-ocean-900 border-white" : "border-ocean-300")}>
                                    {s.step}
                                </div>
                                <span className="font-medium">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-ocean-300 text-sm mt-8">
                    Step {step} of 3
                </div>
            </div>

            {/* Form Content */}
            <div className="p-8 md:w-3/4 bg-gray-50/50 overflow-y-auto max-h-[800px]">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold text-gray-900">Tell us about your trip</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Arrival Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.arrivalDate && "text-muted-foreground")}>
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
                                <label className="text-sm font-medium">Duration (Days)</label>
                                <Input type="number" min="1" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 7" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Adults</label>
                                <Select value={formData.adults} onValueChange={(val) => setFormData({ ...formData, adults: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Children</label>
                                <Select value={formData.children} onValueChange={(val) => setFormData({ ...formData, children: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[0, 1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Interests (Select all that apply)</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <div
                                        key={cat}
                                        onClick={() => toggleInterest(cat)}
                                        className={cn("px-4 py-2 rounded-full border cursor-pointer transition-colors text-sm font-medium",
                                            formData.interests.includes(cat) ? "bg-ocean-100 border-ocean-300 text-ocean-800" : "bg-white border-gray-200 text-gray-600 hover:border-ocean-200"
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
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Select Destinations</h3>
                            <span className="text-sm text-gray-500">{formData.selectedPlaces.length} places selected</span>
                        </div>

                        {/* Interactive Map */}
                        <MapWrapper places={places} selectedPlaces={formData.selectedPlaces} onSelectPlace={togglePlace} />

                        <div className="space-y-4 mt-6">
                            <h4 className="font-semibold text-gray-700">Browse by District</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg bg-white">
                                {districts.map(dist => (
                                    <div
                                        key={dist._id}
                                        onClick={() => toggleDistrict(dist._id)}
                                        className={cn("p-2 rounded cursor-pointer text-sm truncate",
                                            formData.selectedDistricts.includes(dist._id) ? "bg-ocean-50 text-ocean-700 font-medium" : "hover:bg-gray-50 text-gray-600"
                                        )}
                                    >
                                        {dist.name}
                                    </div>
                                ))}
                            </div>

                            {/* Places List for Selected Districts */}
                            {formData.selectedDistricts.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-700">Available Places</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {places
                                            .filter(p => formData.selectedDistricts.includes(p.districtId || p.district))
                                            .map(place => (
                                                <div
                                                    key={place._id} // Assume place has _id
                                                    onClick={() => togglePlace(place._id)}
                                                    className={cn("p-3 rounded border cursor-pointer flex items-center justify-between",
                                                        formData.selectedPlaces.includes(place._id) ? "border-ocean-500 bg-ocean-50" : "border-gray-200 bg-white hover:border-ocean-200"
                                                    )}
                                                >
                                                    <div className="text-sm font-medium">{place.name}</div>
                                                    {formData.selectedPlaces.includes(place._id) && <CheckCircle2 className="h-4 w-4 text-ocean-600" />}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold text-gray-900">Final Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Your Name</label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">WhatsApp / Phone</label>
                                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 890" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-serif tracking-widest uppercase text-deep-emerald">Investment Scale (Per Person)</label>
                                <Select value={formData.budget} onValueChange={(val) => setFormData({ ...formData, budget: val })}>
                                    <SelectTrigger className="h-12 border-off-white/20 rounded-none bg-off-white/50 focus:ring-antique-gold font-light"><SelectValue placeholder="Select scale" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="250-500">Standard Luxury (USD 250 - 500/day)</SelectItem>
                                        <SelectItem value="500-1000">Premium Bespoke (USD 500 - 1000/day)</SelectItem>
                                        <SelectItem value="1000+">Sovereign Access (USD 1000+/day)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Additional Notes / Special Requests</label>
                            <Textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Any specific requirements? Dietary restrictions? Accessibility needs?"
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="bg-ocean-50 p-4 rounded-xl border border-ocean-100">
                            <h4 className="font-bold text-ocean-900 mb-2">Summary</h4>
                            <p className="text-sm text-ocean-700">
                                {formData.duration} days • {formData.adults} Adults, {formData.children} Children • {formData.selectedPlaces.length} Destinations
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handleBack}>Back</Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < 3 ? (
                        <Button onClick={handleNext} className="bg-ocean-600 hover:bg-ocean-700 text-white">Next Step</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="bg-ocean-600 hover:bg-ocean-700 text-white min-w-[150px]">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Submit Request
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

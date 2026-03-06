import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner";
import PartnerService from "@/models/PartnerService";
import { Building2, Star, Tag, DollarSign } from "lucide-react";

async function getHotelData() {
    try {
        await connectDB();
        const [partners, services] = await Promise.all([
            Partner.find({ type: 'HOTEL', status: 'ACTIVE' }).lean(),
            PartnerService.find({}).populate('partnerId', 'name type').lean(),
        ]);
        return {
            partners: JSON.parse(JSON.stringify(partners)),
            services: JSON.parse(JSON.stringify(services)),
        };
    } catch {
        return { partners: [], services: [] };
    }
}

export default async function HotelDashboardPage() {
    const { partners, services } = await getHotelData();

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-deep-emerald">Hotel Partner Dashboard</h1>
                <p className="text-sm text-gray-500 font-light mt-1">Manage your property details, services, and rates</p>
            </div>

            {/* Partner Profiles */}
            <div className="liquid-glass-stat rounded-2xl p-6">
                <h3 className="text-lg font-display font-semibold text-deep-emerald mb-4">Properties</h3>
                {partners.length > 0 ? (
                    <div className="space-y-3">
                        {partners.map((p: any) => (
                            <div key={p._id} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/50 border border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/50 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="h-5 w-5 text-teal-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-deep-emerald">{p.name}</p>
                                    <p className="text-xs text-gray-500">{p.contact?.email} · {p.contact?.phone}</p>
                                </div>
                                <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">No hotel properties registered yet.</p>
                )}
            </div>

            {/* Services & Rates */}
            <div className="liquid-glass-stat rounded-2xl p-6">
                <h3 className="text-lg font-display font-semibold text-deep-emerald mb-4">Services & Rates</h3>
                {services.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                        {services.map((s: any) => (
                            <div key={s._id} className="px-4 py-3 rounded-xl bg-white/50 border border-gray-100">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-semibold text-deep-emerald">{s.name}</p>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3 text-emerald-600" />
                                        <span className="text-sm font-bold text-emerald-700">{s.rate}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">{s.unit} · {(s.partnerId as any)?.name || 'Partner'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">No services configured yet.</p>
                )}
            </div>
        </div>
    );
}

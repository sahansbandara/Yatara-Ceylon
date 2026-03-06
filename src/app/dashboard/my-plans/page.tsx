import connectDB from "@/lib/mongodb";
import CustomPlan from "@/models/CustomPlan";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { FileText, ArrowUpRight, MapPin } from "lucide-react";

async function getCustomerPlans(userId: string) {
    try {
        await connectDB();
        const plans = await CustomPlan.find({ userId, isDeleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(plans));
    } catch {
        return [];
    }
}

export default async function MyPlansPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('toms_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const userId = payload?.userId || '';

    const plans = await getCustomerPlans(userId);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-deep-emerald">My Plans</h1>
                <p className="text-sm text-gray-500 font-light mt-1">Custom tour plans you&apos;ve saved</p>
            </div>

            {plans.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    {plans.map((plan: any) => (
                        <div key={plan._id} className="liquid-glass-stat rounded-2xl p-6">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/50 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-4 w-4 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-deep-emerald">{plan.title || 'Custom Plan'}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{plan.status}</p>
                                </div>
                            </div>
                            {plan.districts && (
                                <p className="text-xs text-gray-500">{plan.districts.length} districts selected</p>
                            )}
                            <p className="text-[10px] text-gray-400 mt-2">
                                Created {new Date(plan.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="liquid-glass-stat rounded-2xl p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-display font-semibold text-deep-emerald mb-2">No Saved Plans</h3>
                    <p className="text-sm text-gray-500 mb-6">Design your dream Sri Lanka itinerary with our tour builder.</p>
                    <Link
                        href="/build-tour"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-deep-emerald font-medium text-sm rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        Build Your Tour <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}

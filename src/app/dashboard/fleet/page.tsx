import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import VehicleBlock from "@/models/VehicleBlock";
import Booking from "@/models/Booking";
import { Car, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    AVAILABLE: { bg: 'bg-green-50', text: 'text-green-700', label: 'Available' },
    MAINTENANCE: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Maintenance' },
    UNAVAILABLE: { bg: 'bg-red-50', text: 'text-red-700', label: 'Unavailable' },
};

async function getFleetData() {
    try {
        await connectDB();
        const [vehicles, blocks, assignedBookings] = await Promise.all([
            Vehicle.find({}).lean(),
            VehicleBlock.find({
                to: { $gte: new Date() },
            }).lean(),
            Booking.find({
                assignedVehicleId: { $ne: null },
                isDeleted: false,
                status: { $in: ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'] },
            }).select('bookingNo customerName dates assignedVehicleId status').lean(),
        ]);
        return {
            vehicles: JSON.parse(JSON.stringify(vehicles)),
            blocks: JSON.parse(JSON.stringify(blocks)),
            assignedBookings: JSON.parse(JSON.stringify(assignedBookings)),
        };
    } catch {
        return { vehicles: [], blocks: [], assignedBookings: [] };
    }
}

export default async function FleetDashboardPage() {
    const { vehicles, blocks, assignedBookings } = await getFleetData();

    return (
        <div className="flex flex-col gap-8 text-slate-800">
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900">Fleet Partner Dashboard</h1>
                <p className="text-sm text-slate-500 font-light mt-1">Manage your vehicles, availability, and assignments</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="liquid-glass-stat rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-600">Total Vehicles</p>
                        <Car className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-display font-bold text-deep-emerald">{vehicles.length}</p>
                </div>
                <div className="liquid-glass-stat rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-600">Active Assignments</p>
                        <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-display font-bold text-deep-emerald">{assignedBookings.length}</p>
                </div>
                <div className="liquid-glass-stat rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-600">Blocked Periods</p>
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-display font-bold text-deep-emerald">{blocks.length}</p>
                </div>
            </div>

            {/* Vehicles List */}
            <div className="liquid-glass-stat rounded-2xl p-6">
                <h3 className="text-lg font-display font-semibold text-deep-emerald mb-4">Vehicles</h3>
                {vehicles.length > 0 ? (
                    <div className="space-y-3">
                        {vehicles.map((v: any) => {
                            const status = STATUS_COLORS[v.status] || STATUS_COLORS.AVAILABLE;
                            const vehicleBlocks = blocks.filter((b: any) => b.vehicleId === v._id);
                            const vehicleBookings = assignedBookings.filter((b: any) => b.assignedVehicleId === v._id);

                            return (
                                <div key={v._id} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/50 border border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/50 flex items-center justify-center flex-shrink-0">
                                        <Car className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-deep-emerald">{v.model}</p>
                                        <p className="text-xs text-gray-500">{v.type} · {v.seats} seats · ${v.dailyRate}/day</p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        {vehicleBookings.length > 0 && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                                {vehicleBookings.length} trip{vehicleBookings.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                        {vehicleBlocks.length > 0 && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                                                {vehicleBlocks.length} blocked
                                            </span>
                                        )}
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${status.bg} ${status.text}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">No vehicles registered yet.</p>
                )}
            </div>

            {/* Active Assignments */}
            {assignedBookings.length > 0 && (
                <div className="liquid-glass-stat rounded-2xl p-6">
                    <h3 className="text-lg font-display font-semibold text-deep-emerald mb-4">Active Assignments</h3>
                    <div className="space-y-3">
                        {assignedBookings.map((b: any) => (
                            <div key={b._id} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/50 border border-gray-100">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-deep-emerald">{b.bookingNo}</p>
                                    <p className="text-xs text-gray-500">
                                        {b.customerName} · {new Date(b.dates?.from).toLocaleDateString()} → {new Date(b.dates?.to).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                    {b.status?.replace(/_/g, ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

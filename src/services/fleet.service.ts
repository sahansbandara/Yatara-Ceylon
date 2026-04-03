import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import VehicleBlock from "@/models/VehicleBlock";
import Booking from "@/models/Booking";

export const FleetService = {
    async getFleetData(userId: string) {
        try {
            await connectDB();
            const vehicles = await Vehicle.find({ ownerId: userId, isDeleted: false }).lean();
            const vehicleIds = vehicles.map(v => v._id);

            const [blocks, assignedBookings] = await Promise.all([
                VehicleBlock.find({
                    vehicleId: { $in: vehicleIds },
                    to: { $gte: new Date() },
                }).lean(),
                Booking.find({
                    assignedVehicleId: { $in: vehicleIds },
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
};

import connectDB from "@/lib/mongodb";
import Partner from "@/models/Partner";
import PartnerService from "@/models/PartnerService";
import PartnerServiceBlock from "@/models/PartnerServiceBlock";
import Booking from "@/models/Booking";
import { BookingStatus } from "@/lib/constants";

export const HotelService = {
    async getHotelData(userId: string) {
        try {
            await connectDB();
            const partners = await Partner.find({ ownerId: userId, type: 'HOTEL', status: 'ACTIVE' }).lean();
            const partnerIds = partners.map((p: any) => p._id);

            const services = await PartnerService.find({
                partnerId: { $in: partnerIds },
                isDeleted: false,
            }).populate('partnerId', 'name type').lean();

            const serviceIds = services.map((s: any) => s._id);
            const now = new Date();

            const [blocks, recentBookings] = await Promise.all([
                PartnerServiceBlock.find({ serviceId: { $in: serviceIds } }).lean(),
                Booking.find({
                    status: { $in: [BookingStatus.CONFIRMED, BookingStatus.ADVANCE_PAID, BookingStatus.IN_PROGRESS, BookingStatus.ASSIGNED] },
                    isDeleted: false,
                    'dates.from': { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
                })
                    .sort({ 'dates.from': 1 })
                    .limit(5)
                    .lean(),
            ]);

            // Compute KPI values
            const activeServices = services.filter((s: any) => s.isActive !== false).length;
            const now_str = now.toISOString();
            const activeBlocks = blocks.filter((b: any) => b.to >= now_str).length;
            const totalRevenuePotential = services.reduce((sum: number, s: any) => sum + (s.rate || s.price || 0), 0);
            const occupancyRate = services.length > 0
                ? Math.round((activeServices / services.length) * 100)
                : 0;

            return {
                partners: JSON.parse(JSON.stringify(partners)),
                services: JSON.parse(JSON.stringify(services)),
                blocks: JSON.parse(JSON.stringify(blocks)),
                recentBookings: JSON.parse(JSON.stringify(recentBookings)),
                kpis: {
                    totalServices: services.length,
                    activeServices,
                    totalBlocks: blocks.length,
                    activeBlocks,
                    totalRevenuePotential,
                    occupancyRate,
                },
            };
        } catch {
            return {
                partners: [],
                services: [],
                blocks: [],
                recentBookings: [],
                kpis: { totalServices: 0, activeServices: 0, totalBlocks: 0, activeBlocks: 0, totalRevenuePotential: 0, occupancyRate: 0 },
            };
        }
    }
};

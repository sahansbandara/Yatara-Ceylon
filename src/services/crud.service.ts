import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import SupportTicket from "@/models/SupportTicket";
import Destination from "@/models/Destination";
import Partner from "@/models/Partner";
import Vehicle from "@/models/Vehicle";
import VehicleBlock from "@/models/VehicleBlock";
import Booking from "@/models/Booking";
import CustomPlan from "@/models/CustomPlan";
import AuditLog from "@/models/AuditLog";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Invoice from "@/models/Invoice";
import Package from "@/models/Package";
import { VehicleStatus, PartnerStatus, PartnerTypes } from "@/lib/constants";

// ── Notifications ────────────────────────────────
export const NotificationService = {
    async getNotifications() {
        try {
            await connectDB();
            const notifications = await Notification.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
            return JSON.parse(JSON.stringify(notifications));
        } catch (error) {
            console.error(error);
            return [];
        }
    }
};

// ── Destinations ─────────────────────────────────
export const DestinationService = {
    async getDestinations() {
        try {
            await connectDB();
            const destinations = await Destination.find({ isDeleted: false }).sort({ title: 1 }).lean();
            return JSON.parse(JSON.stringify(destinations));
        } catch (error) {
            console.error("Failed to fetch destinations:", error);
            return [];
        }
    }
};

// ── Support Tickets ──────────────────────────────
export const SupportService = {
    async getTickets() {
        try {
            await connectDB();
            const tickets = await SupportTicket.find({ isDeleted: false })
                .sort({ updatedAt: -1 })
                .lean();
            return JSON.parse(JSON.stringify(tickets));
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
            return [];
        }
    }
};

// ── Vehicles ─────────────────────────────────────
export const VehicleService = {
    async getVehicleStats() {
        try {
            await connectDB();
            const vehicles = await Vehicle.find({ isDeleted: false }).lean();
            const serialized = JSON.parse(JSON.stringify(vehicles));

            return {
                vehicles: serialized,
                stats: {
                    total: serialized.length,
                    available: serialized.filter((v: any) => v.status === VehicleStatus.AVAILABLE).length,
                    unavailable: serialized.filter((v: any) => v.status !== VehicleStatus.AVAILABLE && v.status !== VehicleStatus.PENDING_APPROVAL).length,
                    pendingApproval: serialized.filter((v: any) => v.status === VehicleStatus.PENDING_APPROVAL).length,
                }
            };
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
            return {
                vehicles: [],
                stats: { total: 0, available: 0, unavailable: 0, pendingApproval: 0 }
            };
        }
    }
};

// ── Partners ─────────────────────────────────────
export const PartnerService = {
    async getPartnerStats() {
        try {
            await connectDB();
            const partners = await Partner.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
            const serialized = JSON.parse(JSON.stringify(partners));

            const typeCounts = Object.keys(PartnerTypes).reduce((acc: any, type: string) => {
                acc[type] = serialized.filter((p: any) => p.type === type).length;
                return acc;
            }, {});

            const topType = Object.entries(typeCounts).reduce((max: any, [type, count]: any) =>
                count > (max[1] || 0) ? [type, count] : max
                , ['OTHER', 0])[0];

            return {
                partners: serialized,
                stats: {
                    total: serialized.length,
                    active: serialized.filter((p: any) => p.status === PartnerStatus.ACTIVE).length,
                    topType: topType,
                    topTypeCount: typeCounts[topType as keyof typeof PartnerTypes] || 0,
                    pendingReview: serialized.filter((p: any) => p.status !== PartnerStatus.ACTIVE).length,
                }
            };
        } catch (error) {
            console.error("Failed to fetch partners:", error);
            return {
                partners: [],
                stats: { total: 0, active: 0, topType: 'OTHER', topTypeCount: 0, pendingReview: 0 }
            };
        }
    }
};

// ── Profile ──────────────────────────────────────
export const ProfileService = {
    async getUserProfile(userId: string) {
        try {
            await connectDB();
            const user = await User.findById(userId).select('-passwordHash').lean();
            return user ? JSON.parse(JSON.stringify(user)) : null;
        } catch {
            return null;
        }
    }
};

// ── Audit Logs ───────────────────────────────────
export const AuditLogService = {
    async getAuditLogs(page: number = 1, limit: number = 50) {
        try {
            await connectDB();
            const [logs, total] = await Promise.all([
                AuditLog.find({}).sort({ at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                AuditLog.countDocuments({}),
            ]);
            return {
                logs: JSON.parse(JSON.stringify(logs)),
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
            return { logs: [], total: 0, page, totalPages: 0 };
        }
    }
};

// ── My Bookings (customer-facing) ────────────────
export const MyBookingsService = {
    async getCustomerBookings(userEmail: string) {
        try {
            await connectDB();
            const bookings = await Booking.find({
                email: userEmail,
                isDeleted: false,
            })
                .sort({ createdAt: -1 })
                .populate('packageId', 'title')
                .lean();
            return JSON.parse(JSON.stringify(bookings));
        } catch {
            return [];
        }
    }
};

// ── My Plans (customer-facing) ───────────────────
export const MyPlansService = {
    async getCustomerPlans(userId: string, email?: string) {
        try {
            await connectDB();
            const filters: Record<string, unknown> = { isDeleted: { $ne: true } };
            if (userId && email) {
                filters.$or = [{ userId }, { customerEmail: email }];
            } else if (userId) {
                filters.userId = userId;
            } else if (email) {
                filters.customerEmail = email;
            }

            const plans = await CustomPlan.find(filters)
                .sort({ createdAt: -1 })
                .lean();
            return JSON.parse(JSON.stringify(plans));
        } catch {
            return [];
        }
    }
};

// ── Booking Detail ───────────────────────────────
export const BookingDetailService = {
    async getBookingDetail(id: string) {
        try {
            await connectDB();
            const booking = await Booking.findById(id)
                .populate('packageId', 'title slug priceMin priceMax')
                .populate('assignedStaffId', 'name email')
                .populate('assignedVehicleId', 'model type seats dailyRate')
                .lean();
            if (!booking || (booking as any).isDeleted) return null;

            const payments = await Payment.find({ bookingId: id, isDeleted: false })
                .sort({ createdAt: -1 })
                .lean();

            const invoices = await Invoice.find({ bookingId: id, isDeleted: false })
                .sort({ createdAt: -1 })
                .lean();

            const vehicles = await Vehicle.find({ status: 'AVAILABLE' }).select('model type seats dailyRate').lean();

            return {
                booking: JSON.parse(JSON.stringify(booking)),
                payments: JSON.parse(JSON.stringify(payments)),
                invoices: JSON.parse(JSON.stringify(invoices)),
                vehicles: JSON.parse(JSON.stringify(vehicles)),
            };
        } catch {
            return null;
        }
    }
};

// ── Detail: Notification by ID ───────────────────
export const NotificationDetailService = {
    async getNotificationById(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        try {
            await connectDB();
            const notification = await Notification.findOne({ _id: id, isDeleted: { $ne: true } }).lean();
            if (!notification) return null;
            return JSON.parse(JSON.stringify(notification));
        } catch (error) {
            console.error('Failed to fetch notification:', error);
            return null;
        }
    }
};

// ── Detail: Vehicle by ID ────────────────────────
export const VehicleDetailService = {
    async getVehicleById(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        try {
            await connectDB();
            const vehicle = await Vehicle.findById(id).lean();
            if (!vehicle) return null;

            const blocks = await VehicleBlock.find({ vehicleId: id }).sort({ from: 1 }).lean();

            return {
                vehicle: JSON.parse(JSON.stringify(vehicle)),
                blocks: JSON.parse(JSON.stringify(blocks)),
            };
        } catch (error) {
            console.error("Failed to fetch vehicle:", error);
            return null;
        }
    }
};

// ── Detail: User by ID ──────────────────────────
export const UserDetailService = {
    async getUserById(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        try {
            await connectDB();
            const user = await User.findById(id).lean();
            if (!user) return null;
            return JSON.parse(JSON.stringify(user));
        } catch (error) {
            console.error("Failed to fetch user:", error);
            return null;
        }
    }
};

// ── Detail: Partner by ID ───────────────────────
export const PartnerDetailService = {
    async getPartnerById(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        try {
            await connectDB();
            const partner = await Partner.findById(id).lean();
            if (!partner) return null;
            return JSON.parse(JSON.stringify(partner));
        } catch (error) {
            console.error("Failed to fetch partner:", error);
            return null;
        }
    }
};

// ── Detail: Package by ID ───────────────────────
export const PackageDetailService = {
    async getPackageById(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        try {
            await connectDB();
            const pkg = await Package.findById(id).lean();
            if (!pkg) return null;
            return JSON.parse(JSON.stringify(pkg));
        } catch (error) {
            console.error("Failed to fetch package:", error);
            return null;
        }
    }
};

// ── Detail: Destination by ID ───────────────────
export const DestinationDetailService = {
    async getDestinationById(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        try {
            await connectDB();
            const dest = await Destination.findById(id).lean();
            if (!dest) return null;
            return JSON.parse(JSON.stringify(dest));
        } catch (error) {
            console.error("Failed to fetch destination:", error);
            return null;
        }
    }
};

// ── Detail: Support Ticket by ID ────────────────
export const SupportDetailService = {
    async getTicketById(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
        try {
            await connectDB();
            const ticket = await SupportTicket.findById(id).lean();
            if (!ticket) return null;
            return JSON.parse(JSON.stringify(ticket));
        } catch (error) {
            console.error("Failed to fetch ticket:", error);
            return null;
        }
    }
};

// ── Detail: My Plan by ID ───────────────────────
export const MyPlanDetailService = {
    async getPlanById(id: string, userId: string, email?: string) {
        try {
            await connectDB();
            const filter: Record<string, unknown> = {
                _id: id,
                isDeleted: { $ne: true },
            };
            if (userId && email) {
                filter.$or = [{ userId }, { customerEmail: email }];
            } else if (userId) {
                filter.userId = userId;
            } else if (email) {
                filter.customerEmail = email;
            }
            const plan = await CustomPlan.findOne(filter).lean();
            return plan ? JSON.parse(JSON.stringify(plan)) : null;
        } catch {
            return null;
        }
    }
};

// ── Fleet Calendar (admin) ──────────────────────
export const FleetCalendarService = {
    async getAdminFleetData() {
        try {
            await connectDB();
            const vehicles = await Vehicle.find({ isDeleted: false }).lean();
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

            const serializedVehicles = JSON.parse(JSON.stringify(vehicles));

            return {
                vehicles: serializedVehicles,
                blocks: JSON.parse(JSON.stringify(blocks)),
                assignedBookings: JSON.parse(JSON.stringify(assignedBookings)),
                stats: {
                    total: serializedVehicles.length,
                    available: serializedVehicles.filter((v: any) => v.status === VehicleStatus.AVAILABLE).length,
                    unavailable: serializedVehicles.filter((v: any) => v.status !== VehicleStatus.AVAILABLE && v.status !== VehicleStatus.PENDING_APPROVAL).length,
                    pendingApproval: serializedVehicles.filter((v: any) => v.status === VehicleStatus.PENDING_APPROVAL).length,
                }
            };
        } catch (error) {
            console.error("Failed to fetch admin fleet data:", error);
            return {
                vehicles: [],
                blocks: [],
                assignedBookings: [],
                stats: { total: 0, available: 0, unavailable: 0, pendingApproval: 0 }
            };
        }
    }
};

// ── Invoice Detail ──────────────────────────────
export const InvoiceDetailService = {
    async getInvoiceDetail(id: string) {
        try {
            await connectDB();
            const invoice = await Invoice.findOne({ _id: id, isDeleted: { $ne: true } })
                .populate('bookingId', 'bookingNo customerName email phone totalCost paidAmount remainingBalance')
                .lean();
            if (!invoice) return null;

            const payments = await Payment.find({
                invoiceId: id,
                isDeleted: false,
            }).sort({ createdAt: -1 }).lean();

            return {
                invoice: JSON.parse(JSON.stringify(invoice)),
                payments: JSON.parse(JSON.stringify(payments)),
            };
        } catch {
            return null;
        }
    }
};


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { staffOrAdmin, withAuth } from '@/lib/rbac';
import { validateBody } from '@/lib/validate';
import { createBookingSchema } from '@/lib/validations';
import { logAudit } from '@/lib/audit';

// GET /api/bookings – protected: staff/admin see all, customers see only their own
export const GET = withAuth(async (request, { user }) => {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const hasBalanceDue = searchParams.get('hasBalanceDue');

        const filter: Record<string, unknown> = { isDeleted: false };

        // Customers can only see their own bookings
        if (user.role === 'USER') {
            filter.email = user.email;
        }

        if (status) filter.status = status;
        if (type) filter.type = type;
        if (search && ['ADMIN', 'STAFF'].includes(user.role)) {
            filter.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { bookingNo: { $regex: search, $options: 'i' } },
            ];
        }

        // Date range filter on booking travel dates
        if (dateFrom || dateTo) {
            const dateFilter: Record<string, unknown> = {};
            if (dateFrom) dateFilter.$gte = new Date(dateFrom);
            if (dateTo) dateFilter.$lte = new Date(dateTo);
            filter['dates.from'] = dateFilter;
        }

        // Filter bookings with outstanding balance
        if (hasBalanceDue === 'true') {
            filter.remainingBalance = { $gt: 0 };
        }

        // Sorting
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
        const allowedSortFields = ['createdAt', 'customerName', 'totalCost', 'paidAmount', 'remainingBalance', 'dates.from', 'bookingNo', 'status'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

        const [bookings, total] = await Promise.all([
            Booking.find(filter)
                .populate('packageId', 'title slug')
                .populate('assignedStaffId', 'name')
                .populate('assignedVehicleId', 'model type')
                .sort({ [sortField]: sortOrder })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Booking.countDocuments(filter),
        ]);

        return NextResponse.json({ bookings, total, page, totalPages: Math.ceil(total / limit) });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

export const POST = staffOrAdmin(async (request, { user }) => {
    const { data, error } = await validateBody(request, createBookingSchema);
    if (error) return error;
    try {
        await connectDB();

        // Duplicate booking detection: same customer name + overlapping dates
        const fromDate = new Date(data!.dates.from);
        const toDate = new Date(data!.dates.to);
        const duplicateCheckResult = await Booking.findOne({
            isDeleted: false,
            customerName: { $regex: `^${data!.customerName.trim()}$`, $options: 'i' },
            status: { $nin: ['CANCELLED'] },
            'dates.from': { $lte: toDate },
            'dates.to': { $gte: fromDate },
        })
            .select('bookingNo customerName')
            .lean();
        const duplicateCheck = Array.isArray(duplicateCheckResult)
            ? duplicateCheckResult[0]
            : duplicateCheckResult;

        const booking = await Booking.create({
            ...data,
            dates: { from: fromDate, to: toDate },
        });
        await logAudit({ actorUserId: user.userId, action: 'CREATE', entity: 'Booking', entityId: booking._id.toString() });
        return NextResponse.json({
            booking,
            warning: duplicateCheck
                ? `Possible duplicate: ${duplicateCheck.bookingNo} for "${duplicateCheck.customerName}" has overlapping dates.`
                : undefined,
        }, { status: 201 });
    } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
});

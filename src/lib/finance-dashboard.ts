import { BookingStatus } from '@/lib/constants';

export interface OutstandingBalanceBooking {
    _id?: string;
    bookingNo: string;
    customerName?: string;
    paidAmount?: number;
    remainingBalance: number;
    status?: string;
    dates?: {
        from?: Date | string;
        to?: Date | string;
    };
    createdAt?: Date | string;
}

const actionableStatusPriority: Record<string, number> = {
    [BookingStatus.IN_PROGRESS]: 0,
    [BookingStatus.ASSIGNED]: 1,
    [BookingStatus.CONFIRMED]: 2,
    [BookingStatus.ADVANCE_PAID]: 3,
    [BookingStatus.PAYMENT_PENDING]: 4,
    [BookingStatus.CONTACTED]: 5,
    [BookingStatus.NEW]: 6,
};

const settledStatuses = new Set<string>([
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
]);

function toTimestamp(value?: Date | string): number {
    if (!value) return Number.POSITIVE_INFINITY;
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

function isActionableOutstanding(booking: OutstandingBalanceBooking, now: Date): boolean {
    const status = booking.status || '';
    if (settledStatuses.has(status)) {
        return false;
    }

    return toTimestamp(booking.dates?.to) >= now.getTime();
}

function compareDescending(a: number, b: number): number {
    return b - a;
}

export function rankOutstandingBookings<T extends OutstandingBalanceBooking>(
    bookings: T[],
    nowInput: Date | string = new Date()
): T[] {
    const now = new Date(nowInput);

    return [...bookings].sort((left, right) => {
        const leftActionable = isActionableOutstanding(left, now);
        const rightActionable = isActionableOutstanding(right, now);

        if (leftActionable !== rightActionable) {
            return leftActionable ? -1 : 1;
        }

        if (leftActionable && rightActionable) {
            const leftPriority = actionableStatusPriority[left.status || ''] ?? Number.MAX_SAFE_INTEGER;
            const rightPriority = actionableStatusPriority[right.status || ''] ?? Number.MAX_SAFE_INTEGER;
            if (leftPriority !== rightPriority) {
                return leftPriority - rightPriority;
            }

            const departureDiff = toTimestamp(left.dates?.from) - toTimestamp(right.dates?.from);
            if (departureDiff !== 0) {
                return departureDiff;
            }
        }

        const balanceDiff = compareDescending(left.remainingBalance || 0, right.remainingBalance || 0);
        if (balanceDiff !== 0) {
            return balanceDiff;
        }

        const createdAtDiff = compareDescending(toTimestamp(left.createdAt), toTimestamp(right.createdAt));
        if (createdAtDiff !== 0) {
            return createdAtDiff;
        }

        return (left.bookingNo || '').localeCompare(right.bookingNo || '');
    });
}

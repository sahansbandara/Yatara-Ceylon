import RefundsClient from './RefundsClient';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { adminOnly, staffOnly } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import RefundRequest from '@/models/RefundRequest';

export const dynamic = 'force-dynamic';

export default async function RefundsPage() {
    const user = await getSessionUser();
    if (!user || (!adminOnly(user) && !staffOnly(user))) {
        redirect('/login');
    }

    await connectDB();
    const refunds = await RefundRequest.find()
        .populate('bookingId', 'bookingNo status type dates totalCost paidAmount')
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 })
        .lean();

    // Serialize
    const serializedRefunds = JSON.parse(JSON.stringify(refunds));

    return <RefundsClient refunds={serializedRefunds} userRole={user.role} />;
}

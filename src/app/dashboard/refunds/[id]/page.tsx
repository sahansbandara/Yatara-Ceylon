import RefundDetailClient from './RefundDetailClient';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import RefundRequest from '@/models/RefundRequest';

export const dynamic = 'force-dynamic';

export default async function RefundDetailPage({ params }: { params: { id: string } }) {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
        redirect('/login');
    }

    await connectDB();
    const refund = await RefundRequest.findById(params.id)
        .populate('bookingId')
        .populate('customerId', 'name email phone')
        .lean();

    if (!refund) {
        redirect('/dashboard/refunds');
    }

    const serializedRefund = JSON.parse(JSON.stringify(refund));

    return <RefundDetailClient refund={serializedRefund} userRole={user.role} />;
}

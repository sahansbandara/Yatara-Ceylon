import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CustomBookingsClient from '@/components/dashboard/CustomBookingsClient';

export default async function CustomBookingsPage() {
    const session = await getSessionUser();
    if (!session || !['ADMIN', 'STAFF'].includes(session.role || '')) {
        redirect('/dashboard');
    }

    return <CustomBookingsClient />;
}

import { Suspense } from 'react';
import BookingRequestClient from '@/components/public/BookingRequestClient';
import SectionHeading from '@/components/public/SectionHeading';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import Package from '@/models/Package';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export const metadata: Metadata = {
    title: 'Booking Request | Yatara Ceylon',
    description: 'Submit your booking request or pay securely online.',
};

async function getVehicle(vehicleId?: string) {
    if (!vehicleId || !vehicleId.match(/^[0-9a-fA-F]{24}$/)) return null;
    await connectDB();
    const vehicle = await Vehicle.findById(vehicleId).lean();
    if (!vehicle) return null;
    return JSON.parse(JSON.stringify(vehicle));
}

async function getPackage(packageId?: string) {
    if (!packageId || !packageId.match(/^[0-9a-fA-F]{24}$/)) return null;
    await connectDB();
    const pkg = await Package.findById(packageId).lean();
    if (!pkg) return null;
    return JSON.parse(JSON.stringify(pkg));
}

export default async function BookingRequestPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const vehicleId = params.vehicleId as string | undefined;
    const packageId = params.packageId as string | undefined;

    const cookieStore = await cookies();
    const token = cookieStore.get('toms_token')?.value;
    const user = token ? await verifyToken(token) : null;

    const vehicle = await getVehicle(vehicleId);
    const pkg = await getPackage(packageId);

    const description = pkg
        ? `Booking "${pkg.title}" — Pay 20% advance to confirm`
        : vehicle
            ? `Booking ${vehicle.model} Transfer`
            : 'Please provide your details to process your request.';

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-4 md:px-8">
                <div className="mb-12">
                    <SectionHeading
                        title="Complete Your Booking"
                        description={description}
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <Suspense fallback={<div>Loading form...</div>}>
                        <BookingRequestClient vehicle={vehicle} pkg={pkg} user={user} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

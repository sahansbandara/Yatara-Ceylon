import { Suspense } from 'react';
import BookingRequestClient from '@/components/public/BookingRequestClient';
import SectionHeading from '@/components/public/SectionHeading';
import connectDB from '@/lib/mongodb';
import Vehicle from '@/models/Vehicle';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Booking Request | Ceylon Escapes',
    description: 'Submit your booking request or pay securely online.',
};

async function getVehicleOrPackage(vehicleId?: string) {
    if (!vehicleId || !vehicleId.match(/^[0-9a-fA-F]{24}$/)) return null;
    await connectDB();
    const vehicle = await Vehicle.findById(vehicleId).lean();
    if (!vehicle) return null;
    return JSON.parse(JSON.stringify(vehicle));
}

export default async function BookingRequestPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const vehicleId = params.vehicleId as string | undefined;

    const vehicle = await getVehicleOrPackage(vehicleId);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-4 md:px-8">
                <div className="mb-12">
                    <SectionHeading
                        title="Complete Your Booking"
                        description={vehicle ? `Booking ${vehicle.model} Transfer` : 'Please provide your details to process your request.'}
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <Suspense fallback={<div>Loading form...</div>}>
                        <BookingRequestClient vehicle={vehicle} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

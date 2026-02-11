import { Metadata } from 'next';
import SectionHeading from '@/components/public/SectionHeading';
import { Badge } from '@/components/ui/badge';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { BellRing, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

export const metadata: Metadata = {
    title: 'Special Offers | Ceylon Escapes',
    description: 'Exclusive travel deals and promotional offers for your Sri Lanka vacation.',
};

async function getOffers() {
    try {
        await connectDB();
        return await Notification.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(10).lean();
    } catch (error) {
        console.error("Failed to fetch offers:", error);
        return [];
    }
}

export default async function OffersPage() {
    // We will cast to any to avoid type issues for now, similar to other pages
    const offers: any[] = await getOffers();

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                <div className="mb-12">
                    <SectionHeading
                        title="Special Offers & News"
                        subtitle="Latest Updates"
                        description="Don't miss out on our limited-time deals and announcements."
                    />
                </div>

                <div className="space-y-6">
                    {offers.length > 0 ? (
                        offers.map((offer) => (
                            <div key={offer._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-4 md:gap-6">
                                <div className="shrink-0 h-12 w-12 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600">
                                    <BellRing className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
                                        {offer.createdAt && (
                                            <div className="flex items-center text-xs text-gray-400 whitespace-nowrap ml-4">
                                                <CalendarDays className="h-3 w-3 mr-1" />
                                                {format(new Date(offer.createdAt), 'MMM d, yyyy')}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">
                                        {offer.message}
                                    </p>
                                    <div className="mt-4">
                                        <Badge variant="secondary" className="bg-ocean-50 text-ocean-700 hover:bg-ocean-100">
                                            {offer.type || 'Update'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-500">No active offers at the moment.</h3>
                            <p className="text-gray-400 text-sm mt-1">Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

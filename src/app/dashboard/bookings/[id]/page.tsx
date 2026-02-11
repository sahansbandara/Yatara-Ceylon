import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, FileText, User as UserIcon, Mail, Phone, DollarSign, Settings } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingStatus } from '@/lib/constants';
import { format } from 'date-fns';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Booking Details | Dashboard',
};

async function getBooking(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return null;
    try {
        await connectDB();
        const booking = await Booking.findById(id).lean();
        if (!booking) return null;
        return JSON.parse(JSON.stringify(booking));
    } catch (error) {
        console.error("Failed to fetch booking:", error);
        return null;
    }
}

// Params type definition for Next.js 15+
type Params = Promise<{ id: string }>;

export default async function BookingDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const booking = await getBooking(id);

    if (!booking) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/bookings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Booking #{booking.bookingNo}</h1>
                    <p className="text-muted-foreground">{format(new Date(booking.createdAt), 'PPP p')}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                        {booking.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-ocean-600" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                <p className="text-lg">{booking.customerName}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <p>{booking.email}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <p>{booking.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Nationality</h3>
                                <p>{booking.nationality || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-ocean-600" />
                                Tour Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Booking Type</h3>
                                    <p className="font-semibold">{booking.type}</p>
                                </div>
                                {booking.packageId && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Package ID</h3>
                                        <Link href={`/dashboard/packages/${booking.packageId}`} className="text-blue-600 hover:underline">
                                            View Package
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-4 mt-2">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Itinerary / Notes</h3>
                                <div className="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-wrap">
                                    {booking.specialRequests || 'No special requests or itinerary notes.'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-ocean-600" />
                                Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                                <p className="text-lg">{format(new Date(booking.startDate), 'PPP')}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                                <p className="text-lg">{format(new Date(booking.endDate), 'PPP')}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                                <p>{Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-ocean-600" />
                                Financials
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total Amount</span>
                                <span>${booking.totalAmount?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="border-t pt-4">
                                <Button className="w-full" variant="outline">Generate Invoice</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-ocean-600" />
                                Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Simple Status Change Form could go here used as a server action or client component */}
                            <Button className="w-full bg-ocean-600 hover:bg-ocean-700">Update Status</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

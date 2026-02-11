import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, User as UserIcon, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Metadata } from 'next';
import TicketReplyForm from '@/components/dashboard/TicketReplyForm';

export const metadata: Metadata = {
    title: 'Ticket Details | Dashboard',
};

async function getTicket(id: string) {
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

type Params = Promise<{ id: string }>;

export default async function TicketDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const ticket = await getTicket(id);

    if (!ticket) {
        notFound();
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-100 text-blue-800';
            case 'REPLIED': return 'bg-yellow-100 text-yellow-800';
            case 'CLOSED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/support">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>
                    <p className="text-muted-foreground">
                        Opened {format(new Date(ticket.createdAt), 'PPP p')}
                    </p>
                </div>
                <Badge variant="outline" className={`text-sm px-3 py-1 ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversation Thread */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Original Message */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600">
                                    <UserIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold">{ticket.customerName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(ticket.createdAt), 'PPP p')}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
                        </CardContent>
                    </Card>

                    {/* Replies */}
                    {ticket.replies?.map((reply: any, index: number) => (
                        <Card key={reply._id || index} className={reply.byUserId ? 'border-l-4 border-l-ocean-500' : ''}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${reply.byUserId ? 'bg-ocean-100 text-ocean-600' : 'bg-gray-100 text-gray-600'}`}>
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            {reply.byName}
                                            {reply.byUserId && <span className="text-xs ml-2 text-ocean-600 font-normal">Staff</span>}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(reply.at), 'PPP p')}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">{reply.body}</p>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Reply Form */}
                    {ticket.status !== 'CLOSED' && (
                        <TicketReplyForm ticketId={ticket._id} />
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <UserIcon className="h-4 w-4 text-gray-400" />
                                <span>{ticket.customerName}</span>
                            </div>
                            {ticket.email && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span>{ticket.email}</span>
                                </div>
                            )}
                            {ticket.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{ticket.phone}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {ticket.status !== 'CLOSED' && (
                                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                                    Close Ticket
                                </Button>
                            )}
                            {ticket.bookingId && (
                                <Link href={`/dashboard/bookings/${ticket.bookingId}`}>
                                    <Button variant="outline" className="w-full">View Booking</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

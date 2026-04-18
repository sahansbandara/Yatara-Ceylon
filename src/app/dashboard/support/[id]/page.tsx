import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, User as UserIcon, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { Badge } from '@/components/ui/badge';
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
            case 'OPEN': return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
            case 'REPLIED': return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
            case 'CLOSED': return 'bg-white/10 text-white/50 border-white/20';
            default: return 'bg-white/10 text-white/60';
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/support">
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight text-off-white">{ticket.subject}</h1>
                    <p className="text-white/40 text-sm">
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
                    <div className="liquid-glass-stat rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400">
                                <UserIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-off-white">{ticket.customerName}</p>
                                <p className="text-xs text-white/40">
                                    {format(new Date(ticket.createdAt), 'PPP p')}
                                </p>
                            </div>
                        </div>
                        <p className="text-white/70 whitespace-pre-wrap">{ticket.message}</p>
                    </div>

                    {/* Replies */}
                    {ticket.replies?.map((reply: any, index: number) => (
                        <div key={reply._id || index} className={`liquid-glass-stat rounded-2xl p-6 ${reply.byUserId ? 'border-l-4 border-l-antique-gold/50' : ''}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${reply.byUserId ? 'bg-antique-gold/15 text-antique-gold' : 'bg-white/10 text-white/50'}`}>
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-off-white">
                                        {reply.byName}
                                        {reply.byUserId && <span className="text-xs ml-2 text-antique-gold font-normal">Staff</span>}
                                    </p>
                                    <p className="text-xs text-white/40">
                                        {format(new Date(reply.at), 'PPP p')}
                                    </p>
                                </div>
                            </div>
                            <p className="text-white/70 whitespace-pre-wrap">{reply.body}</p>
                        </div>
                    ))}

                    {/* Reply Form */}
                    {ticket.status !== 'CLOSED' && (
                        <TicketReplyForm ticketId={ticket._id} />
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="liquid-glass-stat-dark rounded-2xl p-6 border border-white/[0.08]">
                        <h3 className="text-sm font-semibold text-off-white uppercase tracking-wider mb-4">Customer Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-white/70">
                                <div className="h-8 w-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                                    <UserIcon className="h-4 w-4 text-white/50" />
                                </div>
                                <span className="font-medium text-white/90 truncate">{ticket.customerName}</span>
                            </div>
                            {ticket.email && (
                                <div className="flex items-center gap-3 text-sm text-white/70">
                                    <div className="h-8 w-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                                        <Mail className="h-4 w-4 text-white/50" />
                                    </div>
                                    <span className="truncate">{ticket.email}</span>
                                </div>
                            )}
                            {ticket.phone && (
                                <div className="flex items-center gap-3 text-sm text-white/70">
                                    <div className="h-8 w-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                                        <Phone className="h-4 w-4 text-white/50" />
                                    </div>
                                    <span>{ticket.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="liquid-glass-stat-dark rounded-2xl p-6 border border-white/[0.08]">
                        <h3 className="text-sm font-semibold text-off-white uppercase tracking-wider mb-4">Actions</h3>
                        <div className="space-y-3">
                            {ticket.status !== 'CLOSED' && (
                                <Button variant="outline" className="w-full h-11 rounded-xl text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30 bg-transparent transition-all">
                                    Close Ticket
                                </Button>
                            )}
                            {ticket.bookingId && (
                                <Link href={`/dashboard/bookings/${ticket.bookingId}`} className="block">
                                    <Button variant="outline" className="w-full h-11 rounded-xl text-white/70 border-white/[0.1] hover:bg-white/[0.06] hover:text-white bg-transparent transition-all">View Booking</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

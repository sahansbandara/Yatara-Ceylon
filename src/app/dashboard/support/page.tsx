import TicketTable from '@/components/dashboard/TicketTable';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassPanel } from '@/components/dashboard/GlassPanel';
import { Headphones, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

async function getTickets() {
    try {
        await connectDB();
        const tickets = await SupportTicket.find({ isDeleted: false })
            .sort({ updatedAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(tickets));
    } catch (error) {
        console.error("Failed to fetch tickets:", error);
        return [];
    }
}

export default async function SupportPage() {
    const tickets = await getTickets();

    const totalTickets = tickets.length;
    const openTickets = tickets.filter((t: any) => t.status !== 'CLOSED' && t.status !== 'RESOLVED').length;
    const highPriorityTickets = tickets.filter((t: any) => {
        const priority = (t as any).priority;
        return priority === 'HIGH' || priority === 'URGENT';
    }).length;

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHero
                title="Support Inbox"
                subtitle={`${totalTickets} total • ${openTickets} open`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Tickets"
                    value={totalTickets.toString()}
                    icon={MessageSquare}
                    accentColor="text-blue-400"
                />
                <StatCard
                    title="Open"
                    value={openTickets.toString()}
                    icon={Headphones}
                    accentColor="text-amber-400"
                />
                <StatCard
                    title="High Priority"
                    value={highPriorityTickets.toString()}
                    icon={AlertTriangle}
                    accentColor="text-red-400"
                />
                <StatCard
                    title="Avg Response Time"
                    value="—"
                    icon={CheckCircle}
                    accentColor="text-emerald-400"
                />
            </div>

            <GlassPanel>
                <TicketTable tickets={tickets} />
            </GlassPanel>
        </div>
    );
}

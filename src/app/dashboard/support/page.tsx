import TicketTable from '@/components/dashboard/TicketTable';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { GlassPanel } from '@/components/dashboard/GlassPanel';

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

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHero
                title="Support Inbox"
                subtitle="Manage customer support tickets and inquiries."
            />

            <GlassPanel>
                <TicketTable tickets={tickets} />
            </GlassPanel>
        </div>
    );
}

import TicketTable from '@/components/dashboard/TicketTable';
import connectDB from '@/lib/mongodb';
import SupportTicket from '@/models/SupportTicket';

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Inbox</h1>
                    <p className="text-muted-foreground">Manage customer support tickets and inquiries.</p>
                </div>
            </div>

            <TicketTable tickets={tickets} />
        </div>
    );
}

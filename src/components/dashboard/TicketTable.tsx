'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface Ticket {
    _id: string;
    customerName: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface TicketTableProps {
    tickets: Ticket[];
}

export default function TicketTable({ tickets }: TicketTableProps) {
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
            case 'REPLIED': return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
            case 'CLOSED': return 'bg-white/10 text-white/50 border-white/20';
            default: return 'bg-white/10 text-white/60';
        }
    };

    return (
        <div className="rounded-md border border-white/10 bg-transparent">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <TableRow key={ticket._id} className="border-white/5 hover:bg-white/[0.02] transition-colors text-white/70">
                                <TableCell className="font-medium text-off-white">
                                    <div className="flex flex-col">
                                        <span>{ticket.customerName}</span>
                                        <span className="text-xs text-white/40">{ticket.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{ticket.subject}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                        {ticket.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{format(new Date(ticket.updatedAt), 'MMM d, p')}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-white/10"
                                        onClick={() => router.push(`/dashboard/support/${ticket._id}`)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No tickets found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Invoice {
    _id: string;
    invoiceNo: string;
    bookingId: {
        bookingNo: string;
        customerName: string;
    };
    total: number;
    status: string;
    createdAt: string;
}

interface InvoiceTableProps {
    invoices: Invoice[];
}

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
    return (
        <div className="liquid-glass-panel rounded-xl overflow-hidden border border-white/10">
            <Table>
                <TableHeader className="bg-black/20">
                    <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/60 font-medium">Invoice No</TableHead>
                        <TableHead className="text-white/60 font-medium">Booking Ref</TableHead>
                        <TableHead className="text-white/60 font-medium">Amount</TableHead>
                        <TableHead className="text-white/60 font-medium">Date</TableHead>
                        <TableHead className="text-white/60 font-medium">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.length > 0 ? (
                        invoices.map((invoice) => (
                            <TableRow key={invoice._id} className="border-white/5 hover:bg-white/[0.02] transition-colors text-white/70">
                                <TableCell className="font-medium text-off-white font-mono">{invoice.invoiceNo}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{invoice.bookingId?.bookingNo || 'N/A'}</span>
                                        <span className="text-xs text-muted-foreground">{invoice.bookingId?.customerName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>LKR {(invoice.total ?? 0).toLocaleString()}</TableCell>
                                <TableCell>{format(new Date(invoice.createdAt), 'MMM d, yyyy')}</TableCell>
                                <TableCell>
                                    <Badge variant={invoice.status === 'FINAL' ? 'default' : 'secondary'}>
                                        {invoice.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="border-none hover:bg-transparent">
                            <TableCell colSpan={5} className="h-32 text-center text-white/40">
                                No invoices found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

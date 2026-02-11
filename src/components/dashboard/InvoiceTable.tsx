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
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice No</TableHead>
                        <TableHead>Booking Ref</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.length > 0 ? (
                        invoices.map((invoice) => (
                            <TableRow key={invoice._id}>
                                <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{invoice.bookingId?.bookingNo || 'N/A'}</span>
                                        <span className="text-xs text-muted-foreground">{invoice.bookingId?.customerName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>${invoice.total.toLocaleString()}</TableCell>
                                <TableCell>{format(new Date(invoice.createdAt), 'MMM d, yyyy')}</TableCell>
                                <TableCell>
                                    <Badge variant={invoice.status === 'FINAL' ? 'default' : 'secondary'}>
                                        {invoice.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No invoices found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

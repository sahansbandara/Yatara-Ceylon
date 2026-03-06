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

interface Payment {
    _id: string;
    bookingId: {
        bookingNo: string;
        customerName: string;
    };
    amount: number;
    method: string;
    type: string;
    paidAt?: string;
    provider?: string;
    status?: string;
}

interface PaymentTableProps {
    payments: Payment[];
}

export default function PaymentTable({ payments }: PaymentTableProps) {
    return (
        <div className="liquid-glass-panel rounded-xl overflow-hidden border border-white/10">
            <Table>
                <TableHeader className="bg-black/20">
                    <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/60 font-medium">Booking Ref</TableHead>
                        <TableHead className="text-white/60 font-medium">Type</TableHead>
                        <TableHead className="text-white/60 font-medium">Provider</TableHead>
                        <TableHead className="text-white/60 font-medium">Status</TableHead>
                        <TableHead className="text-white/60 font-medium text-right">Amount</TableHead>
                        <TableHead className="text-white/60 font-medium">Method</TableHead>
                        <TableHead className="text-white/60 font-medium">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.length > 0 ? (
                        payments.map((payment) => (
                            <TableRow key={payment._id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{payment.bookingId?.bookingNo || 'N/A'}</span>
                                        <span className="text-xs text-muted-foreground">{payment.bookingId?.customerName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={payment.type === 'REFUND' ? 'destructive' : 'outline'}>
                                        {payment.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{payment.provider || 'MANUAL'}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        payment.status === 'SUCCESS' ? 'default' :
                                            payment.status === 'FAILED' ? 'destructive' : 'outline'
                                    }>
                                        {payment.status || 'SUCCESS'}
                                    </Badge>
                                </TableCell>
                                <TableCell className={payment.type === 'REFUND' ? 'text-red-600' : 'text-green-600'}>
                                    {payment.type === 'REFUND' ? '-' : '+'}LKR {(payment.amount ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell>{payment.method || 'N/A'}</TableCell>
                                <TableCell>{payment.paidAt ? format(new Date(payment.paidAt), 'MMM d, yyyy') : 'N/A'}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No payments found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

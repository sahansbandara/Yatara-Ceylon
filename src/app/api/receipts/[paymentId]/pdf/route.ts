import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import { jsPDF } from 'jspdf';

// GET /api/receipts/[paymentId]/pdf – generate PDF receipt
export async function GET(_req: Request, { params }: { params: Promise<{ paymentId: string }> }) {
    try {
        await connectDB();
        const { paymentId } = await params;
        const payment = await Payment.findById(paymentId).lean();
        if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

        const paymentAny = payment as any;
        const booking = await Booking.findById(paymentAny.bookingId).lean();

        // Generate PDF
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(2, 132, 199); // ocean-600
        doc.text('Ceylon Escapes', 20, 25);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Tour Operator Management System', 20, 32);

        // Receipt title
        doc.setDrawColor(2, 132, 199);
        doc.setLineWidth(0.5);
        doc.line(20, 38, 190, 38);
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(paymentAny.type === 'REFUND' ? 'REFUND RECEIPT' : 'PAYMENT RECEIPT', 20, 50);

        // Details
        doc.setFontSize(11);
        let y = 65;
        const addLine = (label: string, value: string) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, 20, y);
            doc.setFont('helvetica', 'normal');
            doc.text(value, 80, y);
            y += 8;
        };

        addLine('Date:', new Date(paymentAny.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        if (booking) {
            const bookingAny = booking as any;
            addLine('Booking No:', bookingAny.bookingNo);
            addLine('Customer:', bookingAny.customerName);
            addLine('Phone:', bookingAny.phone);
        }
        addLine('Amount:', `$${paymentAny.amount.toFixed(2)}`);
        addLine('Method:', paymentAny.method);
        addLine('Type:', paymentAny.type);
        if (paymentAny.reference) addLine('Reference:', paymentAny.reference);
        if (paymentAny.notes) addLine('Notes:', paymentAny.notes);

        // Footer
        y += 15;
        doc.setDrawColor(200);
        doc.line(20, y, 190, y);
        y += 10;
        doc.setFontSize(9);
        doc.setTextColor(130);
        doc.text('This is a computer-generated receipt. No signature required.', 20, y);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, y + 6);
        doc.text('Ceylon Escapes | info@ceylonescapes.lk | +94 77 123 4567', 20, y + 12);

        const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="receipt-${paymentId}.pdf"`,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

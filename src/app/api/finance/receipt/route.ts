export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const bookingNo = searchParams.get('bookingNo');

    if (!bookingNo) {
        return NextResponse.json({ error: 'Booking number is required' }, { status: 400 });
    }

    try {
        await connectDB();
        const booking = await Booking.findOne({ bookingNo }).populate('packageId vehicleId customPlanId').lean() as any;

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Initialize jsPDF
        const doc = new jsPDF();

        // Luxury Aesthetics
        const emerald = '#043927';
        const gold = '#D4AF37';

        // Header
        doc.setFillColor(4, 57, 39); // Deep Emerald
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(212, 175, 55); // Antique Gold
        doc.setFont('times', 'bold');
        doc.setFontSize(24);
        doc.text('YATARA CEYLON', 105, 18, { align: 'center' });

        doc.setTextColor(255, 255, 255);
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.text('Uncompromising luxury and profound heritage.', 105, 26, { align: 'center' });
        doc.text('142 Sir James Peiris Mawatha, Colombo 02', 105, 32, { align: 'center' });

        // Receipt Title
        doc.setTextColor(4, 57, 39);
        doc.setFontSize(18);
        doc.text('OFFICIAL RECEIPT', 20, 60);

        // Booking Information
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 140, 60);
        doc.text(`Booking No: ${booking.bookingNo}`, 20, 75);
        doc.text(`Guest Name: ${booking.customerName}`, 20, 85);
        doc.text(`Travel Dates: ${new Date(booking.dates.from).toLocaleDateString()} to ${new Date(booking.dates.to).toLocaleDateString()}`, 20, 95);
        doc.text(`Guests: ${booking.pax} Pax`, 20, 105);

        // Financial Breakdown Table
        autoTable(doc, {
            startY: 120,
            head: [['Description', 'Amount (LKR)']],
            body: [
                ['Total Package Price', `LKR ${booking.totalCost?.toLocaleString() || '0'}`],
                ['Advance Paid (20%)', `LKR ${booking.paidAmount?.toLocaleString() || '0'}`],
                ['Remaining Balance', `LKR ${booking.remainingBalance?.toLocaleString() || '0'}`]
            ],
            theme: 'plain',
            headStyles: {
                fillColor: [212, 175, 55],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                font: 'times'
            },
            bodyStyles: {
                textColor: [4, 57, 39],
                font: 'helvetica'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });

        // Footer Statement
        const finalY = (doc as any).lastAutoTable.finalY || 160;
        doc.setFont('times', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('This receipt validates your Sovereign Access with Yatara Ceylon.', 105, finalY + 20, { align: 'center' });
        doc.text('For concierge assistance, contact +94 77 123 4567.', 105, finalY + 28, { align: 'center' });

        // Generate PDF Buffer
        const pdfBuffer = doc.output('arraybuffer');

        // Return as Downloadable PDF
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Yatara-Ceylon-Receipt-${booking.bookingNo}.pdf"`
            }
        });

    } catch (error) {
        console.error('Error generating receipt:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

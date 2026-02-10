export function generateWhatsAppLink(
    phone: string,
    data: {
        packageName?: string;
        dates?: { from: string; to: string };
        pax?: number;
        pickupLocation?: string;
        customerName?: string;
        customerPhone?: string;
        vehicleType?: string;
    }
): string {
    const businessPhone =
        phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    const lines: string[] = ['Hi Ceylon Escapes! I\'d like to inquire about:'];

    if (data.packageName) lines.push(`📦 Package: ${data.packageName}`);
    if (data.vehicleType) lines.push(`🚗 Vehicle: ${data.vehicleType}`);
    if (data.dates) lines.push(`📅 Dates: ${data.dates.from} - ${data.dates.to}`);
    if (data.pax) lines.push(`👥 Guests: ${data.pax} persons`);
    if (data.pickupLocation) lines.push(`📍 Pickup: ${data.pickupLocation}`);
    if (data.customerName) lines.push(`👤 Name: ${data.customerName}`);
    if (data.customerPhone) lines.push(`📞 Phone: ${data.customerPhone}`);

    lines.push('', 'Please let me know the details. Thank you! 🙏');

    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${businessPhone}?text=${text}`;
}

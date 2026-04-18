import Link from 'next/link';
import { formatLKR } from '@/lib/currency';
import { notFound } from 'next/navigation';
import { InvoiceDetailService } from '@/services/crud.service';
import { ArrowLeft, Receipt, Wallet } from 'lucide-react';
import BookingAttachmentsPanel from '@/components/dashboard/bookings/BookingAttachmentsPanel';

export default async function InvoiceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await InvoiceDetailService.getInvoiceDetail(id);

    if (!data) {
        notFound();
    }

    const { invoice, payments } = data;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard/finance" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 hover:text-antique-gold transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Finance
                    </Link>
                    <h1 className="mt-3 text-3xl font-display font-bold tracking-tight text-white">{invoice.invoiceNo}</h1>
                    <p className="mt-1 text-sm text-white/40">
                        Booking {(invoice.bookingId as any)?.bookingNo || '—'} · {(invoice.bookingId as any)?.customerName || '—'}
                    </p>
                </div>
                <span className={`status-pill ${invoice.status === 'FINAL' ? 'status-pill-success' : invoice.status === 'VOID' ? 'status-pill-danger' : 'status-pill-warning'}`}>
                    {invoice.status}
                </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="liquid-glass-stat-dark rounded-2xl p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Invoice Total</p>
                    <p className="mt-2 text-lg font-semibold text-white">{formatLKR(invoice.total || 0)}</p>
                </div>
                <div className="liquid-glass-stat-dark rounded-2xl p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Advance Required</p>
                    <p className="mt-2 text-lg font-semibold text-white">{formatLKR(invoice.advanceRequired || 0)}</p>
                </div>
                <div className="liquid-glass-stat-dark rounded-2xl p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Created</p>
                    <p className="mt-2 text-lg font-semibold text-white">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="liquid-glass-panel rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-antique-gold" />
                        <h2 className="text-lg font-display font-semibold">Invoice Items</h2>
                    </div>
                    <div className="mt-5 space-y-3">
                        {(invoice.items || []).map((item: any, index: number) => (
                            <div key={`${item.label}-${index}`} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                <div>
                                    <p className="text-sm text-white/85">{item.label}</p>
                                    <p className="text-xs text-white/35">Qty {item.qty} × {formatLKR(item.unitPrice || 0)}</p>
                                </div>
                                <p className="text-sm font-semibold text-antique-gold">{formatLKR(item.qty * item.unitPrice)}</p>
                            </div>
                        ))}
                    </div>
                    {invoice.notes ? (
                        <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/60">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Notes</p>
                            <p className="mt-2">{invoice.notes}</p>
                        </div>
                    ) : null}
                </div>

                <div className="liquid-glass-panel rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-antique-gold" />
                        <h2 className="text-lg font-display font-semibold">Related Payments</h2>
                    </div>
                    <div className="mt-5 space-y-3">
                        {payments.length > 0 ? payments.map((payment: any) => (
                            <div key={payment._id} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-white/85">{payment.orderId || payment.reference || 'Payment'}</p>
                                    <span className={`status-pill ${payment.status === 'SUCCESS' ? 'status-pill-success' : payment.status === 'VOIDED' ? 'status-pill-danger' : 'status-pill-warning'}`}>
                                        {payment.status}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm font-semibold text-antique-gold">{formatLKR(payment.amount || 0)}</p>
                                <p className="mt-1 text-xs text-white/35">{new Date(payment.createdAt).toLocaleString()}</p>
                            </div>
                        )) : (
                            <p className="text-sm text-white/40">No payments are linked to this invoice yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="liquid-glass-panel rounded-2xl p-6 text-white">
                <BookingAttachmentsPanel
                    bookingId={String((invoice.bookingId as any)?._id)}
                    invoiceId={String(invoice._id)}
                    invoiceOptions={[
                        {
                            _id: String(invoice._id),
                            invoiceNo: invoice.invoiceNo,
                            status: invoice.status,
                        },
                    ]}
                    canManage={true}
                />
            </div>
        </div>
    );
}

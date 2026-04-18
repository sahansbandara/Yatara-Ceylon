'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Loader2, Paperclip, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface InvoiceOption {
    _id: string;
    invoiceNo: string;
    status: string;
}

interface AttachmentRecord {
    _id: string;
    label: string;
    type: string;
    url: string;
    fileName?: string;
    notes?: string;
    createdAt: string;
    invoice?: {
        _id: string;
        invoiceNo: string;
        status: string;
    } | null;
    addedBy?: {
        _id: string;
        name: string;
        email: string;
    } | null;
}

interface BookingAttachmentsPanelProps {
    bookingId: string;
    invoiceId?: string;
    invoiceOptions?: InvoiceOption[];
    canManage?: boolean;
}

const ATTACHMENT_TYPE_LABELS: Record<string, string> = {
    INVOICE: 'Invoice',
    ID_COPY: 'ID Copy',
    PASSPORT: 'Passport',
    VOUCHER: 'Voucher',
    OTHER: 'Other',
};

export default function BookingAttachmentsPanel({
    bookingId,
    invoiceId,
    invoiceOptions = [],
    canManage = false,
}: BookingAttachmentsPanelProps) {
    const [attachments, setAttachments] = useState<AttachmentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        label: '',
        type: invoiceId ? 'INVOICE' : 'OTHER',
        url: '',
        invoiceId: invoiceId || 'none',
        notes: '',
    });

    const fetchAttachments = async () => {
        try {
            const response = await fetch(`/api/bookings/${bookingId}/attachments`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to load attachments');
            }

            const data = await response.json();
            setAttachments(data.attachments || []);
        } catch (error) {
            console.error(error);
            setAttachments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttachments();
    }, [bookingId]);

    const visibleAttachments = invoiceId
        ? attachments.filter((attachment) => attachment.invoice?._id === invoiceId)
        : attachments;

    const handleCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);

        try {
            const response = await fetch(`/api/bookings/${bookingId}/attachments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    label: formData.label,
                    type: formData.type,
                    url: formData.url,
                    invoiceId: formData.invoiceId !== 'none' ? formData.invoiceId : undefined,
                    notes: formData.notes || undefined,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to save attachment');
            }

            setAttachments((current) => [data.attachment, ...current]);
            setFormData({
                label: '',
                type: invoiceId ? 'INVOICE' : 'OTHER',
                url: '',
                invoiceId: invoiceId || 'none',
                notes: '',
            });
        } catch (error: any) {
            alert(error.message || 'Failed to save attachment');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (attachmentId: string) => {
        if (!window.confirm('Remove this attachment from the booking record?')) {
            return;
        }

        try {
            const response = await fetch(
                `/api/bookings/${bookingId}/attachments/${attachmentId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete attachment');
            }

            setAttachments((current) =>
                current.filter((attachment) => attachment._id !== attachmentId)
            );
        } catch (error: any) {
            alert(error.message || 'Failed to delete attachment');
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-antique-gold" />
                        <h3 className="text-sm font-display font-semibold text-deep-emerald uppercase tracking-wider">
                            {invoiceId ? 'Invoice Documents' : 'Protected Attachments'}
                        </h3>
                    </div>
                    <p className="mt-2 text-sm text-white/45">
                        Add secure cloud-drive or DMS links for invoices, IDs, and travel documents. No server-local uploads are used here.
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/45">
                    <ShieldCheck className="h-3.5 w-3.5 text-antique-gold" />
                    Staff / admin only
                </div>
            </div>

            {canManage ? (
                <form
                    onSubmit={handleCreate}
                    className="grid gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 md:grid-cols-2"
                >
                    <div className="grid gap-2">
                        <Label className="text-white/70">Label</Label>
                        <Input
                            required
                            value={formData.label}
                            onChange={(event) =>
                                setFormData((current) => ({ ...current, label: event.target.value }))
                            }
                            placeholder="Passport copy"
                            className="bg-white/[0.04] border-white/[0.08] text-white"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-white/70">Attachment Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) =>
                                setFormData((current) => ({ ...current, type: value }))
                            }
                        >
                            <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white h-11 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                {Object.entries(ATTACHMENT_TYPE_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <Label className="text-white/70">Document URL</Label>
                        <Input
                            required
                            type="url"
                            value={formData.url}
                            onChange={(event) =>
                                setFormData((current) => ({ ...current, url: event.target.value }))
                            }
                            placeholder="https://drive.google.com/..."
                            className="bg-white/[0.04] border-white/[0.08] text-white"
                        />
                    </div>

                    {invoiceOptions.length > 0 && !invoiceId ? (
                        <div className="grid gap-2">
                            <Label className="text-white/70">Linked Invoice</Label>
                            <Select
                                value={formData.invoiceId}
                                onValueChange={(value) =>
                                    setFormData((current) => ({ ...current, invoiceId: value }))
                                }
                            >
                                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white h-11 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                    <SelectItem value="none">Booking-level document</SelectItem>
                                    {invoiceOptions.map((option) => (
                                        <SelectItem key={option._id} value={option._id}>
                                            {option.invoiceNo} · {option.status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : null}

                    <div className="grid gap-2 md:col-span-2">
                        <Label className="text-white/70">Notes</Label>
                        <Textarea
                            value={formData.notes}
                            onChange={(event) =>
                                setFormData((current) => ({ ...current, notes: event.target.value }))
                            }
                            placeholder="Optional context for operators"
                            className="min-h-[90px] bg-white/[0.04] border-white/[0.08] text-white"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <Button
                            type="submit"
                            variant="glass-outline"
                            disabled={saving}
                            className="font-semibold text-antique-gold"
                        >
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save document link
                        </Button>
                    </div>
                </form>
            ) : null}

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-white/45">
                    <Loader2 className="h-4 w-4 animate-spin text-antique-gold" />
                    Loading attachments...
                </div>
            ) : visibleAttachments.length > 0 ? (
                <div className="space-y-3">
                    {visibleAttachments.map((attachment) => (
                        <div
                            key={attachment._id}
                            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                        >
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold text-white/85">
                                            {attachment.label}
                                        </p>
                                        <span className="status-pill status-pill-info">
                                            {ATTACHMENT_TYPE_LABELS[attachment.type] || attachment.type}
                                        </span>
                                        {attachment.invoice ? (
                                            <span className={`status-pill ${
                                                attachment.invoice.status === 'VOID'
                                                    ? 'status-pill-danger'
                                                    : attachment.invoice.status === 'FINAL'
                                                        ? 'status-pill-success'
                                                        : 'status-pill-warning'
                                            }`}>
                                                {attachment.invoice.invoiceNo}
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="mt-1 text-xs text-white/40">
                                        {attachment.fileName || 'document-link'} · added{' '}
                                        {new Date(attachment.createdAt).toLocaleString()}
                                        {attachment.addedBy?.name ? ` by ${attachment.addedBy.name}` : ''}
                                    </p>
                                    {attachment.notes ? (
                                        <p className="mt-2 text-sm text-white/55">{attachment.notes}</p>
                                    ) : null}
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white/70 transition-colors hover:text-antique-gold"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Open
                                    </a>
                                    {canManage ? (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(attachment._id)}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/5 text-red-300 transition-colors hover:bg-red-500/10"
                                            aria-label="Delete attachment"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-4 py-6 text-sm text-white/40">
                    No document links have been added yet.
                </div>
            )}
        </div>
    );
}

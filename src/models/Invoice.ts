import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInvoiceItem {
    label: string;
    qty: number;
    unitPrice: number;
}

export interface IInvoice extends Document {
    bookingId: Types.ObjectId;
    invoiceNo: string;
    items: IInvoiceItem[];
    subtotal: number;
    discount: number;
    total: number;
    advanceRequired?: number;
    status: 'DRAFT' | 'FINAL' | 'VOID';
    notes?: string;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
    {
        label: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
            index: true,
        },
        invoiceNo: { type: String, unique: true },
        items: [InvoiceItemSchema],
        subtotal: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 },
        advanceRequired: { type: Number, min: 0 },
        status: {
            type: String,
            enum: ['DRAFT', 'FINAL', 'VOID'],
            default: 'DRAFT',
        },
        notes: String,
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

InvoiceSchema.pre('save', async function (next) {
    if (!this.invoiceNo) {
        const count = await mongoose.models.Invoice.countDocuments();
        this.invoiceNo = `INV-${String(count + 1001).padStart(5, '0')}`;
    }
    next();
});

export default mongoose.models.Invoice ||
    mongoose.model<IInvoice>('Invoice', InvoiceSchema);

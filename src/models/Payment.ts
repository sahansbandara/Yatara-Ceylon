import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPayment extends Document {
    bookingId: Types.ObjectId;
    invoiceId?: Types.ObjectId;
    amount: number;
    provider: 'PAYHERE' | 'MANUAL';
    status: 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED' | 'CHARGEDBACK';
    orderId?: string;
    payherePaymentId?: string;
    md5sigVerified?: boolean;
    rawNotifyPayload?: any;
    method?: 'CASH' | 'BANK' | 'CARD_OTHER' | 'ONLINE';
    paidAt?: Date;
    reference?: string;
    type: 'PAYMENT' | 'REFUND';
    notes?: string;
    recordedBy?: Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
            index: true,
        },
        invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
        amount: { type: Number, required: true, min: 0 },
        provider: {
            type: String,
            enum: ['PAYHERE', 'MANUAL'],
            default: 'MANUAL',
        },
        status: {
            type: String,
            enum: ['INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'CANCELED', 'CHARGEDBACK'],
            default: 'SUCCESS', // Default for backward compatibility with existing manual payments
        },
        orderId: { type: String, unique: true, sparse: true },
        payherePaymentId: { type: String },
        md5sigVerified: { type: Boolean },
        rawNotifyPayload: { type: Schema.Types.Mixed },
        method: {
            type: String,
            enum: ['CASH', 'BANK', 'CARD_OTHER', 'ONLINE'],
            required: false, // Made optional for initiated payments
        },
        paidAt: { type: Date },
        reference: String,
        type: {
            type: String,
            enum: ['PAYMENT', 'REFUND'],
            default: 'PAYMENT',
        },
        notes: String,
        recordedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

PaymentSchema.index({ bookingId: 1, type: 1 });

export default mongoose.models.Payment ||
    mongoose.model<IPayment>('Payment', PaymentSchema);

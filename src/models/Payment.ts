import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPayment extends Document {
    bookingId: Types.ObjectId;
    invoiceId?: Types.ObjectId;
    amount: number;
    method: 'CASH' | 'BANK' | 'CARD_OTHER';
    paidAt: Date;
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
        method: {
            type: String,
            enum: ['CASH', 'BANK', 'CARD_OTHER'],
            required: true,
        },
        paidAt: { type: Date, required: true, default: Date.now },
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

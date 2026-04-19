import mongoose, { Schema, Document, Types } from 'mongoose';
import { RefundStatus, RefundMethod } from '@/lib/constants';

export interface IRefundRequest extends Document {
    bookingId: Types.ObjectId;
    customerId: Types.ObjectId;
    status: keyof typeof RefundStatus;
    requestedAmount: number;
    reason: string;
    refundMethod: keyof typeof RefundMethod;
    bankDetails?: {
        accountName?: string;
        accountNumber?: string;
        bankName?: string;
        branch?: string;
    };
    customerNotes?: string;
    staffRecommendation?: 'APPROVE' | 'REJECT' | 'PARTIAL';
    staffNotes?: string;
    adminNotes?: string;
    financePaymentId?: Types.ObjectId;
    proofUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const RefundRequestSchema = new Schema<IRefundRequest>(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
            index: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(RefundStatus),
            default: RefundStatus.SUBMITTED,
            index: true,
        },
        requestedAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        reason: {
            type: String,
            required: true,
        },
        refundMethod: {
            type: String,
            enum: Object.values(RefundMethod),
            required: true,
        },
        bankDetails: {
            accountName: String,
            accountNumber: String,
            bankName: String,
            branch: String,
        },
        customerNotes: String,
        staffRecommendation: {
            type: String,
            enum: ['APPROVE', 'REJECT', 'PARTIAL']
        },
        staffNotes: String,
        adminNotes: String,
        financePaymentId: {
            type: Schema.Types.ObjectId,
            ref: 'Payment'
        },
        proofUrl: String,
    },
    { timestamps: true }
);

export default mongoose.models.RefundRequest ||
    mongoose.model<IRefundRequest>('RefundRequest', RefundRequestSchema);

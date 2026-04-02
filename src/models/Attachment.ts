import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAttachment extends Document {
    bookingId: Types.ObjectId;
    invoiceId?: Types.ObjectId;
    label: string;
    type: 'INVOICE' | 'ID_COPY' | 'PASSPORT' | 'VOUCHER' | 'OTHER';
    url: string;
    fileName?: string;
    notes?: string;
    addedBy?: Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
            index: true,
        },
        invoiceId: {
            type: Schema.Types.ObjectId,
            ref: 'Invoice',
            index: true,
        },
        label: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['INVOICE', 'ID_COPY', 'PASSPORT', 'VOUCHER', 'OTHER'],
            default: 'OTHER',
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        fileName: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    { timestamps: true }
);

AttachmentSchema.index({ bookingId: 1, invoiceId: 1, createdAt: -1 });

export default mongoose.models.Attachment ||
    mongoose.model<IAttachment>('Attachment', AttachmentSchema);

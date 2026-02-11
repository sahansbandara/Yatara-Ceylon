import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
    title: string;
    body: string;
    type: 'OFFER' | 'UPDATE' | 'ALERT';
    visibleTo: 'CUSTOMERS' | 'STAFF' | 'ALL';
    isPublished: boolean;
    publishFrom?: Date;
    publishTo?: Date;
    createdBy: Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        title: { type: String, required: true, trim: true },
        body: { type: String, required: true },
        type: {
            type: String,
            enum: ['OFFER', 'UPDATE', 'ALERT'],
            default: 'UPDATE',
        },
        visibleTo: {
            type: String,
            enum: ['CUSTOMERS', 'STAFF', 'ALL'],
            default: 'ALL',
        },
        isPublished: { type: Boolean, default: false },
        publishFrom: Date,
        publishTo: Date,
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

NotificationSchema.index({ isPublished: 1, type: 1 });

export default mongoose.models.Notification ||
    mongoose.model<INotification>('Notification', NotificationSchema);

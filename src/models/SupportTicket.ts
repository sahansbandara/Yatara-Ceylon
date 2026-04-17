import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITicketReply {
    byUserId?: Types.ObjectId;
    byName: string;
    body: string;
    at: Date;
}

export interface ISupportTicket extends Document {
    customerName: string;
    phone?: string;
    email?: string;
    subject: string;
    message: string;
    bookingId?: Types.ObjectId;
    status: 'OPEN' | 'REPLIED' | 'CLOSED';
    replies: ITicketReply[];
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TicketReplySchema = new Schema<ITicketReply>(
    {
        byUserId: { type: Schema.Types.ObjectId, ref: 'User' },
        byName: { type: String, required: true },
        body: { type: String, required: true },
        at: { type: Date, default: Date.now },
    },
    { _id: true }
);

const SupportTicketSchema = new Schema<ISupportTicket>(
    {
        customerName: { type: String, required: true, trim: true },
        phone: String,
        email: { type: String, lowercase: true, trim: true },
        subject: { type: String, required: true, trim: true },
        message: { type: String, required: true },
        bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
        status: {
            type: String,
            enum: ['OPEN', 'REPLIED', 'CLOSED'],
            default: 'OPEN',
            index: true,
        },
        replies: [TicketReplySchema],
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.models.SupportTicket ||
    mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);

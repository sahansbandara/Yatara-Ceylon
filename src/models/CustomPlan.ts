import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPlanDay {
    dayNo: number;
    places: string[];
    notes?: string;
}

export interface ICustomPlan extends Document {
    title?: string;
    userId?: Types.ObjectId;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    days: IPlanDay[];
    districtsUsed: string[];
    totalDays: number;
    status: 'DRAFT' | 'SAVED' | 'SUBMITTED' | 'ARCHIVED';
    isProposalRequested?: boolean;
    linkedBookingId?: Types.ObjectId;
    submittedAt?: Date;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PlanDaySchema = new Schema<IPlanDay>(
    {
        dayNo: { type: Number, required: true },
        places: [{ type: String }],
        notes: String,
    },
    { _id: false }
);

const CustomPlanSchema = new Schema<ICustomPlan>(
    {
        title: { type: String, trim: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        customerName: { type: String, trim: true },
        customerPhone: { type: String, trim: true },
        customerEmail: { type: String, lowercase: true, trim: true },
        days: [PlanDaySchema],
        districtsUsed: [String],
        totalDays: { type: Number, default: 1 },
        status: {
            type: String,
            enum: ['DRAFT', 'SAVED', 'SUBMITTED', 'ARCHIVED'],
            default: 'DRAFT',
        },
        isProposalRequested: { type: Boolean, default: false },
        linkedBookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
        submittedAt: Date,
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

CustomPlanSchema.index({ customerEmail: 1, createdAt: -1 });

export default mongoose.models.CustomPlan ||
    mongoose.model<ICustomPlan>('CustomPlan', CustomPlanSchema);

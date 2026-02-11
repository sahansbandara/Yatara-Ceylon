import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPlanDay {
    dayNo: number;
    places: Types.ObjectId[];
    notes?: string;
}

export interface ICustomPlan extends Document {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    days: IPlanDay[];
    districtsUsed: string[];
    totalDays: number;
    status: 'DRAFT' | 'SAVED';
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PlanDaySchema = new Schema<IPlanDay>(
    {
        dayNo: { type: Number, required: true },
        places: [{ type: Schema.Types.ObjectId, ref: 'DistrictPlace' }],
        notes: String,
    },
    { _id: false }
);

const CustomPlanSchema = new Schema<ICustomPlan>(
    {
        customerName: { type: String, trim: true },
        customerPhone: { type: String, trim: true },
        customerEmail: { type: String, lowercase: true, trim: true },
        days: [PlanDaySchema],
        districtsUsed: [String],
        totalDays: { type: Number, default: 1 },
        status: {
            type: String,
            enum: ['DRAFT', 'SAVED'],
            default: 'DRAFT',
        },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.models.CustomPlan ||
    mongoose.model<ICustomPlan>('CustomPlan', CustomPlanSchema);

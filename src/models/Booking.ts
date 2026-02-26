import mongoose, { Schema, Document, Types } from 'mongoose';
import { BookingStatus, BookingTypes, VehicleBlockReasons } from '@/lib/constants';
import VehicleBlock from './VehicleBlock'; // Import VehicleBlock model

export interface IBooking extends Document {
    bookingNo: string;
    customerName: string;
    phone: string;
    email?: string;
    type: keyof typeof BookingTypes;
    packageId?: Types.ObjectId;
    vehicleId?: Types.ObjectId;
    customPlanId?: Types.ObjectId;
    pax: number;
    pickupLocation?: string;
    dates: { from: Date; to: Date };
    status: keyof typeof BookingStatus;
    assignedStaffId?: Types.ObjectId;
    assignedVehicleId?: Types.ObjectId;
    notes?: string;
    specialRequests?: string;
    totalCost: number;
    paidAmount: number;
    remainingBalance: number;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        bookingNo: { type: String },
        customerName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, lowercase: true, trim: true },
        type: {
            type: String,
            enum: Object.values(BookingTypes),
            required: true,
        },
        packageId: { type: Schema.Types.ObjectId, ref: 'Package' },
        vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
        customPlanId: { type: Schema.Types.ObjectId, ref: 'CustomPlan' },
        pax: { type: Number, required: true, min: 1 },
        pickupLocation: String,
        dates: {
            from: { type: Date, required: true },
            to: { type: Date, required: true },
        },
        status: {
            type: String,
            enum: Object.values(BookingStatus),
            default: BookingStatus.NEW,
            index: true,
        },
        assignedStaffId: { type: Schema.Types.ObjectId, ref: 'User' },
        assignedVehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
        notes: String,
        specialRequests: String,
        totalCost: { type: Number, default: 0 },
        paidAmount: { type: Number, default: 0 },
        remainingBalance: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

// Auto-generate booking number
BookingSchema.pre('save', async function (next) {
    if (!this.bookingNo) {
        const count = await mongoose.models.Booking.countDocuments();
        this.bookingNo = `YC-${String(count + 1001).padStart(5, '0')}`;
    }

    // Auto-calculate remaining balance
    if (this.isModified('totalCost') || this.isModified('paidAmount')) {
        this.remainingBalance = this.totalCost - this.paidAmount;
    }
    next();
});

// Auto-block vehicle on booking confirmation
BookingSchema.post('save', async function (doc) {
    // If booking status was just changed to CONFIRMED and a vehicle is assigned
    if (doc.status === BookingStatus.CONFIRMED && doc.assignedVehicleId) {
        try {
            // Check if block already exists for this booking
            const existingBlock = await mongoose.models.VehicleBlock.findOne({ bookingId: doc._id });

            if (!existingBlock) {
                await mongoose.models.VehicleBlock.create({
                    vehicleId: doc.assignedVehicleId,
                    from: doc.dates.from,
                    to: doc.dates.to,
                    reason: VehicleBlockReasons.BOOKING,
                    bookingId: doc._id
                });
            }
        } catch (error) {
            console.error("Error auto-blocking vehicle:", error);
        }
    }

    // Free up vehicle if booking is cancelled
    if (doc.status === BookingStatus.CANCELLED) {
        try {
            await mongoose.models.VehicleBlock.deleteMany({ bookingId: doc._id });
        } catch (error) {
            console.error("Error un-blocking vehicle:", error);
        }
    }
});

BookingSchema.index({ bookingNo: 1 }, { unique: true });
BookingSchema.index({ status: 1, 'dates.from': 1 });
BookingSchema.index({ phone: 1 });

export default mongoose.models.Booking ||
    mongoose.model<IBooking>('Booking', BookingSchema);

import mongoose, { Schema, Document } from 'mongoose';
import { UserRoles, UserStatus } from '@/lib/constants';

export interface IUser extends Document {
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
    role: keyof typeof UserRoles;
    status: keyof typeof UserStatus;
    lastLogin?: Date;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        phone: { type: String, trim: true },
        passwordHash: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: Object.values(UserRoles),
            default: UserRoles.STAFF,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(UserStatus),
            default: UserStatus.ACTIVE,
            index: true,
        },
        lastLogin: Date,
        isDeleted: { type: Boolean, default: false },
        deletedAt: Date,
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User ||
    mongoose.model<IUser>('User', UserSchema);

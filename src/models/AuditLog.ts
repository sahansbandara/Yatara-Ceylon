import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    actorUserId?: string;
    action: string;
    entity: string;
    entityId?: string;
    meta?: Record<string, unknown>;
    ip?: string;
    at: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
    actorUserId: String,
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: String,
    meta: Schema.Types.Mixed,
    ip: String,
    at: { type: Date, default: Date.now },
});

// TTL index: auto-delete logs after 1 year
AuditLogSchema.index({ at: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export default mongoose.models.AuditLog ||
    mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

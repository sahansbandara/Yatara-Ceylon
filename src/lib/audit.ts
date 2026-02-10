import connectDB from './mongodb';
import AuditLog from '@/models/AuditLog';

interface AuditEntry {
    actorUserId?: string;
    action: string;
    entity: string;
    entityId?: string;
    meta?: Record<string, unknown>;
    ip?: string;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
    try {
        await connectDB();
        await AuditLog.create({
            ...entry,
            at: new Date(),
        });
    } catch (error) {
        console.error('Audit log failed:', error);
    }
}

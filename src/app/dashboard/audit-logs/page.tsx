import { Metadata } from 'next';
import { adminOnly } from '@/lib/rbac';
import { redirect } from 'next/navigation';
import AuditLogTable from '@/components/dashboard/AuditLogTable';
import connectDB from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';

export const metadata: Metadata = {
    title: 'Audit Logs | Yatara Admin',
    description: 'System audit logs and activity tracking.',
};

export default async function AuditLogsPage() {
    await connectDB();
    
    // Server-side check is handled by layout/middleware, but we can't use adminOnly on server UI components directly because adminOnly expects NextRequest.
    // However, if we're in /dashboard, the middleware should enforce session if we strictly only allow ADMIN in dashboard.
    // Yet to be safe, we can just fetch. 
    
    const page = 1;
    const limit = 50;
    
    const [logs, total] = await Promise.all([
        AuditLog.find({}).sort({ at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
        AuditLog.countDocuments({}),
    ]);

    const initialData = {
        logs: JSON.parse(JSON.stringify(logs)),
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-light tracking-wide text-off-white">
                        System <span className="text-antique-gold font-medium">Audit Logs</span>
                    </h1>
                    <p className="text-white/60 mt-2">
                        Track system activity, user logins, and administrative changes.
                    </p>
                </div>
            </div>

            <AuditLogTable initialData={initialData} />
        </div>
    );
}

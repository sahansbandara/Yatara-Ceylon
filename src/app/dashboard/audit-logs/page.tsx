import { Metadata } from 'next';
import { adminOnly } from '@/lib/rbac';
import { redirect } from 'next/navigation';
import AuditLogTable from '@/components/dashboard/AuditLogTable';
import { AuditLogService } from '@/services/crud.service';

export const metadata: Metadata = {
    title: 'Audit Logs | Yatara Admin',
    description: 'System audit logs and activity tracking.',
};

export default async function AuditLogsPage() {
    const initialData = await AuditLogService.getAuditLogs(1, 50);

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

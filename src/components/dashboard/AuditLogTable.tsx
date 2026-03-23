'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { Eye, ChevronLeft, ChevronRight, Activity, CalendarDays } from 'lucide-react';
import { IAuditLog } from '@/models/AuditLog';

interface AuditLogResponse {
    logs: IAuditLog[];
    total: number;
    page: number;
    totalPages: number;
}

interface AuditLogTableProps {
    initialData: AuditLogResponse;
}

export default function AuditLogTable({ initialData }: AuditLogTableProps) {
    const [data, setData] = useState<AuditLogResponse>(initialData);
    const [loading, setLoading] = useState(false);

    const fetchPage = async (page: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/audit-logs?page=${page}&limit=50`);
            if (res.ok) {
                const newData = await res.json();
                setData(newData);
            }
        } catch (error) {
            console.error('Failed to fetch audit logs', error);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action: string) => {
        if (action.includes('CREATE') || action.includes('REGISTER')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        if (action.includes('UPDATE') || action.includes('EDIT')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        if (action.includes('DELETE') || action.includes('REMOVE')) return 'bg-red-500/10 text-red-400 border-red-500/20';
        if (action.includes('LOGIN') || action.includes('LOGOUT')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        return 'bg-white/10 text-white/70 border-white/20';
    };

    return (
        <div className="space-y-4">
            <div className="liquid-glass-panel rounded-xl overflow-hidden border border-white/10">
                <Table>
                    <TableHeader className="bg-black/20">
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="text-white/60 font-medium">Time</TableHead>
                            <TableHead className="text-white/60 font-medium">Action</TableHead>
                            <TableHead className="text-white/60 font-medium">Entity</TableHead>
                            <TableHead className="text-white/60 font-medium">Entity ID</TableHead>
                            <TableHead className="text-white/60 font-medium">Actor User ID</TableHead>
                            <TableHead className="text-white/60 font-medium">IP Address</TableHead>
                            <TableHead className="text-white/60 font-medium text-right">Meta</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.logs.length > 0 ? (
                            data.logs.map((log) => (
                                <TableRow key={log._id as unknown as string} className="border-white/5 hover:bg-white/[0.02] transition-colors relative">
                                    <TableCell className="text-white/70 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-3.5 w-3.5 text-antique-gold/70" />
                                            {format(new Date(log.at), 'MMM d, yyyy HH:mm:ss')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`font-mono text-xs ${getActionColor(log.action)}`}>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-off-white font-medium">
                                        {log.entity}
                                    </TableCell>
                                    <TableCell className="text-white/50 font-mono text-xs truncate max-w-[120px]">
                                        {log.entityId || '-'}
                                    </TableCell>
                                    <TableCell className="text-white/50 font-mono text-xs truncate max-w-[120px]">
                                        {log.actorUserId || 'System'}
                                    </TableCell>
                                    <TableCell className="text-white/50 text-xs font-mono">
                                        {log.ip || '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {log.meta && Object.keys(log.meta).length > 0 ? (
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-antique-gold hover:text-antique-gold/80 hover:bg-antique-gold/10">
                                                        <Activity className="h-4 w-4" />
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent className="bg-[#020b08] border-l border-antique-gold/10 text-off-white w-[400px] sm:w-[540px] overflow-y-auto">
                                                    <SheetHeader className="mb-6">
                                                        <SheetTitle className="text-xl font-light tracking-wide text-antique-gold flex items-center gap-2">
                                                            <Activity className="h-5 w-5" />
                                                            Log Metadata
                                                        </SheetTitle>
                                                    </SheetHeader>
                                                    <div className="space-y-6">
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-white/40 mb-1 text-xs uppercase tracking-wider">Action</p>
                                                                <p className="text-off-white font-mono">{log.action}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-white/40 mb-1 text-xs uppercase tracking-wider">Entity</p>
                                                                <p className="text-off-white">{log.entity}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-white/40 mb-1 text-xs uppercase tracking-wider">Entity ID</p>
                                                                <p className="text-off-white font-mono">{log.entityId || '-'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-white/40 mb-1 text-xs uppercase tracking-wider">Time</p>
                                                                <p className="text-off-white">{format(new Date(log.at), 'MMM d, yyyy HH:mm:ss')}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-white/40 mb-1 text-xs uppercase tracking-wider">Actor ID</p>
                                                                <p className="text-off-white font-mono">{log.actorUserId || 'System'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-white/40 mb-1 text-xs uppercase tracking-wider">IP Address</p>
                                                                <p className="text-off-white font-mono">{log.ip || '-'}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <p className="text-white/40 mb-2 text-xs uppercase tracking-wider">Payload Data</p>
                                                            <div className="bg-black/40 border border-white/5 rounded-lg p-4 font-mono text-xs overflow-x-auto text-emerald-400">
                                                                <pre>{JSON.stringify(log.meta, null, 2)}</pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SheetContent>
                                            </Sheet>
                                        ) : (
                                            <div className="h-8 w-8 inline-flex items-center justify-center text-white/20">
                                                -
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="border-none hover:bg-transparent">
                                <TableCell colSpan={7} className="h-32 text-center text-white/40">
                                    No audit logs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {data.totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-white/50">
                        Showing page <span className="text-white">{data.page}</span> of <span className="text-white">{data.totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 liquid-glass border-white/10 text-off-white hover:text-antique-gold disabled:opacity-50"
                            disabled={data.page === 1 || loading}
                            onClick={() => fetchPage(data.page - 1)}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 liquid-glass border-white/10 text-off-white hover:text-antique-gold disabled:opacity-50"
                            disabled={data.page === data.totalPages || loading}
                            onClick={() => fetchPage(data.page + 1)}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

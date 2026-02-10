'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileText, RefreshCcw, TrendingUp } from 'lucide-react';

interface FinanceStatsProps {
    revenue: number;
    pendingInvoices: number;
    totalRefunds: number;
}

export default function FinanceStats({ revenue, pendingInvoices, totalRefunds }: FinanceStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Lifetme earnings</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Draft Invoices</CardTitle>
                    <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingInvoices}</div>
                    <p className="text-xs text-muted-foreground">Invoices pending finalization</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
                    <RefreshCcw className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalRefunds.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Processed refunds</p>
                </CardContent>
            </Card>
        </div>
    );
}

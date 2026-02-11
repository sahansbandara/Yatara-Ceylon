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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PartnerStatus } from '@/lib/constants';

interface Partner {
    _id: string;
    type: string;
    name: string;
    contactPerson?: string;
    phone: string;
    email?: string;
    status: string;
}

interface PartnerTableProps {
    initialPartners: Partner[];
}

export default function PartnerTable({ initialPartners }: PartnerTableProps) {
    const [partners, setPartners] = useState<Partner[]>(initialPartners);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this partner?')) return;
        try {
            const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPartners(partners.filter((p) => p._id !== id));
                router.refresh();
            } else {
                alert('Failed to delete partner');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting partner');
        }
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            GUIDE: 'bg-purple-100 text-purple-800',
            HOTEL: 'bg-blue-100 text-blue-800',
            DRIVER: 'bg-green-100 text-green-800',
            RESTAURANT: 'bg-orange-100 text-orange-800',
            OTHER: 'bg-gray-100 text-gray-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {partners.length > 0 ? (
                        partners.map((partner) => (
                            <TableRow key={partner._id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{partner.name}</span>
                                        {partner.email && (
                                            <span className="text-xs text-muted-foreground">{partner.email}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={getTypeColor(partner.type)}>
                                        {partner.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{partner.contactPerson || '-'}</TableCell>
                                <TableCell>{partner.phone}</TableCell>
                                <TableCell>
                                    <Badge variant={partner.status === PartnerStatus.ACTIVE ? 'default' : 'secondary'}>
                                        {partner.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-blue-600"
                                            onClick={() => router.push(`/dashboard/partners/${partner._id}`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-red-600"
                                            onClick={() => handleDelete(partner._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No partners found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

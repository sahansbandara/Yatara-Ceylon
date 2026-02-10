'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { UserRoles, UserStatus } from '@/lib/constants';

interface UserFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function UserForm({ initialData, isEdit = false }: UserFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        password: '',
        role: initialData?.role || UserRoles.STAFF,
        status: initialData?.status || UserStatus.ACTIVE,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEdit ? `/api/users/${initialData._id}` : '/api/users';
            const method = isEdit ? 'PUT' : 'POST';

            const payload: any = { ...formData };
            if (isEdit && !payload.password) {
                delete payload.password; // Don't send empty password on edit
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/dashboard/users');
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm max-w-2xl">
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        disabled={isEdit} // Prevent email change for simplicity/security mostly
                    />
                    {isEdit && <p className="text-xs text-muted-foreground">Email cannot be changed.</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone (Optional)</label>
                    <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+94 77 123 4567"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select
                        value={formData.role}
                        onValueChange={(val) => setFormData({ ...formData, role: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(UserRoles).map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isEdit && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => setFormData({ ...formData, status: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(UserStatus).map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        {isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
                    </label>
                    <Input
                        type="password"
                        required={!isEdit}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={isEdit ? '••••••••' : 'Enter secure password'}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-ocean-600 hover:bg-ocean-700">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isEdit ? 'Update User' : 'Create User'}
                </Button>
            </div>
        </form>
    );
}

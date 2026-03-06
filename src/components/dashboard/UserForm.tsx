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
        <form onSubmit={handleSubmit} className="space-y-6 liquid-glass-stat-dark p-8 rounded-2xl border border-white/[0.08] shadow-2xl max-w-2xl text-white">
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Full Name</label>
                    <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Email Address</label>
                    <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        disabled={isEdit}
                        className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl disabled:opacity-50"
                    />
                    {isEdit && <p className="text-[10px] text-white/30 uppercase tracking-widest">Email cannot be changed.</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Phone (Optional)</label>
                    <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+94 77 123 4567"
                        className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Role</label>
                    <Select
                        value={formData.role}
                        onValueChange={(val) => setFormData({ ...formData, role: val })}
                    >
                        <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                            {Object.values(UserRoles).map((role) => (
                                <SelectItem key={role} value={role} className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isEdit && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Status</label>
                        <Select
                            value={formData.status}
                            onValueChange={(val) => setFormData({ ...formData, status: val })}
                        >
                            <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus:ring-antique-gold/20 h-11 rounded-xl">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#020b08] border-white/[0.08] text-white">
                                {Object.values(UserStatus).map((status) => (
                                    <SelectItem key={status} value={status} className="focus:bg-white/[0.06] focus:text-antique-gold cursor-pointer">
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">
                        {isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
                    </label>
                    <Input
                        type="password"
                        required={!isEdit}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={isEdit ? '••••••••' : 'Enter secure password'}
                        className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 h-11 rounded-xl"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.06] mt-8">
                <Button type="button" variant="outline" onClick={() => router.back()} className="border-antique-gold/40 text-antique-gold hover:bg-antique-gold/10 rounded-xl h-10 px-6 transition-all">
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-antique-gold hover:bg-antique-gold/90 text-[#020b08] shadow-[0_0_20px_rgba(212,175,55,0.2)] rounded-xl h-10 px-6 font-semibold">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#020b08]/60" /> : null}
                    {isEdit ? 'Update User' : 'Create User'}
                </Button>
            </div>
        </form>
    );
}

'use client';

import { useState, useRef } from 'react';
import { UserCircle, Mail, Phone, Shield, Camera, Loader2, Save } from "lucide-react";
import Image from "next/image";

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrator',
    STAFF: 'Concierge Staff',
    VEHICLE_OWNER: 'Fleet Partner',
    HOTEL_OWNER: 'Hotel Partner',
    USER: 'Customer',
};

export default function ProfileClient({ initialUser }: { initialUser: any }) {
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(initialUser.name);
    const [phone, setPhone] = useState(initialUser.phone || '');
    const [avatar, setAvatar] = useState(initialUser.avatar || '');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
                setIsEditing(true); // force save mode
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, avatar }),
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setIsEditing(false);
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-off-white">Profile</h1>
                    <p className="text-sm text-white/40 font-light mt-1">Your account details</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold tracking-wider uppercase text-antique-gold transition-all"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setName(user.name);
                                setPhone(user.phone || '');
                                setAvatar(user.avatar || '');
                            }}
                            className="px-4 py-2 bg-transparent hover:bg-white/5 border border-transparent rounded-xl text-xs font-semibold tracking-wider uppercase text-white/50 hover:text-white/80 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-antique-gold hover:bg-antique-gold/90 text-[#0a1f15] rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="liquid-glass-panel rounded-2xl p-8 text-white relative">
                {/* Header Section */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-antique-gold/10 border border-antique-gold/30 flex items-center justify-center overflow-hidden shadow-inner">
                            {avatar ? (
                                <Image src={avatar} alt={name} fill className="object-cover" />
                            ) : (
                                <UserCircle className="h-10 w-10 text-antique-gold" />
                            )}
                        </div>
                        {isEditing && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-deep-emerald border border-antique-gold/30 text-antique-gold flex items-center justify-center hover:scale-105 hover:bg-[#0a1f15] transition-all shadow-lg"
                            >
                                <Camera className="h-4 w-4" />
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-white/5 border border-antique-gold/30 rounded-lg px-3 py-1.5 text-xl font-display font-bold text-white focus:outline-none focus:ring-1 focus:ring-antique-gold/50 transition-all w-full max-w-[250px] mb-2"
                            />
                        ) : (
                            <h2 className="text-xl font-display font-bold text-off-white mb-2">{user.name}</h2>
                        )}
                        <span className="text-[10px] px-3 py-1 rounded-full bg-antique-gold/10 border border-antique-gold/20 text-antique-gold font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(212,175,55,0.05)]">
                            {ROLE_LABELS[user.role] || user.role}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <Mail className="h-5 w-5 text-white/20" />
                        <div className="flex-1">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-0.5">Email Address</p>
                            <p className="text-sm text-off-white">{user.email}</p>
                            <p className="text-[9px] text-white/30 mt-1 italic">Email cannot be changed.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <Phone className="h-5 w-5 text-white/20" />
                        <div className="flex-1">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-0.5">Contact Number</p>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={phone}
                                    placeholder="Add phone number"
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="bg-black/20 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-antique-gold/50 transition-all w-full max-w-[200px]"
                                />
                            ) : (
                                <p className="text-sm text-off-white">{user.phone || <span className="text-white/30 italic">Not provided</span>}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <Shield className="h-5 w-5 text-white/20" />
                        <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-0.5">Account Status</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'}`} />
                                <p className="text-sm text-off-white capitalize tracking-wide">{user.status.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {user.role === 'USER' && (
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-antique-gold/10 to-transparent border border-antique-gold/20 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="text-antique-gold font-bold text-lg mb-1">Become a Yatara Partner</h4>
                            <p className="text-white/60 text-xs max-w-md">Do you own a luxury vehicle or a premium hotel? Join our elite network to offer your services to our discerning clientele.</p>
                        </div>
                        <a
                            href="/dashboard/partner-application"
                            className="shrink-0 px-6 py-3 rounded-full bg-antique-gold hover:bg-antique-gold/90 text-black text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] whitespace-nowrap"
                        >
                            Apply Now
                        </a>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-white/[0.05] flex justify-between items-center">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

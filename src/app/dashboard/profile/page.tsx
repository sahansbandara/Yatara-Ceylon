import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { UserCircle, Mail, Phone, Shield } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrator',
    STAFF: 'Concierge Staff',
    VEHICLE_OWNER: 'Fleet Partner',
    HOTEL_OWNER: 'Hotel Partner',
    USER: 'Customer',
};

async function getUserProfile(userId: string) {
    try {
        await connectDB();
        const user = await User.findById(userId).select('-passwordHash').lean();
        return user ? JSON.parse(JSON.stringify(user)) : null;
    } catch {
        return null;
    }
}

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('toms_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const user = payload ? await getUserProfile(payload.userId) : null;

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <p className="text-gray-500">Unable to load profile.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-deep-emerald">Profile</h1>
                <p className="text-sm text-gray-500 font-light mt-1">Your account details</p>
            </div>

            <div className="liquid-glass-stat rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-antique-gold/10 border border-antique-gold/20 flex items-center justify-center">
                        <UserCircle className="h-8 w-8 text-antique-gold" />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-deep-emerald">{user.name}</h2>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-antique-gold/10 text-antique-gold font-medium">
                            {ROLE_LABELS[user.role] || user.role}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 border border-gray-100">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Email</p>
                            <p className="text-sm text-deep-emerald">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 border border-gray-100">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Phone</p>
                            <p className="text-sm text-deep-emerald">{user.phone || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 border border-gray-100">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Account Status</p>
                            <p className="text-sm text-deep-emerald">{user.status}</p>
                        </div>
                    </div>
                </div>

                <p className="text-[10px] text-gray-400 mt-6">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}

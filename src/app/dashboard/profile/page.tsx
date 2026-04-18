import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import ProfileClient from "@/components/dashboard/ProfileClient";

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
                <p className="text-white/40">Unable to load profile.</p>
            </div>
        );
    }

    return (
        <ProfileClient initialUser={user} />
    );
}

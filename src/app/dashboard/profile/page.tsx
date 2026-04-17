import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ProfileService } from '@/services/crud.service';
import ProfileClient from "@/components/dashboard/ProfileClient";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('toms_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const user = payload ? await ProfileService.getUserProfile(payload.userId) : null;

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

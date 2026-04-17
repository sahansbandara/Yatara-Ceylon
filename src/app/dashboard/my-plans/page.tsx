import { MyPlansService } from '@/services/crud.service';
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import MyPlansClient from "@/components/dashboard/MyPlansClient";

export default async function MyPlansPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('toms_token')?.value;
    const payload = token ? await verifyToken(token) : null;
    const userId = payload?.userId || '';
    const email = payload?.email;

    const plans = await MyPlansService.getCustomerPlans(userId, email);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-sm">My Plans</h1>
                <p className="text-sm text-white/40 font-light mt-1">Custom tour plans you&apos;ve saved</p>
            </div>

            <MyPlansClient initialPlans={plans} />
        </div>
    );
}

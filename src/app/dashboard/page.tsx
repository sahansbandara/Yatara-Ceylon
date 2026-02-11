import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Package from "@/models/Package";
import User from "@/models/User";
import { Users, Package as PackageIcon, CalendarCheck, DollarSign } from "lucide-react";

async function getDashboardStats() {
    try {
        await connectDB();
        const [totalBookings, activePackages, totalUsers, revenue] = await Promise.all([
            Booking.countDocuments({}),
            Package.countDocuments({ isPublished: true, isDeleted: false }),
            User.countDocuments({}),
            Booking.aggregate([
                { $match: { status: 'COMPLETED' } }, // Only count completed bookings for revenue
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ])
        ]);

        return {
            totalBookings,
            activePackages,
            totalUsers,
            totalRevenue: revenue[0]?.total || 0
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return {
            totalBookings: 0,
            activePackages: 0,
            totalUsers: 0,
            totalRevenue: 0
        };
    }
}

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="flex flex-col gap-6 p-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBookings}</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
                        <PackageIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activePackages}</div>
                        <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">+201 since last hour</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity or Charts could go here */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Recent bookings list placeholder.</p>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Audit log placeholder.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

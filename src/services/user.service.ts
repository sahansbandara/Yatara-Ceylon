import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const UserService = {
    async getDashboardUsers() {
        try {
            await connectDB();
            const users = await User.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
            return JSON.parse(JSON.stringify(users));
        } catch (error) {
            console.error("[UserService] Failed to fetch dashboard users:", error);
            return [];
        }
    },
    async getUserById(id: string) {
        try {
            await connectDB();
            const user = await User.findById(id).lean();
            return user ? JSON.parse(JSON.stringify(user)) : null;
        } catch (error) {
            console.error("[UserService] Failed to fetch user by ID:", error);
            return null;
        }
    }
};

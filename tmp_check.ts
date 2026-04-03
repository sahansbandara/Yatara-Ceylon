import 'dotenv/config';
import connectDB from './src/lib/mongodb';
import User from './src/models/User';
import Booking from './src/models/Booking';

async function run() {
    await connectDB();
    const user = await User.findOne({ email: 'sahanidiot@gmail.com' });
    const user2 = await User.findOne({ email: 'sahansofficialmail@gmail.com' });
    const user3 = await User.findOne({ email: 'itsmesahansbadara@gmail.com' });

    // Update ALL existing bookings by sahan to contain one of his user IDs, let's use user2 just in case
    const targetUser = user2 || user || user3;
    if (!targetUser) {
        console.log('No sahan user found');
        process.exit(1);
    }

    const res = await Booking.updateMany(
        { email: 'sahansbandara.mail@gmail.com' },
        { $set: { customerId: targetUser._id } }
    );

    console.log(`Updated ${res.modifiedCount} bookings to customerId: ${targetUser._id}`);
    process.exit(0);
}
run();

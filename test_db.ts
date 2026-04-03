import connectDB from './src/lib/mongodb';
import Package from './src/models/Package';

async function test() {
    await connectDB();
    const all = await Package.countDocuments({});
    const notDeleted = await Package.countDocuments({ isDeleted: { $ne: true } });
    const publishedNotDeleted = await Package.countDocuments({ isPublished: true, isDeleted: { $ne: true } });
    
    const journey = await Package.countDocuments({
        isPublished: true,
        isDeleted: { $ne: true },
        type: { $ne: 'transfer' },
        $or: [{ type: 'journey' }, { type: { $exists: false } }],
    });
    
    console.log('All:', all);
    console.log('Not deleted:', notDeleted);
    console.log('Published & Not deleted:', publishedNotDeleted);
    console.log('Journey matched:', journey);
    
    // Also get the raw items that match public journey but NOT dashboard published
    const journeyDocs = await Package.find({
        isPublished: true,
        isDeleted: { $ne: true },
        type: { $ne: 'transfer' },
        $or: [{ type: 'journey' }, { type: { $exists: false } }],
    }).select('_id title isPublished isDeleted type priceMin priceMax').lean();
    
    console.log('Journey docs:', journeyDocs.length);
    
    process.exit(0);
}
test();

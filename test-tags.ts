import connectDB from './src/lib/mongodb';
import Package from './src/models/Package';
import mongoose from 'mongoose';

async function run() {
    try {
        await connectDB();
        const packages = await Package.find({ status: 'published' }).lean();
        
        const stylesCount: Record<string, number> = {};
        const tagsCount: Record<string, number> = {};

        packages.forEach(p => {
            if (p.style) {
                const s = p.style.toLowerCase();
                stylesCount[s] = (stylesCount[s] || 0) + 1;
            }
            if (p.tags && Array.isArray(p.tags)) {
                p.tags.forEach(t => {
                    const l = t.toLowerCase();
                    tagsCount[l] = (tagsCount[l] || 0) + 1;
                });
            }
        });

        const STYLE_CHIPS = ['luxury', 'wellness', 'adventure', 'cultural', 'wildlife', 'heritage', 'experiences', 'family', 'beach', 'marine'];
        
        console.log("=== Packages DB Analysis ===");
        console.log(`Total Published Packages: ${packages.length}`);
        
        console.log("\n1. How many packages per STYLE_CHIP?");
        STYLE_CHIPS.forEach(chip => {
            let count = 0;
            packages.forEach(p => {
                const hasStyle = p.style && p.style.toLowerCase() === chip;
                const hasTag = p.tags && p.tags.some((t: string) => t.toLowerCase() === chip);
                if (hasStyle || hasTag) count++;
            });
            console.log(`- ${chip}: ${count} packages`);
        });

        console.log("\n2. All actual 'styles' found in DB:");
        console.log(stylesCount);

        console.log("\n3. All actual 'tags' found in DB:");
        console.log(tagsCount);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();

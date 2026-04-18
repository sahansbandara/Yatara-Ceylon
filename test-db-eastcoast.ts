import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const schema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.models.Package || mongoose.model('Package', schema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const pkg = await Package.findOne({ slug: 'east-coast-surf-and-sun' }).lean();
  console.log(JSON.stringify(pkg, null, 2));
  process.exit(0);
}
run().catch(err => {
  console.error(err);
  process.exit(1);
});

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const PackageSchema = new mongoose.Schema({ title: String, durationDays: Number }, { strict: false });
const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const p = await Package.findById('69a85d9da98e135d5cadadd0');
  console.log(p ? p.title : 'Not found');
  console.log(p ? p.durationDays : 'Not found');
  process.exit(0);
}
check();

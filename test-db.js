const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const packages = await mongoose.connection.collection('packages').find({}, { projection: { title: 1, slug: 1, images: 1 } }).toArray();
  console.log(JSON.stringify(packages, null, 2));
  process.exit(0);
}
run();

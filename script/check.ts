require('dotenv').config({ path: '.env.local' });
import mongoose from 'mongoose';
async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const paymentSchema = new mongoose.Schema({}, { strict: false });
  const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
  const res = await Payment.findOne({ orderId: 'CE-2DFC3313-1776504260256' });
  console.log("PAYMENT IS:", res);
  process.exit(0);
}
run();

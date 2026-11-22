import { connectDB } from '../config/db';
import { Appointment } from '../models/Appointment';
import mongoose from 'mongoose';

async function checkIndexes() {
  await connectDB();
  const indexes = await Appointment.collection.indexes();
  console.log('Current Appointment Indexes:', JSON.stringify(indexes, null, 2));
  await mongoose.disconnect();
}
checkIndexes();

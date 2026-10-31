import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  worker_name: { type: String, required: true },
  permit_status: { type: String, required: true },
  start_date: { type: String, required: true },
  expiry_date: { type: String, required: true },
  beneficiary_name: { type: String, required: true },
  beneficiary_no: { type: String, required: true },
  recruitment_company: { type: String, required: true },
  recruitment_no: { type: String, required: true },
  status: { type: String, enum: ['active', 'hidden'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('Worker', workerSchema);
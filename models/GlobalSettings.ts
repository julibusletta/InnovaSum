import mongoose, { Schema } from 'mongoose';

const GlobalSettingsSchema = new Schema({
  exchangeRate: { type: Number, default: 1500 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure we only have one document
export default mongoose.models.GlobalSettings || mongoose.model('GlobalSettings', GlobalSettingsSchema);

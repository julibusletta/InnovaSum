import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  isMain: { type: Boolean, default: false },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  markupFixed: { type: String }, // e.g. "+$10,000 ARS" or "+$30 USD"
  markupPercent: { type: Number }, // e.g. 30
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);

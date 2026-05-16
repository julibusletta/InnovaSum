import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  isActive: boolean;
  expiresAt?: Date;
  maxUses?: number;
  currentUses: number;
}

const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true },
  type: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'PERCENTAGE' },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
  maxUses: { type: Number },
  currentUses: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

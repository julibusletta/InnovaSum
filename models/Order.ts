import mongoose, { Schema } from 'mongoose';

const OrderItemSchema = new Schema({
  productId: { type: String }, // Added to easily track stock
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  userPhone: String,
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'SHIPPED', 'CANCELLED', 'PENDING_REVIEW'],
    default: 'PENDING'
  },
  paymentMethod: { type: String, enum: ['NAVE', 'TRANSFERENCIA'], default: 'NAVE' },
  proofUrl: String,
  proofUploadedAt: Date,
  navePaymentId: String,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    shippingCost: Number,
    shippingMethod: String,
  },
  trackingCode: String,
  invoiceUrl: String,
  stockDecremented: { type: Boolean, default: false }, // Flag to avoid double discounting
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);


import mongoose, { Schema } from 'mongoose';

const WebhookLogSchema = new Schema({
  service: String, // 'NAVE', 'ANDREANI', etc.
  method: String,
  payload: Schema.Types.Mixed,
  headers: Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
  orderId: String,
  status: String,
});

export default mongoose.models.WebhookLog || mongoose.model('WebhookLog', WebhookLogSchema);

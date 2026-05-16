import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  dateStr: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Format: YYYY-MM-DD
  count: { 
    type: Number, 
    default: 0 
  },
  cities: [{
    name: String,
    count: { type: Number, default: 0 }
  }],
  products: [{
    productId: String,
    name: String,
    count: { type: Number, default: 0 }
  }],
  referrers: [{
    domain: String,
    count: { type: Number, default: 0 }
  }],
  devices: {
    mobile: { type: Number, default: 0 },
    desktop: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  }
});

const VisitModel = mongoose.models.Visit || mongoose.model('Visit', VisitSchema);

export default VisitModel;

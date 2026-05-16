import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  costPrice: { type: Number }, // Cost in USD
  originalPrice: { type: Number },
  discount: { type: Number },
  image: { type: String, required: true },
  images: [{ type: String }], // Array for up to 8 additional images
  category: { type: String, required: true }, // Slug of the category
  description: { type: String },
  stock: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  badge: { type: String },
  specifications: [{
    label: { type: String },
    value: { type: String }
  }],
  properties: {
    weight: { type: String },
    dimensions: { type: String },
    color: { type: String }
  },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: { type: String }
  }
}, { timestamps: true });

// Clear the model from mongoose to ensure schema changes are picked up in HMR
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.model('Product', ProductSchema);

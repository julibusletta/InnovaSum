import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  alt: { type: String, default: '' },
  link: { type: String, default: '' },
  isCustom: { type: Boolean, default: false },
  title1: { type: String, default: '' },
  title2: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  showShippingIcon: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

const ProductCarouselSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['section', 'category'], default: 'section' },
  value: { type: String, required: true }, // e.g., 'bombas', 'nuevas', 'celulares'
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
});

const HomeSettingsSchema = new mongoose.Schema({
  heroSlides: [HeroSlideSchema],
  productCarousels: [ProductCarouselSchema],
  weeklyOffers: [{
    productId: String,
    title: String,
    subtitle: String,
    link: String,
    image: String,
    active: { type: Boolean, default: true }
  }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.HomeSettings || mongoose.model('HomeSettings', HomeSettingsSchema);

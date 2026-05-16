const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://admin:3CRVzt8trnHkhRkG@admin.j2yvyqi.mongodb.net/?appName=admin";

const HeroSlideSchema = new mongoose.Schema({
  image: String,
  alt: String,
  link: String,
  isCustom: Boolean,
  title1: String,
  title2: String,
  subtitle: String,
  showShippingIcon: Boolean,
  order: Number
});

const ProductCarouselSchema = new mongoose.Schema({
  title: String,
  type: String,
  value: String,
  order: Number,
  active: Boolean
});

const HomeSettingsSchema = new mongoose.Schema({
  heroSlides: [HeroSlideSchema],
  productCarousels: [ProductCarouselSchema],
  updatedAt: { type: Date, default: Date.now }
});

const HomeSettings = mongoose.models.HomeSettings || mongoose.model('HomeSettings', HomeSettingsSchema);

const initialSlides = [
  {
    image: '/images/bannerof1.png',
    alt: 'iPhone Premium',
    order: 0
  },
  {
    image: '/images/DC_20260306150520_9z1vjiMY.jpg',
    alt: 'Tecnología',
    order: 1
  },
  {
    image: '/images/slider-user-tech.png',
    alt: 'Promoción 6 Cuotas Sin Interés',
    isCustom: true,
    title1: 'HASTA 6 CUOTAS',
    title2: 'SIN INTERÉS',
    subtitle: 'LA TECNOLOGÍA QUE NECESITAS EN UN SOLO LUGAR',
    showShippingIcon: false,
    order: 2
  },
  {
    image: '/images/slider5.png',
    alt: 'Crecimiento Corporativo',
    order: 3
  },
  {
    image: '/images/JBLBoombox3Lifestyle01904x560px-(5014).webp',
    alt: 'Audio Premium',
    order: 4
  },
];

const initialCarousels = [
  { title: "BOMBAS EN INNOVASUM", type: 'section', value: 'bombas', order: 0, active: true },
  { title: "NUEVAS LLEGADAS", type: 'section', value: 'nuevas', order: 1, active: true }
];

const initialWeeklyOffers = [
  { productId: "378", title: "JBL CHARGE 6", subtitle: "* 10% de descuento abonando por transferencia", link: "/product/378", active: true },
  { productId: "1339", title: "XIAOMI SMART", subtitle: "ROBOT S40C", link: "/product/1339", active: true }
];

async function seed() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado!');

    // Eliminar configuración previa si existe
    await HomeSettings.deleteMany({});
    
    await HomeSettings.create({
      heroSlides: initialSlides,
      productCarousels: initialCarousels,
      weeklyOffers: initialWeeklyOffers,
      updatedAt: new Date()
    });

    console.log('Semillas de Home cargadas con éxito!');
    process.exit(0);
  } catch (err) {
    console.error('Error durante el seed:', err);
    process.exit(1);
  }
}

seed();

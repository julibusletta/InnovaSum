import Hero from './components/Hero/Hero';
import Benefits from './components/Benefits/Benefits';
import Categories from './components/Categories/Categories';
import { ProductCarouselSection } from './components/Products/ProductCarouselNative';

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Hero />
      <Benefits />
      <ProductCarouselSection 
        title="NUESTROS PRODUCTOS"
        value="bombas"
      />
      <Categories />
    </main>
  );
}

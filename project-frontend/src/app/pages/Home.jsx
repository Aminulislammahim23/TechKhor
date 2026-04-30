import Hero from "../components/Hero";
import Products from "../components/Products";
import Categories from "../components/Categories";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { useProducts, unwrapProducts } from "../hooks/useProducts";

function selectFeaturedProducts(responseData) {
  return unwrapProducts(responseData).slice(0, 4);
}

export default function Home() {
  const { products: featuredProducts } = useProducts({ select: selectFeaturedProducts });

  return (
    <div className="min-h-screen bg-slate-950">
      <main>
        <Hero />
        <Products products={featuredProducts} />
        <Categories />
        <WhyChooseUs />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

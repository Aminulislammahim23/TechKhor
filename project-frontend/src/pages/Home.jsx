import Hero from "../components/Hero";
import Products from "../components/Products";
import Categories from "../components/Categories";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { featuredProducts } from "../data/landingData";

export default function Home() {
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

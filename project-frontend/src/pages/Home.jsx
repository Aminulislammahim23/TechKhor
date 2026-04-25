import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Categories from "../components/Categories";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { getProducts } from "../api/product.api";

function unwrapProducts(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadFeaturedProducts() {
      try {
        const response = await getProducts();
        const products = unwrapProducts(response.data);

        if (active) {
          setFeaturedProducts(products.slice(0, 4));
        }
      } catch {
        if (active) {
          setFeaturedProducts([]);
        }
      }
    }

    loadFeaturedProducts();

    return () => {
      active = false;
    };
  }, []);

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

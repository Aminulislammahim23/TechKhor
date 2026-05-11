import { useMemo } from "react";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Categories from "../components/Categories";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import NewTrends from "../components/NewTrends";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import { useProducts, unwrapProducts } from "../hooks/useProducts";

function selectFeaturedProducts(responseData) {
  return unwrapProducts(responseData).slice(0, 4);
}

export default function Home() {
  const heroParams = useMemo(() => ({ approvedOnly: true, limit: 100 }), []);
  const newTrendParams = useMemo(() => ({ approvedOnly: true, limit: 12 }), []);
  const bestDealParams = useMemo(() => ({ offerOnly: true, approvedOnly: true, limit: 4 }), []);

  const { products: heroProducts, loading: heroLoading } = useProducts({ params: heroParams });
  const { products: featuredProducts } = useProducts({ select: selectFeaturedProducts });
  const { products: newTrends } = useProducts({
    params: newTrendParams,
    select: (responseData) =>
      unwrapProducts(responseData)
        .slice()
        .sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0))
        .slice(0, 10),
  });
  const { products: bestDeals } = useProducts({
    params: bestDealParams,
    select: selectFeaturedProducts,
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <main>
        <Hero products={heroProducts} loading={heroLoading} />
        <Products
          products={bestDeals}
          title="Best Deals"
          subtitle="Limited-time offer products selected by TechKhor sellers."
        />
        <NewTrends products={newTrends} />
        <Products products={featuredProducts} />
        <Categories />
        <WhyChooseUs />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

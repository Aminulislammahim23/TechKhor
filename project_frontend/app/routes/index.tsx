import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { PromoStrip } from "@/components/landing/PromoStrip";
import { Categories } from "@/components/landing/Categories";
import { FeaturedProducts } from "@/components/landing/FeaturedProducts";
import { WhyUs } from "@/components/landing/WhyUs";
import { Testimonials } from "@/components/landing/Testimonials";
import { Brands } from "@/components/landing/Brands";
import { Newsletter } from "@/components/landing/Newsletter";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TECHKHOR â€” Premium Electronics & Gadget Accessories" },
      { name: "description", content: "Shop curated headphones, wearables, chargers, and gaming gear. Free shipping over $49, 24h dispatch, 2-year warranty." },
      { property: "og:title", content: "TECHKHOR â€” Premium Electronics & Gadget Accessories" },
      { property: "og:description", content: "Curated headphones, wearables, chargers, and gaming gear. Fast shipping, unbeatable prices." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <PromoStrip />
        <Categories />
        <FeaturedProducts />
        <WhyUs />
        <Testimonials />
        <Brands />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

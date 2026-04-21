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

export default function Home() {
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
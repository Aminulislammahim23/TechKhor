import { Navbar } from "@/app/components/landing/Navbar";
import { Hero } from "@/app/components/landing/Hero";
import { PromoStrip } from "@/app/components/landing/PromoStrip";
import { Categories } from "@/app/components/landing/Categories";
import { FeaturedProducts } from "@/app/components/landing/FeaturedProducts";
import { WhyUs } from "@/app/components/landing/WhyUs";
import { Testimonials } from "@/app/components/landing/Testimonials";
import { Brands } from "@/app/components/landing/Brands";
import { Newsletter } from "@/app/components/landing/Newsletter";
import { Footer } from "@/app/components/landing/Footer";

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
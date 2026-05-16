import { Cpu, Headphones, ShieldCheck, Truck } from "lucide-react";

const highlights = [
  {
    title: "Electronic Parts",
    description: "Processors, monitors, storage, accessories, and everyday tech essentials in one place.",
    icon: Cpu,
  },
  {
    title: "Trusted Shopping",
    description: "We focus on clear product details, fair pricing, and reliable availability.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Delivery",
    description: "Orders are prepared carefully so customers can get their parts without unnecessary delay.",
    icon: Truck,
  },
  {
    title: "Helpful Support",
    description: "Our team helps shoppers choose products that fit their build, budget, and use case.",
    icon: Headphones,
  },
];

export default function AboutUs() {
  return (
    <section className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            About TechKhor
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Your trusted shop for electronic parts and PC essentials.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
            TechKhor is an e-commerce platform built for people who need reliable
            electronic parts, computer accessories, and upgrade components. We make
            it easier to compare products, find the right part, and buy with confidence.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/40">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"
            alt="Electronic circuit board components"
            className="h-72 w-full object-cover sm:h-96"
          />
        </div>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map(({ title, description, icon: Icon }) => (
          <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/20">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <Icon size={22} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          <p className="mt-3 leading-7 text-slate-400">
            We want to make tech shopping simpler for builders, students, gamers,
            offices, and everyday customers. Every product should be easy to understand,
            easy to compare, and easy to order.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-2xl font-bold text-white">What We Sell</h2>
          <p className="mt-3 leading-7 text-slate-400">
            TechKhor offers multiple electronic parts and accessories including PC
            components, monitors, storage devices, peripherals, cables, and other
            useful tech products for home, business, and custom builds.
          </p>
        </div>
      </div>
    </section>
  );
}

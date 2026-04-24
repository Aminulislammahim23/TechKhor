import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/product.api";

export default function ShopProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Catalog</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Products</h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Browse the full lineup of gadgets and accessories available from TechKhor.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300 md:col-span-2 xl:col-span-3">
              No products found right now. Try again after connecting the backend API.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

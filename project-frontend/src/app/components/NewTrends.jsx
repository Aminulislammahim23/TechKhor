import { useRef } from "react";
import { Link } from "react-router-dom";
import TechVisual from "./TechVisual";

function formatPrice(value) {
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getProductId(product) {
  return product?.id ?? product?._id;
}

function getSavings(product) {
  const price = Number(product?.price);
  const offerPrice = Number(product?.offerPrice);

  if (!product?.isOffer || !Number.isFinite(price) || !Number.isFinite(offerPrice) || offerPrice <= 0 || offerPrice >= price) {
    return 0;
  }

  return price - offerPrice;
}

export default function NewTrends({ products = [] }) {
  const scrollerRef = useRef(null);

  const scroll = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.min(scroller.clientWidth * 0.85, 980),
      behavior: "smooth",
    });
  };

  const trendProducts = products.slice(0, 10);

  return (
    <section className="bg-white py-20 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            New{" "}
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 bg-clip-text text-transparent">
              Trends
            </span>
          </h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-slate-950 hover:text-slate-950"
              aria-label="Previous trend products"
            >
              <span aria-hidden="true">&lt;</span>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-cyan-500 hover:text-slate-950"
              aria-label="Next trend products"
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          </div>
        </div>

        {trendProducts.length > 0 ? (
          <div
            ref={scrollerRef}
            className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {trendProducts.map((product) => {
              const productId = getProductId(product);
              const savings = getSavings(product);
              const price = savings > 0 ? Number(product.offerPrice) : Number(product.price);

              return (
                <Link
                  key={productId || product.name}
                  to={productId ? `/products/${productId}` : "/products"}
                  className="group min-w-[270px] snap-start overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/80 transition hover:-translate-y-1 hover:shadow-2xl sm:min-w-[320px]"
                >
                  <div className="flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                    {product?.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <TechVisual variant={product?.variant || "hero"} className="h-full w-full" />
                    )}
                  </div>

                  <div className="px-1 py-5">
                    <h3 className="line-clamp-2 min-h-14 text-xl font-bold text-slate-900">{product.name}</h3>
                    <p className="mt-3 text-2xl font-black text-slate-900">BDT {formatPrice(price)}</p>

                    {savings > 0 ? (
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-slate-500 line-through">
                          BDT {formatPrice(product.price)}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-600">
                          BDT {formatPrice(savings)} OFF
                        </span>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm font-semibold text-slate-500">Latest arrival</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600">
            New trend products will appear here soon.
          </div>
        )}
      </div>
    </section>
  );
}

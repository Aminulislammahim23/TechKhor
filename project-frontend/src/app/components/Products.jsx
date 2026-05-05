import { useEffect, useRef } from "react";
import ProductCard from "./ProductCard";

export default function Products({ products = [], title = "Featured Products", subtitle }) {
  const scrollerRef = useRef(null);
  const isAutoScrollPausedRef = useRef(false);
  const resumeAutoScrollTimeoutRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || products.length === 0) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    let animationFrameId;
    let previousTime;

    function scrollSlowly(timestamp) {
      if (!previousTime) previousTime = timestamp;

      const elapsed = timestamp - previousTime;
      previousTime = timestamp;

      if (!isAutoScrollPausedRef.current) {
        const loopWidth = scroller.scrollWidth / 2;
        scroller.scrollLeft += elapsed * 0.04;

        if (scroller.scrollLeft >= loopWidth) {
          scroller.scrollLeft -= loopWidth;
        }
      }

      animationFrameId = requestAnimationFrame(scrollSlowly);
    }

    animationFrameId = requestAnimationFrame(scrollSlowly);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [products]);

  useEffect(() => () => {
    if (resumeAutoScrollTimeoutRef.current) {
      window.clearTimeout(resumeAutoScrollTimeoutRef.current);
    }
  }, []);

  const pauseAutoScroll = () => {
    isAutoScrollPausedRef.current = true;

    if (resumeAutoScrollTimeoutRef.current) {
      window.clearTimeout(resumeAutoScrollTimeoutRef.current);
    }
  };

  const resumeAutoScroll = (delay = 0) => {
    if (resumeAutoScrollTimeoutRef.current) {
      window.clearTimeout(resumeAutoScrollTimeoutRef.current);
    }

    resumeAutoScrollTimeoutRef.current = window.setTimeout(() => {
      isAutoScrollPausedRef.current = false;
    }, delay);
  };

  const scroll = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    pauseAutoScroll();
    scroller.scrollBy({
      left: direction * Math.min(scroller.clientWidth * 0.85, 980),
      behavior: "smooth",
    });
    resumeAutoScroll(1800);
  };

  const renderProductCard = (product, keySuffix = "") => (
    <div
      key={`${product.id || product._id || product.slug || product.name}${keySuffix}`}
      className="w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] snap-start sm:w-auto sm:min-w-[360px] xl:min-w-[390px]"
    >
      <ProductCard product={product} />
    </div>
  );

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Handpicked</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-slate-400">
            {subtitle || "Explore the most popular gadgets and accessories designed to elevate your day."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-slate-300 transition-all duration-300 ease-out hover:border-white hover:text-white active:scale-95"
            aria-label="Previous featured products"
          >
            <span aria-hidden="true">&lt;</span>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950 transition-all duration-300 ease-out hover:bg-cyan-300 active:scale-95"
            aria-label="Next featured products"
          >
            <span aria-hidden="true">&gt;</span>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="product-card-scroller -mx-4 -mt-4 overflow-x-auto scroll-smooth px-4 pb-6 pt-4"
        onMouseEnter={pauseAutoScroll}
        onMouseLeave={() => resumeAutoScroll(500)}
        onPointerDown={pauseAutoScroll}
        onPointerUp={() => resumeAutoScroll(1200)}
        onPointerCancel={() => resumeAutoScroll(1200)}
        onFocusCapture={pauseAutoScroll}
        onBlurCapture={() => resumeAutoScroll(1200)}
        onWheel={() => {
          pauseAutoScroll();
          resumeAutoScroll(1600);
        }}
      >
        {products.length > 0 ? (
          <div className="flex w-max snap-x">
            <div className="flex gap-6 pr-6">{products.map((product) => renderProductCard(product))}</div>
            <div className="flex gap-6 pr-6" aria-hidden="true" inert="">
              {products.map((product) => renderProductCard(product, "-duplicate"))}
            </div>
          </div>
        ) : (
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300">
            No featured products are available right now.
          </div>
        )}
      </div>
    </section>
  );
}

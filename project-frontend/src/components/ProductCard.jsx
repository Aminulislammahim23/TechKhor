import { ShoppingCart, Star } from "lucide-react";

function formatPrice(price) {
  return Number(price).toLocaleString();
}

function getDisplayPrice(product) {
  return product.isOffer && product.offerPrice ? product.offerPrice : product.price;
}

function getCategoryName(category) {
  if (!category) {
    return "Uncategorized";
  }

  return typeof category === "string" ? category : category.name;
}

function RatingStars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 rating`}>
      {Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < Math.round(Number(rating));

        return (
          <Star
            key={index}
            size={18}
            className={isFilled ? "text-amber-400" : "text-slate-600"}
            fill={isFilled ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
}

export default function ProductCard({ product }) {
  const displayPrice = getDisplayPrice(product);
  const productTags = product.tags
    ? product.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 3)
    : [];
  const categoryName = getCategoryName(product.category);

  return (
    <article className="group flex min-h-[610px] flex-col rounded-[2rem] border border-slate-800 bg-slate-950 p-4 text-white shadow-2xl shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 sm:p-5">
      <figure className="aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-slate-900">
        <img
          src={
            product.image ||
            "https://placehold.co/500x350/f4f6fb/1f2937?text=Product"
          }
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </figure>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="mb-6 flex flex-wrap gap-2">
          {(productTags.length ? productTags : [categoryName || "Product"]).map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-cyan-500/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200"
              >
                {tag}
              </span>
            )
          )}
        </div>

        <h3 className="min-h-16 text-2xl font-bold leading-tight text-slate-50">
          {product.name}
        </h3>

        <p className="mt-3 text-base leading-7 text-slate-400">
          {product.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
          <span>Category: {categoryName}</span>
          <span>Stock: {product.stock}</span>
          <span className={product.stock > 0 ? "text-emerald-300" : "text-red-300"}>
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>

        <div className="mt-5">
          <RatingStars rating={product.rating} />
        </div>

        <div className="mt-auto flex flex-col gap-5 pt-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Price
            </p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-extrabold text-white">
                BDT {formatPrice(displayPrice)}
              </span>
              {product.isOffer && product.offerPrice && (
                <span className="pb-1 text-sm text-slate-500 line-through">
                  BDT {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <button
              className="btn rounded-full border-0 bg-cyan-400 px-5 text-base font-semibold text-slate-950 hover:bg-cyan-300 disabled:bg-slate-700 disabled:text-slate-400"
              disabled={product.stock <= 0 || product.isApproved === false}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button className="btn rounded-full border-0 bg-white px-7 text-base font-semibold text-slate-950 hover:bg-slate-200">
              View
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

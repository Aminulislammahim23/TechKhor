import { useEffect, useState } from "react";
import { ShoppingCart, Star } from "lucide-react";
import CaroCart from "../components/CaroCart";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5010/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log("Product loading error:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">

      <div className="mb-6">
        <h1 className="text-4xl font-bold">Welcome to TechKhor</h1>
        <p className="text-gray-500 mt-2">
          Your one-stop shop for all your tech needs. Explore our latest products and exclusive deals.
        </p>
        <CaroCart />
      </div>

      <div className="mb-6">
        <h1 className="text-4xl font-bold">Shop Products</h1>
        <p className="text-gray-500 mt-2">
          Browse our latest products and add them to your cart.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="card bg-base-100 shadow-xl"
          >
            <figure className="px-6 pt-6">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 object-contain"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>

              <div className="flex items-center gap-1 text-warning">
                <Star size={18} fill="currentColor" />
                <span>{product.rating}</span>
              </div>

              <p className="text-xl font-bold text-primary">
                ৳ {product.price}
              </p>

              <div className="card-actions justify-between mt-2">
                <button className="btn btn-outline btn-primary btn-sm">
                  View Details
                </button>
                <button className="btn btn-primary btn-sm">
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>



      <div className="mt-6">
        <h1 className="text-4xl font-bold"> Best Deals </h1>
        <p className="text-gray-500 mt-2">
          Check out our exclusive deals and special offers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="card bg-base-100 shadow-xl"
          >
            <figure className="px-6 pt-6">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 object-contain"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>

              <div className="flex items-center gap-1 text-warning">
                <Star size={18} fill="currentColor" />
                <span>{product.rating}</span>
              </div>

              <p className="text-xl font-bold text-primary">
                ৳ {product.price}
              </p>

              <div className="card-actions justify-between mt-2">
                <button className="btn btn-outline btn-primary btn-sm">
                  View Details
                </button>
                <button className="btn btn-primary btn-sm">
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

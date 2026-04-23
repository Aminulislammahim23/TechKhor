import { useEffect, useState } from "react";
import { getProducts } from "../api/product.api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h1>Products</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <h3>{product.name}</h3>
      <p>{product.price} BDT</p>

      <Link to={`/products/${product._id}`}>
        View Details
      </Link>
    </div>
  );
}
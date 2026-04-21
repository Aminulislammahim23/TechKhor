import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { ProductTable } from "@/components/admin/ProductTable";

export const Route = createFileRoute("/admin/products/")({
  head: () => ({
    meta: [{ title: "Products Management" }],
  }),
  component: ProductsPage,
});

interface Product {
  id: string;
  name: string;
  price: number;
  seller: {
    id: string;
    fullName: string;
    shopName?: string;
  };
  status: "PENDING" | "APPROVED" | "REJECTED" | "REMOVED";
  category: string;
  createdAt: string;
  approvedAt?: string;
}

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected" | "removed">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let endpoint = "http://localhost:3000/admin/products";

      if (filter !== "all") {
        endpoint += `/${filter}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Mock data
      setProducts([
        {
          id: "1",
          name: "Wireless Headphones Pro",
          price: 199.99,
          seller: { id: "s1", fullName: "Ahmed Khan", shopName: "Tech Store" },
          status: "PENDING",
          category: "Audio",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "USB-C Power Bank",
          price: 49.99,
          seller: { id: "s2", fullName: "Fatima Ali", shopName: "Electronics Plus" },
          status: "APPROVED",
          category: "Accessories",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          approvedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Gaming Mouse",
          price: 79.99,
          seller: { id: "s1", fullName: "Ahmed Khan", shopName: "Tech Store" },
          status: "REJECTED",
          category: "Gaming",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const stats = {
    pending: products.filter((p) => p.status === "PENDING").length,
    approved: products.filter((p) => p.status === "APPROVED").length,
    rejected: products.filter((p) => p.status === "REJECTED" || p.status === "REMOVED").length,
    total: products.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Review and manage seller products
          </p>
        </div>
        <button
          onClick={() => fetchProducts()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <AlertCircle className="text-yellow-600" size={32} />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected/Removed</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="text-red-600" size={32} />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Package className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "approved", "rejected", "removed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <ProductTable products={filteredProducts} onProductUpdate={fetchProducts} />
      )}
    </div>
  );
}

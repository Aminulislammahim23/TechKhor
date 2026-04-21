import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { SellerTable } from "@/components/admin/SellerTable";

export const Route = createFileRoute("/admin/sellers/")({
  head: () => ({
    meta: [{ title: "Sellers Management" }],
  }),
  component: SellersPage,
});

interface Seller {
  id: string;
  email: string;
  fullName: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "BANNED";
  shopName?: string;
  createdAt: string;
  approvedAt?: string;
}

function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSellers();
  }, [filter]);

  useEffect(() => {
    filterSellers();
  }, [searchTerm, sellers]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let endpoint = "http://localhost:3000/admin/sellers";

      if (filter === "pending") {
        endpoint += "/pending";
      } else if (filter === "approved") {
        endpoint += "/approved";
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sellers");
      }

      const data = await response.json();
      setSellers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      // Mock data
      setSellers([
        {
          id: "1",
          email: "seller1@techkhor.com",
          fullName: "Ahmed Khan",
          status: "PENDING",
          shopName: "Tech Store",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          email: "seller2@techkhor.com",
          fullName: "Fatima Ali",
          status: "APPROVED",
          shopName: "Electronics Plus",
          createdAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
        },
        {
          id: "3",
          email: "seller3@techkhor.com",
          fullName: "Omar Hassan",
          status: "ACTIVE",
          shopName: "Gadget Hub",
          createdAt: new Date().toISOString(),
          approvedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterSellers = () => {
    let filtered = sellers;

    if (searchTerm) {
      filtered = filtered.filter((seller) =>
        seller.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSellers(filtered);
  };

  const stats = {
    pending: sellers.filter((s) => s.status === "PENDING").length,
    approved: sellers.filter((s) => s.status === "APPROVED" || s.status === "ACTIVE").length,
    total: sellers.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sellers Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and approve sellers on your platform
          </p>
        </div>
        <button
          onClick={() => fetchSellers()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
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
              <p className="text-sm text-gray-600">Total Sellers</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <CheckCircle className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
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
          placeholder="Search sellers..."
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
        <SellerTable sellers={filteredSellers} onSellerUpdate={fetchSellers} />
      )}
    </div>
  );
}

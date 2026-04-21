import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Lock, RefreshCw } from "lucide-react";
import { CustomerTable } from "@/components/admin/CustomerTable";

export const Route = createFileRoute("/admin/customers/")({
  head: () => ({
    meta: [{ title: "Customers Management" }],
  }),
  component: CustomersPage,
});

interface Customer {
  id: string;
  email: string;
  fullName: string;
  status: "ACTIVE" | "BANNED" | "PENDING";
  phone?: string;
  createdAt: string;
  lastActive?: string;
}

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "banned">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, [filter]);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let endpoint = "http://localhost:3000/admin/customers";

      if (filter === "active") {
        endpoint += "/active";
      } else if (filter === "banned") {
        endpoint += "/banned";
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      // Mock data
      setCustomers([
        {
          id: "1",
          email: "customer1@example.com",
          fullName: "Zainab Ahmed",
          status: "ACTIVE",
          phone: "+971501234567",
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        },
        {
          id: "2",
          email: "customer2@example.com",
          fullName: "Mohammed Ibrahim",
          status: "ACTIVE",
          phone: "+971502345678",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          lastActive: new Date().toISOString(),
        },
        {
          id: "3",
          email: "customer3@example.com",
          fullName: "Layla Hassan",
          status: "BANNED",
          phone: "+971503456789",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter((customer) =>
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
  };

  const stats = {
    active: customers.filter((c) => c.status === "ACTIVE").length,
    banned: customers.filter((c) => c.status === "BANNED").length,
    total: customers.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage customer accounts
          </p>
        </div>
        <button
          onClick={() => fetchCustomers()}
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
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Users className="text-green-600" size={32} />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Banned Customers</p>
              <p className="mt-1 text-2xl font-bold text-red-600">{stats.banned}</p>
            </div>
            <Lock className="text-red-600" size={32} />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {(["all", "active", "banned"] as const).map((f) => (
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
          placeholder="Search customers..."
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
        <CustomerTable customers={filteredCustomers} onCustomerUpdate={fetchCustomers} />
      )}
    </div>
  );
}

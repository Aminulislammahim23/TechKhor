import { Lock, Unlock } from "lucide-react";
import { useState } from "react";

interface Customer {
  id: string;
  email: string;
  fullName: string;
  status: "ACTIVE" | "BANNED" | "PENDING";
  phone?: string;
  createdAt: string;
  lastActive?: string;
}

interface CustomerTableProps {
  customers: Customer[];
  onCustomerUpdate: () => void;
}

export function CustomerTable({ customers, onCustomerUpdate }: CustomerTableProps) {
  const [actionId, setActionId] = useState<string | null>(null);

  const handleBan = async (customerId: string) => {
    try {
      setActionId(customerId);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/customers/ban", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error("Failed to ban customer");
      }

      onCustomerUpdate();
    } catch (error) {
      console.error("Error banning customer:", error);
    } finally {
      setActionId(null);
    }
  };

  const handleUnban = async (customerId: string) => {
    try {
      setActionId(customerId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/admin/customers/unblock/${customerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unban customer");
      }

      onCustomerUpdate();
    } catch (error) {
      console.error("Error unbanning customer:", error);
    } finally {
      setActionId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit";

    switch (status) {
      case "ACTIVE":
        return <span className={`${baseClasses} bg-green-100 text-green-700`}>Active</span>;
      case "BANNED":
        return <span className={`${baseClasses} bg-red-100 text-red-700`}>
          <Lock size={14} /> Banned
        </span>;
      default:
        return <span className={baseClasses}>{status}</span>;
    }
  };

  if (customers.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
        <p className="text-gray-500">No customers found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Last Active
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">{customer.fullName}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600">{customer.email}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600">{customer.phone || "-"}</p>
              </td>
              <td className="px-6 py-4">{getStatusBadge(customer.status)}</td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600">
                  {customer.lastActive
                    ? new Date(customer.lastActive).toLocaleDateString()
                    : "-"}
                </p>
              </td>
              <td className="px-6 py-4">
                {customer.status === "ACTIVE" && (
                  <button
                    onClick={() => handleBan(customer.id)}
                    disabled={actionId === customer.id}
                    className="flex items-center gap-1 rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <Lock size={14} />
                    {actionId === customer.id ? "..." : "Ban"}
                  </button>
                )}
                {customer.status === "BANNED" && (
                  <button
                    onClick={() => handleUnban(customer.id)}
                    disabled={actionId === customer.id}
                    className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Unlock size={14} />
                    {actionId === customer.id ? "..." : "Unban"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

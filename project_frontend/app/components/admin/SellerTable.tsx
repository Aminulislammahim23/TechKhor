import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useState } from "react";

interface Seller {
  id: string;
  email: string;
  fullName: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "BANNED";
  shopName?: string;
  createdAt: string;
  approvedAt?: string;
}

interface SellerTableProps {
  sellers: Seller[];
  onSellerUpdate: () => void;
}

export function SellerTable({ sellers, onSellerUpdate }: SellerTableProps) {
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const handleApprove = async (sellerId: string) => {
    try {
      setApprovingId(sellerId);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/sellers/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerId }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve seller");
      }

      onSellerUpdate();
    } catch (error) {
      console.error("Error approving seller:", error);
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (sellerId: string) => {
    try {
      setRejectingId(sellerId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/admin/sellers/reject/${sellerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject seller");
      }

      onSellerUpdate();
    } catch (error) {
      console.error("Error rejecting seller:", error);
    } finally {
      setRejectingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit";

    switch (status) {
      case "PENDING":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>
          <Clock size={14} /> Pending
        </span>;
      case "APPROVED":
      case "ACTIVE":
        return <span className={`${baseClasses} bg-green-100 text-green-700`}>
          <CheckCircle size={14} /> Approved
        </span>;
      case "REJECTED":
        return <span className={`${baseClasses} bg-red-100 text-red-700`}>
          <XCircle size={14} /> Rejected
        </span>;
      default:
        return <span className={baseClasses}>{status}</span>;
    }
  };

  if (sellers.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
        <p className="text-gray-500">No sellers found</p>
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
              Shop Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Joined
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sellers.map((seller) => (
            <tr key={seller.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">{seller.fullName}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600">{seller.email}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600">{seller.shopName || "-"}</p>
              </td>
              <td className="px-6 py-4">{getStatusBadge(seller.status)}</td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600">
                  {new Date(seller.createdAt).toLocaleDateString()}
                </p>
              </td>
              <td className="px-6 py-4">
                {seller.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(seller.id)}
                      disabled={approvingId === seller.id}
                      className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {approvingId === seller.id ? "..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(seller.id)}
                      disabled={rejectingId === seller.id}
                      className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {rejectingId === seller.id ? "..." : "Reject"}
                    </button>
                  </div>
                )}
                {seller.status !== "PENDING" && (
                  <span className="text-xs text-gray-500">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { useState } from "react";

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

interface ProductTableProps {
  products: Product[];
  onProductUpdate: () => void;
}

export function ProductTable({ products, onProductUpdate }: ProductTableProps) {
  const [actionId, setActionId] = useState<string | null>(null);

  const handleApprove = async (productId: string) => {
    try {
      setActionId(productId);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/products/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve product");
      }

      onProductUpdate();
    } catch (error) {
      console.error("Error approving product:", error);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (productId: string) => {
    try {
      setActionId(productId);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/products/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject product");
      }

      onProductUpdate();
    } catch (error) {
      console.error("Error rejecting product:", error);
    } finally {
      setActionId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      setActionId(productId);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/products/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove product");
      }

      onProductUpdate();
    } catch (error) {
      console.error("Error removing product:", error);
    } finally {
      setActionId(null);
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
        return <span className={`${baseClasses} bg-green-100 text-green-700`}>
          <CheckCircle size={14} /> Approved
        </span>;
      case "REJECTED":
        return <span className={`${baseClasses} bg-red-100 text-red-700`}>
          <XCircle size={14} /> Rejected
        </span>;
      case "REMOVED":
        return <span className={`${baseClasses} bg-gray-100 text-gray-700`}>
          <Trash2 size={14} /> Removed
        </span>;
      default:
        return <span className={baseClasses}>{status}</span>;
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Product Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Seller
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Price
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">{product.name}</p>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.seller.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.seller.shopName || "No shop name"}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600">{product.category}</p>
              </td>
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">${product.price.toFixed(2)}</p>
              </td>
              <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
              <td className="px-6 py-4">
                {product.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(product.id)}
                      disabled={actionId === product.id}
                      className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {actionId === product.id ? "..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
                      disabled={actionId === product.id}
                      className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionId === product.id ? "..." : "Reject"}
                    </button>
                  </div>
                )}
                {product.status === "APPROVED" && (
                  <button
                    onClick={() => handleRemove(product.id)}
                    disabled={actionId === product.id}
                    className="flex items-center gap-1 rounded bg-orange-600 px-3 py-1 text-xs font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {actionId === product.id ? "..." : "Remove"}
                  </button>
                )}
                {(product.status === "REJECTED" || product.status === "REMOVED") && (
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

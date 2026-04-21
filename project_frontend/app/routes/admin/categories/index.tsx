import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FolderOpen, Plus, RefreshCw } from "lucide-react";
import { CategoryTable } from "@/components/admin/CategoryTable";
import { CategoryModal } from "@/components/admin/CategoryModal";

export const Route = createFileRoute("/admin/categories/")({
  head: () => ({
    meta: [{ title: "Categories Management" }],
  }),
  component: CategoriesPage,
});

interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
  productCount?: number;
}

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Mock data
      setCategories([
        {
          id: "1",
          name: "Headphones & Audio",
          description: "Premium audio equipment and accessories",
          image: "https://via.placeholder.com/100",
          createdAt: new Date().toISOString(),
          productCount: 45,
        },
        {
          id: "2",
          name: "Mobile Accessories",
          description: "Phone cases, chargers, and protectors",
          image: "https://via.placeholder.com/100",
          createdAt: new Date().toISOString(),
          productCount: 120,
        },
        {
          id: "3",
          name: "Wearables",
          description: "Smartwatches and fitness trackers",
          image: "https://via.placeholder.com/100",
          createdAt: new Date().toISOString(),
          productCount: 35,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  };

  const handleAddCategory = async (formData: Omit<Category, "id" | "createdAt">) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleUpdateCategory = async (id: string, formData: Omit<Category, "id" | "createdAt">) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      fetchCategories();
      setEditingCategory(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage product categories
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchCategories()}
            className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Categories</p>
            <p className="mt-1 text-3xl font-bold text-blue-600">{categories.length}</p>
          </div>
          <FolderOpen className="text-blue-600" size={40} />
        </div>
      </div>

      {/* Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onEdit={(category) => {
            setEditingCategory(category);
            setShowModal(true);
          }}
          onCategoryUpdate={fetchCategories}
        />
      )}

      {/* Modal */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSave={(formData) => {
            if (editingCategory) {
              handleUpdateCategory(editingCategory.id, formData);
            } else {
              handleAddCategory(formData);
            }
          }}
        />
      )}
    </div>
  );
}

import { Trash2, Edit } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
  productCount?: number;
}

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onCategoryUpdate: () => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onCategoryUpdate,
}: CategoryTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setDeletingId(categoryId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/admin/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      onCategoryUpdate();
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
        <p className="text-gray-500">No categories found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
        >
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="h-40 w-full object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-bold text-gray-900">{category.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {category.description}
            </p>

            {category.productCount !== undefined && (
              <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-xs font-medium text-gray-500">
                  {category.productCount} products
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onEdit(category)}
                className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                disabled={deletingId === category.id}
                className="flex flex-1 items-center justify-center gap-1 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 size={16} />
                {deletingId === category.id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

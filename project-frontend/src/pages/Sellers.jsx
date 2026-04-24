import { useEffect, useState } from "react";
import Table from "../components/Table";
import { deleteSeller, getSellers } from "../api/users.api";

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSellers = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await getSellers();
        if (mounted) {
          setSellers(data);
        }
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              "Unable to load sellers."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSellers();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this seller account?")) {
      return;
    }

    try {
      await deleteSeller(id);
      setSellers((current) => current.filter((seller) => seller.id !== id));
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to delete seller."
      );
    }
  };

  const columns = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: () => (
        <span className="inline-flex items-center rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-400/20">
          Seller
        </span>
      ),
    },
    { key: "createdAt", label: "Created At" },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Seller management</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Sellers</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Manage seller accounts created by the admin team.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-slate-400 shadow-xl shadow-slate-950/30">
          Loading sellers...
        </div>
      ) : (
        <Table
          columns={columns}
          data={sellers}
          rowKey="id"
          renderRowActions={(seller) => (
            <button
              type="button"
              onClick={() => handleDelete(seller.id)}
              className="rounded-xl border border-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
            >
              Delete Seller
            </button>
          )}
        />
      )}
    </section>
  );
}

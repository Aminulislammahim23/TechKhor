import { useEffect, useState } from "react";
import Table from "../components/Table";
import { normalizeApiError } from "../api";
import { getUsers } from "../api/users.api";

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toISOString().slice(0, 10);
}

function unwrapUsers(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  return [];
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");
        const response = await getUsers();

        if (active) {
          setUsers(unwrapUsers(response.data));
        }
      } catch (err) {
        if (active) {
          setUsers([]);
          setError(normalizeApiError(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "createdAt", label: "CreatedAt", render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <section className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          Loading users...
        </div>
      ) : null}

      <Table columns={columns} data={users} rowKey="id" />
    </section>
  );
}

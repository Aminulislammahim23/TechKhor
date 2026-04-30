import { useEffect, useState } from "react";
import { getMaintenanceStatus, normalizeApiError, updateMaintenanceStatus } from "../api";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUserIdFromToken } from "../utils/jwt";
import { getUserById, updateUser } from "../api/users.api";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
};

export default function Settings() {
  const { token } = useAuth();
  const userId = getCurrentUserIdFromToken(token);
  const [form, setForm] = useState(initialForm);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingMaintenance, setSavingMaintenance] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setError("");
        const [profileRes, maintenanceRes] = await Promise.all([
          userId ? getUserById(userId) : Promise.resolve({ data: null }),
          getMaintenanceStatus(),
        ]);

        if (!active) return;

        if (profileRes?.data) {
          setForm({
            fullName: profileRes.data.fullName || "",
            email: profileRes.data.email || "",
            password: "",
          });
        }

        setMaintenanceMode(Boolean(maintenanceRes?.data?.maintenanceMode));
      } catch (err) {
        if (active) {
          setError(normalizeApiError(err));
        }
      } finally {
        if (active) {
          setLoadingProfile(false);
          setLoadingMaintenance(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();

    if (!userId) {
      setError("Unable to detect current admin profile.");
      return;
    }

    try {
      setSavingProfile(true);
      setError("");
      setSuccess("");

      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      await updateUser(userId, payload);
      setForm((current) => ({ ...current, password: "" }));
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleMaintenanceToggle = async () => {
    const nextValue = !maintenanceMode;

    try {
      setSavingMaintenance(true);
      setError("");
      setSuccess("");
      const response = await updateMaintenanceStatus(nextValue);
      setMaintenanceMode(Boolean(response?.data?.maintenanceMode));
      setSuccess(`Maintenance mode ${nextValue ? "enabled" : "disabled"}.`);
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSavingMaintenance(false);
    }
  };

  return (
    <section className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      <form onSubmit={handleProfileSave} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Profile</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Edit admin profile</h3>

        {loadingProfile ? (
          <p className="mt-4 text-sm text-slate-400">Loading profile...</p>
        ) : (
          <div className="mt-6 grid gap-5 lg:max-w-2xl">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                New Password (optional)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Enter new password if needed"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}
      </form>

      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Server</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Maintenance mode</h3>

        {loadingMaintenance ? (
          <p className="mt-4 text-sm text-slate-400">Loading server status...</p>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <span
              className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                maintenanceMode
                  ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20"
                  : "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20"
              }`}
            >
              {maintenanceMode ? "Enabled" : "Disabled"}
            </span>
            <button
              type="button"
              onClick={handleMaintenanceToggle}
              disabled={savingMaintenance}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingMaintenance
                ? "Updating..."
                : maintenanceMode
                ? "Disable Maintenance"
                : "Enable Maintenance"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

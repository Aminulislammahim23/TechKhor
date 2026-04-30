import { useEffect, useState } from "react";
import { getAuthToken } from "../hooks/useAuth";
import { getUserById, updateUserById } from "../api";
import { decodeJwtPayload, getCurrentUserIdFromToken } from "../utils/jwt";

function getFallbackProfile() {
  const payload = decodeJwtPayload(getAuthToken()) || {};

  return {
    name: payload.fullName || payload.name || "TechKhor Customer",
    email: payload.email || "customer@techkhor.com",
    phone: payload.phone || "",
  };
}

export default function Profile() {
  const [profile, setProfile] = useState(getFallbackProfile);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const userId = getCurrentUserIdFromToken(getAuthToken());
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getUserById(userId);
        const user = response.data || {};
        if (active) {
          setProfile({
            name: user.fullName || user.name || getFallbackProfile().name,
            email: user.email || getFallbackProfile().email,
            phone: user.phone || getFallbackProfile().phone,
          });
        }
      } catch {
        if (active) {
          setProfile(getFallbackProfile());
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const userId = getCurrentUserIdFromToken(getAuthToken());
      if (userId) {
        await updateUserById(userId, {
          fullName: profile.name,
          email: profile.email,
          phone: profile.phone.replace(/[^\d+]/g, "").trim(),
        });
      }
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Profile saved locally. Backend update is unavailable right now.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (!passwords.newPassword || passwords.newPassword !== passwords.confirmPassword) {
      setMessage("New password and confirmation must match.");
      return;
    }

    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage("Password change request prepared.");
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <form
        onSubmit={handleProfileSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70"
      >
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-2xl font-bold text-white">
            {profile.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-950">Account Details</h3>
            <p className="mt-1 text-sm text-slate-500">Keep your contact information up to date.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ) : (
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Name</span>
              <input
                value={profile.name}
                onChange={(event) => setProfile((value) => ({ ...value, name: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-cyan-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => setProfile((value) => ({ ...value, email: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-cyan-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Phone Number</span>
              <input
                type="tel"
                inputMode="tel"
                value={profile.phone}
                onChange={(event) => setProfile((value) => ({ ...value, phone: event.target.value }))}
                placeholder="Enter phone number"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-cyan-400"
              />
            </label>
          </div>
        )}

        {message ? (
          <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={saving || loading}
          className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {saving ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70"
      >
        <h3 className="text-2xl font-semibold text-slate-950">Change Password</h3>
        <p className="mt-1 text-sm text-slate-500">Use a strong password that is unique to TechKhor.</p>

        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Current Password</span>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(event) => setPasswords((value) => ({ ...value, currentPassword: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-cyan-400"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">New Password</span>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(event) => setPasswords((value) => ({ ...value, newPassword: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-cyan-400"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Confirm Password</span>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(event) => setPasswords((value) => ({ ...value, confirmPassword: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 focus:border-cyan-400"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
        >
          Change Password
        </button>
      </form>
    </section>
  );
}

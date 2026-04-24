import { useState } from "react";
import { createSeller } from "../api/users.api";

const initialState = {
  fullName: "",
  email: "",
  password: "",
};

export default function CreateSeller() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      await createSeller({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setMessage("Seller account created successfully.");
      setForm(initialState);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to create seller right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-400">Seller onboarding</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Create Seller Account</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Create a new seller account from the admin dashboard. The account will be stored with
          the `seller` role and can be used for marketplace operations.
        </p>
      </div>

      <form className="mt-8 grid gap-5 lg:max-w-2xl" onSubmit={handleSubmit} noValidate>
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
            placeholder="Enter seller full name"
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
            placeholder="seller@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="Create a secure password"
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-cyan-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating seller..." : "Create Seller"}
        </button>
      </form>
    </section>
  );
}

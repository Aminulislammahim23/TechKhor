import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { register, normalizeApiError } from "../api";
import { useAuth } from "../hooks/useAuth";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
};

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || "/products", { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required for customer accounts.";
    if (form.phone.trim() && form.phone.replace(/[^\d+]/g, "").trim().length < 4) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (!form.password.trim()) nextErrors.password = "Password is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/[^\d+]/g, "").trim(),
        password: form.password,
      });

      setForm(initialState);
      navigate("/login", { replace: true });
    } catch (error) {
      setServerError(normalizeApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Create account</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Register for TechKhor</h1>
          <p className="mt-3 text-sm text-slate-400">All accounts are created as customers by default.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-slate-300">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="Enter your full name"
            />
            {errors.fullName ? <p className="mt-2 text-sm text-rose-400">{errors.fullName}</p> : null}
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
              placeholder="Enter your email"
            />
            {errors.email ? <p className="mt-2 text-sm text-rose-400">{errors.email}</p> : null}
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-300">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="Enter your phone number"
            />
            {errors.phone ? <p className="mt-2 text-sm text-rose-400">{errors.phone}</p> : null}
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
              placeholder="Create a password"
            />
            {errors.password ? <p className="mt-2 text-sm text-rose-400">{errors.password}</p> : null}
          </div>

          {serverError ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {serverError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

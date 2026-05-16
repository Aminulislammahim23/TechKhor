import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  accountType: "customer",
  acceptedTerms: false,
};

export default function Registration() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Join TechKhor to shop electronic parts, track orders, and build your setup.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="form-control sm:col-span-2">
            <span className="label-text mb-2 text-slate-300">Full Name</span>
            <div className="input input-bordered flex items-center gap-3 border-slate-700 bg-slate-950 text-slate-100">
              <User size={18} className="text-slate-500" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="grow"
                required
              />
            </div>
          </label>

          <label className="form-control">
            <span className="label-text mb-2 text-slate-300">Email</span>
            <div className="input input-bordered flex items-center gap-3 border-slate-700 bg-slate-950 text-slate-100">
              <Mail size={18} className="text-slate-500" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="grow"
                required
              />
            </div>
          </label>

          <label className="form-control">
            <span className="label-text mb-2 text-slate-300">Phone</span>
            <div className="input input-bordered flex items-center gap-3 border-slate-700 bg-slate-950 text-slate-100">
              <Phone size={18} className="text-slate-500" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+880 1XXX XXXXXX"
                className="grow"
              />
            </div>
          </label>

          <label className="form-control">
            <span className="label-text mb-2 text-slate-300">Password</span>
            <div className="input input-bordered flex items-center gap-3 border-slate-700 bg-slate-950 text-slate-100">
              <Lock size={18} className="text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="grow"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((isVisible) => !isVisible)}
                className="text-slate-400 hover:text-slate-100"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="form-control">
            <span className="label-text mb-2 text-slate-300">Confirm Password</span>
            <div className="input input-bordered flex items-center gap-3 border-slate-700 bg-slate-950 text-slate-100">
              <Lock size={18} className="text-slate-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="grow"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((isVisible) => !isVisible)}
                className="text-slate-400 hover:text-slate-100"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-400 sm:col-span-2">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
              className="checkbox checkbox-sm mt-0.5 border-slate-600 bg-slate-950"
              required
            />
            <span>
              I agree to the TechKhor terms and privacy policy.
            </span>
          </label>

          <button type="submit" className="btn btn-primary sm:col-span-2">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="link link-hover text-cyan-300">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

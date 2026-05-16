import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const initialForm = {
  email: "",
  password: "",
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Login to continue shopping with TechKhor.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <span className="label-text mb-2 text-slate-300">Password</span>
            <div className="input input-bordered flex items-center gap-3 border-slate-700 bg-slate-950 text-slate-100">
              <Lock size={18} className="text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-slate-400">
              <input type="checkbox" className="checkbox checkbox-sm border-slate-600 bg-slate-950" />
              Remember me
            </label>
            <a className="link link-hover text-cyan-300">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New to TechKhor?{" "}
          <Link to="/register" className="link link-hover text-cyan-300">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

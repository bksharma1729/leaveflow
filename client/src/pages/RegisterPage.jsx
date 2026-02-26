import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      showToast("Account created successfully", "success");
      navigate("/employee");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-3 sm:p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-2xl backdrop-blur md:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-700 p-10 text-white md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Join System</p>
          <h1 className="mt-5 text-4xl font-bold leading-tight">Create your employee account and start filing leaves.</h1>
          <p className="mt-4 text-indigo-100">Role upgrades are handled by admins from the control panel.</p>
        </section>

        <section className="p-6 sm:p-8 md:p-10">
          <p className="text-2xl font-bold text-slate-900 sm:text-3xl">Create account</p>
          <p className="mt-1 text-sm text-slate-500">New users start as employee</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
              type="submit"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already have an account? <Link className="font-semibold text-indigo-700" to="/login">Login</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;

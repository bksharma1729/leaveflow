import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const goByRole = (role) => {
    if (role === "admin") navigate("/admin");
    else if (role === "manager") navigate("/manager");
    else navigate("/employee");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.email, form.password);
      showToast(`Welcome back, ${user.name}`, "success");
      goByRole(user.role);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-3 sm:p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-2xl backdrop-blur md:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-teal-900 via-cyan-800 to-sky-700 p-10 text-white md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">Employee Portal</p>
          <h1 className="mt-5 text-4xl font-bold leading-tight">Manage leaves without paperwork and delays.</h1>
          <p className="mt-4 text-cyan-100">Fast approvals, transparent status tracking, and role-based dashboards.</p>
        </section>

        <section className="p-6 sm:p-8 md:p-10">
          <p className="text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back</p>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal-500"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal-500"
              type="password"
              name="password"
              placeholder="Password"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            No account? <Link className="font-semibold text-teal-700" to="/register">Create one</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;

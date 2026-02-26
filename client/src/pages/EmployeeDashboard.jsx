import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import AnalyticsCharts from "../components/AnalyticsCharts";
import LeaveTable from "../components/LeaveTable";
import Sidebar from "../components/Sidebar";
import SummaryCards from "../components/SummaryCards";
import { useToast } from "../context/useToast";

const EmployeeDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ type: "Sick", startDate: "", endDate: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const requestedDays = useMemo(() => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  }, [form.startDate, form.endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, leavesRes] = await Promise.all([api.get("/leaves/summary"), api.get("/leaves/my")]);
      setSummary(summaryRes.data.summary);
      setLeaves(leavesRes.data.leaves);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, startDate: today, endDate: prev.endDate || today }));
  };

  const submitLeave = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post("/leaves", form);
      setForm({ type: "Sick", startDate: "", endDate: "", reason: "" });
      await fetchData();
      showToast("Leave request submitted", "success");
    } catch (err) {
      const message = err.response?.data?.message || "Unable to submit leave request";
      setError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <header className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-900 to-cyan-700 p-4 text-white shadow-lg sm:p-6">
            <h1 className="text-xl font-bold sm:text-2xl">Employee Dashboard</h1>
            <p className="mt-1 text-xs text-cyan-100 sm:text-sm">Submit requests, track status updates, and stay informed in real time.</p>
          </header>

          {error ? <p className="rounded-lg bg-rose-100 p-3 text-sm text-rose-700">{error}</p> : null}
          {loading ? <p className="text-slate-600">Loading dashboard...</p> : <SummaryCards summary={summary} />}
          {!loading ? <AnalyticsCharts summary={summary} leaves={leaves} title="My Leave Analytics" /> : null}

          <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold">Apply Leave</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={setToday}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Use Today
                </button>
                <span className="rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
                  Duration: {requestedDays} day{requestedDays === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <form className="grid gap-3 md:grid-cols-2" onSubmit={submitLeave}>
              <select className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-teal-500" name="type" value={form.type} onChange={handleFormChange}>
                <option value="Sick">Sick</option>
                <option value="Casual">Casual</option>
                <option value="Earned">Earned</option>
                <option value="Unpaid">Unpaid</option>
              </select>
              <input className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-teal-500" type="date" name="startDate" value={form.startDate} onChange={handleFormChange} required />
              <input className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-teal-500" type="date" name="endDate" value={form.endDate} onChange={handleFormChange} required />
              <input className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-teal-500 md:col-span-2" type="text" name="reason" placeholder="Reason for leave" value={form.reason} onChange={handleFormChange} minLength={5} required />
              <button disabled={submitting} className="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-700 md:w-fit disabled:opacity-60" type="submit">
                {submitting ? "Submitting..." : "Apply Leave"}
              </button>
            </form>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">My Leave Requests</h2>
            <LeaveTable leaves={leaves} searchable exportable />
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

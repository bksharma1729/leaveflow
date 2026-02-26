import { useEffect, useState } from "react";
import api from "../api/client";
import AnalyticsCharts from "../components/AnalyticsCharts";
import LeaveTable from "../components/LeaveTable";
import Sidebar from "../components/Sidebar";
import SummaryCards from "../components/SummaryCards";
import { useToast } from "../context/ToastContext";

const ManagerDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, leavesRes] = await Promise.all([api.get("/leaves/summary"), api.get("/leaves/review")]);
      setSummary(summaryRes.data.summary);
      setLeaves(leavesRes.data.leaves);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch manager dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (leaveId, status) => {
    const managerComment = window.prompt(`Optional comment for ${status.toLowerCase()} decision:`, "") || "";

    try {
      setBusyId(leaveId);
      await api.patch(`/leaves/${leaveId}/status`, { status, managerComment });
      await fetchData();
      showToast(`Request ${status.toLowerCase()} successfully`, "success");
    } catch (err) {
      const message = err.response?.data?.message || `Unable to ${status.toLowerCase()} request`;
      setError(message);
      showToast(message, "error");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <header className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-900 to-slate-800 p-4 text-white shadow-lg sm:p-6">
            <h1 className="text-xl font-bold sm:text-2xl">Manager Dashboard</h1>
            <p className="mt-1 text-xs text-indigo-100 sm:text-sm">Review pending requests quickly with search, filters, comments, and CSV export.</p>
          </header>

          {error ? <p className="rounded-lg bg-rose-100 p-3 text-sm text-rose-700">{error}</p> : null}
          {loading ? <p className="text-slate-600">Loading dashboard...</p> : <SummaryCards summary={summary} />}
          {!loading ? <AnalyticsCharts summary={summary} leaves={leaves} title="Team Leave Analytics" /> : null}

          <section>
            <h2 className="mb-3 text-lg font-semibold">Leave Requests</h2>
            <LeaveTable
              leaves={leaves}
              showEmployee
              searchable
              exportable
              statusOptions={["All", "Pending", "Approved", "Rejected"]}
              actionRenderer={(leave) => (
                <div className="flex gap-2">
                  <button
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    onClick={() => updateStatus(leave._id, "Approved")}
                    disabled={busyId === leave._id || leave.status !== "Pending"}
                  >
                    Approve
                  </button>
                  <button
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                    onClick={() => updateStatus(leave._id, "Rejected")}
                    disabled={busyId === leave._id || leave.status !== "Pending"}
                  >
                    Reject
                  </button>
                </div>
              )}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;

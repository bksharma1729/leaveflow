import { useCallback, useEffect, useState } from "react";
import api from "../api/client";
import AnalyticsCharts from "../components/AnalyticsCharts";
import LeaveTable from "../components/LeaveTable";
import Sidebar from "../components/Sidebar";
import SummaryCards from "../components/SummaryCards";
import { useToast } from "../context/useToast";

const ManagerDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { showToast } = useToast();

  const fetchReviewLeaves = useCallback(async () => {
    try {
      const pendingRes = await api.get("/leaves/pending");
      return pendingRes.data.leaves || [];
    } catch (err) {
      if (err.response?.status === 404) {
        const reviewRes = await api.get("/leaves/review");
        return reviewRes.data.leaves || [];
      }
      throw err;
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryResult, leavesResult] = await Promise.allSettled([api.get("/leaves/summary"), fetchReviewLeaves()]);

      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value.data.summary);
      } else {
        setSummary(null);
      }

      if (leavesResult.status === "fulfilled") {
        setLeaves(leavesResult.value);
      } else {
        setLeaves([]);
      }

      if (summaryResult.status === "rejected" && leavesResult.status === "rejected") {
        throw summaryResult.reason || leavesResult.reason;
      }

      setLastUpdated(new Date().toLocaleTimeString());
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch manager dashboard");
    } finally {
      setLoading(false);
    }
  }, [fetchReviewLeaves]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(intervalId);
  }, [autoRefresh, fetchData]);

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

          <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm">
            <div className="text-xs text-slate-600 sm:text-sm">
              Last updated: <span className="font-semibold text-slate-800">{lastUpdated || "Never"}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 sm:text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  checked={autoRefresh}
                  onChange={(event) => setAutoRefresh(event.target.checked)}
                />
                Auto-refresh (60s)
              </label>
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
                onClick={fetchData}
              >
                Refresh
              </button>
            </div>
          </section>

          {error ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-rose-100 p-3 text-sm text-rose-700">
              <span>{error}</span>
              <button type="button" className="rounded-md bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-800" onClick={fetchData}>
                Retry
              </button>
            </div>
          ) : null}
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

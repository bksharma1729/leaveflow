import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import AnalyticsCharts from "../components/AnalyticsCharts";
import LeaveTable from "../components/LeaveTable";
import Sidebar from "../components/Sidebar";
import SummaryCards from "../components/SummaryCards";
import { useToast } from "../context/useToast";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [busyOverrideId, setBusyOverrideId] = useState("");
  const { showToast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, usersRes, leavesRes] = await Promise.all([
        api.get("/leaves/summary"),
        api.get("/users"),
        api.get("/leaves"),
      ]);

      setSummary(summaryRes.data.summary);
      setUsers(usersRes.data.users);
      setLeaves(leavesRes.data.leaves);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin panel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const haystack = `${u.name} ${u.email} ${u.role}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [users, query]);

  const updateRole = async (userId, role) => {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      await fetchData();
      showToast("User role updated", "success");
    } catch (err) {
      const message = err.response?.data?.message || "Unable to update role";
      setError(message);
      showToast(message, "error");
    }
  };

  const overrideDecision = async (leave) => {
    const nextStatusInput = window.prompt("Enter new status (Approved or Rejected):", leave.status === "Approved" ? "Rejected" : "Approved");
    if (nextStatusInput === null) {
      return;
    }

    const normalizedStatus = nextStatusInput.trim();
    if (!["Approved", "Rejected"].includes(normalizedStatus)) {
      showToast("Status must be Approved or Rejected", "error");
      return;
    }

    const overrideReasonInput = window.prompt(`Reason for overriding ${leave.status} to ${normalizedStatus}:`, "");
    if (overrideReasonInput === null) {
      return;
    }

    const overrideReason = overrideReasonInput.trim();
    if (!overrideReason) {
      showToast("Override reason is required", "error");
      return;
    }

    try {
      setBusyOverrideId(leave._id);
      await api.put(`/leave/${leave._id}/override`, { status: normalizedStatus, overrideReason });
      await fetchData();
      showToast(`Leave overridden to ${normalizedStatus}`, "success");
    } catch (err) {
      const message = err.response?.data?.message || "Unable to override leave decision";
      setError(message);
      showToast(message, "error");
    } finally {
      setBusyOverrideId("");
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <header className="rounded-2xl border border-violet-100 bg-linear-to-r from-violet-900 to-fuchsia-800 p-4 text-white shadow-lg sm:p-6">
            <h1 className="text-xl font-bold sm:text-2xl">Admin Control Panel</h1>
            <p className="mt-1 text-xs text-violet-100 sm:text-sm">Manage users, assign roles, and export leave records for reporting.</p>
          </header>

          {error ? <p className="rounded-lg bg-rose-100 p-3 text-sm text-rose-700">{error}</p> : null}
          {loading ? <p className="text-slate-600">Loading admin data...</p> : <SummaryCards summary={summary} />}

          <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold">User Management & Role Assignment</h2>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 sm:w-auto"
                placeholder="Search users..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="space-y-3 p-3 md:hidden">
              {filteredUsers.length ? (
                filteredUsers.map((u) => (
                  <article key={u._id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-600">{u.email}</p>
                    <p className="mt-2 text-xs uppercase text-slate-500">Current Role</p>
                    <p className="text-xs font-semibold uppercase text-slate-700">{u.role}</p>
                    <select
                      className="mt-3 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                    >
                      <option value="employee">employee</option>
                      <option value="manager">manager</option>
                      <option value="admin">admin</option>
                    </select>
                  </article>
                ))
              ) : (
                <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                  No matching users.
                </p>
              )}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-160 text-left text-sm lg:min-w-full">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Current Role</th>
                    <th className="px-4 py-3 font-medium">Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr className="border-t border-slate-100" key={u._id}>
                      <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3 uppercase text-slate-700">{u.role}</td>
                      <td className="px-4 py-3">
                        <select
                          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 sm:w-auto"
                          value={u.role}
                          onChange={(e) => updateRole(u._id, e.target.value)}
                        >
                          <option value="employee">employee</option>
                          <option value="manager">manager</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No matching users.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          {!loading ? <AnalyticsCharts summary={summary} leaves={leaves} title="Organization Analytics" /> : null}

          <section>
            <h2 className="mb-3 text-lg font-semibold">All Leave Records</h2>
            <LeaveTable
              leaves={leaves}
              showEmployee
              searchable
              exportable
              actionRenderer={(leave) => {
                const managerDecision =
                  (leave.status === "Approved" || leave.status === "Rejected") &&
                  leave.reviewedBy?.role === "manager";

                if (!managerDecision) {
                  return "-";
                }

                return (
                  <button
                    type="button"
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                    onClick={() => overrideDecision(leave)}
                    disabled={busyOverrideId === leave._id}
                  >
                    {busyOverrideId === leave._id ? "Overriding..." : "Override"}
                  </button>
                );
              }}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

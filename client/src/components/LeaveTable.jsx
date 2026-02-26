import { useMemo, useState } from "react";

const statusClass = {
  Pending: "bg-amber-100 text-amber-800 border border-amber-200",
  Approved: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Rejected: "bg-rose-100 text-rose-800 border border-rose-200",
};

const exportCsv = (rows, showEmployee) => {
  const headers = [
    ...(showEmployee ? ["Employee Name", "Employee Email"] : []),
    "Type",
    "Start Date",
    "End Date",
    "Reason",
    "Status",
  ];

  const csvRows = rows.map((leave) => [
    ...(showEmployee ? [leave.employee?.name || "", leave.employee?.email || ""] : []),
    leave.type,
    new Date(leave.startDate).toLocaleDateString(),
    new Date(leave.endDate).toLocaleDateString(),
    leave.reason,
    leave.status,
  ]);

  const csvContent = [headers, ...csvRows]
    .map((line) => line.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `leave-records-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const LeaveTable = ({
  leaves,
  showEmployee = false,
  actionRenderer = null,
  searchable = true,
  exportable = false,
  statusOptions = ["All", "Pending", "Approved", "Rejected"],
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(statusOptions[0] || "All");

  const filteredLeaves = useMemo(() => {
    return (leaves || []).filter((leave) => {
      const statusOk =
        !statusFilter ||
        statusFilter === "All" ||
        leave.status === statusFilter;
      const haystack = [
        leave.type,
        leave.reason,
        leave.status,
        leave.employee?.name,
        leave.employee?.email,
      ]
        .join(" ")
        .toLowerCase();

      const searchOk = !search.trim() || haystack.includes(search.trim().toLowerCase());
      return statusOk && searchOk;
    });
  }, [leaves, search, statusFilter]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur">
      {(searchable || exportable) && (
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {searchable ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <input
                className="w-full min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400 sm:min-w-56"
                placeholder="Search by reason, type, status..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {statusOptions.length > 1 ? (
                <select
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400 sm:w-auto"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "All" ? "All Status" : option}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          ) : (
            <div />
          )}

          {exportable ? (
            <button
              type="button"
              onClick={() => exportCsv(filteredLeaves, showEmployee)}
              className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 sm:w-auto"
            >
              Export CSV
            </button>
          ) : null}
        </div>
      )}

      <div className="md:hidden space-y-3 p-3">
        {filteredLeaves.length ? (
          filteredLeaves.map((leave) => (
            <article key={leave._id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              {showEmployee ? (
                <div className="mb-2">
                  <p className="text-sm font-semibold text-slate-800">{leave.employee?.name}</p>
                  <p className="text-xs text-slate-500">{leave.employee?.email}</p>
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-500">Type</p>
                  <p className="font-medium text-slate-800">{leave.type}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusClass[leave.status]}`}>
                    {leave.status}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">Dates</p>
              <p className="text-xs text-slate-700">
                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
              </p>
              <p className="mt-2 text-xs text-slate-500">Reason</p>
              <p className="text-xs text-slate-700">{leave.reason}</p>
              <div className="mt-3 flex flex-wrap gap-2">{actionRenderer ? actionRenderer(leave) : null}</div>
            </article>
          ))
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No leave records found.
          </p>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-[720px] text-left text-sm lg:min-w-full">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {showEmployee && <th className="px-4 py-3 font-medium">Employee</th>}
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.length ? (
              filteredLeaves.map((leave) => (
                <tr key={leave._id} className="border-t border-slate-100 align-top">
                  {showEmployee && (
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{leave.employee?.name}</p>
                      <p className="text-xs text-slate-500">{leave.employee?.email}</p>
                    </td>
                  )}
                  <td className="px-4 py-3 font-medium text-slate-700">{leave.type}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="max-w-md px-4 py-3 text-slate-600" title={leave.reason}>
                    {leave.reason}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[leave.status]}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">{actionRenderer ? actionRenderer(leave) : "-"}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={showEmployee ? 6 : 5}>
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTable;

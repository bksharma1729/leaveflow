import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linksByRole = {
  employee: [{ to: "/employee", label: "My Dashboard" }],
  manager: [{ to: "/manager", label: "Review Requests" }],
  admin: [{ to: "/admin", label: "Control Panel" }],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <aside className="w-full rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur md:h-[calc(100vh-2rem)] md:w-72 md:rounded-3xl md:sticky md:top-4 md:flex md:flex-col md:p-5">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 md:mb-6 md:block md:pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700 sm:text-xs">Leave Management</p>
          <p className="mt-2 text-base font-bold text-slate-900 sm:text-lg">{user?.name}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 sm:text-xs">{user?.role}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div className={`${open ? "block" : "hidden"} space-y-4 md:block`}>
        <nav className="flex flex-wrap gap-2 md:block md:space-y-2">
          {(linksByRole[user?.role] || []).map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-3 py-2 text-sm font-medium transition md:py-2.5 ${
                  active ? "bg-teal-700 text-white shadow" : "bg-slate-100/80 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden rounded-xl bg-gradient-to-br from-teal-900 to-teal-700 p-4 text-white md:block">
          <p className="text-sm font-semibold">Quick Tip</p>
          <p className="mt-1 text-xs text-teal-100">Use filters and CSV export to review leave patterns faster.</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full rounded-xl border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 md:mt-auto"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

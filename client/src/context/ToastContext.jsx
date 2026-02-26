import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./toast-context";
let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info") => {
    idCounter += 1;
    const id = idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-3 top-3 z-50 space-y-2 sm:inset-x-auto sm:right-4 sm:top-4 sm:w-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex w-full items-start justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm shadow-lg backdrop-blur sm:min-w-72 sm:px-4 sm:py-3 ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
                : toast.type === "error"
                  ? "border-rose-200 bg-rose-50/95 text-rose-900"
                  : "border-sky-200 bg-sky-50/95 text-sky-900"
            }`}
          >
            <span className="pr-2">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-md px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-white"
            >
              Close
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur">
        <h1 className="text-2xl font-bold text-slate-900">404 - Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-600">The page you requested does not exist.</p>
        <Link className="mt-4 inline-block text-sm font-semibold text-cyan-700" to="/login">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

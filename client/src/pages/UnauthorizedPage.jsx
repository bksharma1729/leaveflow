const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur">
        <h1 className="text-2xl font-bold text-slate-900">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-600">You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

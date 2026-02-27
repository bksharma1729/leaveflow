import logoMark from "../assets/leaveflow-logo.svg";

const BrandLogo = ({ compact = false, invert = false }) => {
  return (
    <div className="flex items-center gap-3">
      <img src={logoMark} alt="LeaveFlow logo" className="h-9 w-9 rounded-xl shadow-sm" />
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${invert ? "text-cyan-100" : "text-teal-700"}`}>
          LeaveFlow
        </p>
        {!compact ? <p className={`text-sm font-semibold ${invert ? "text-white" : "text-slate-800"}`}>Leave Management</p> : null}
      </div>
    </div>
  );
};

export default BrandLogo;

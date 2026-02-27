import logoMark from "../assets/leaveflow-logo.svg";

const SplashScreen = ({ message = "Initializing LeaveFlow" }) => {
  return (
    <div className="jh-splash flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="jh-glow jh-glow-a" />
      <div className="jh-glow jh-glow-b" />
      <div className="jh-vignette" />

      <div className="jh-content text-center">
        <div className="jh-logo-wrap mx-auto mb-6">
          <img src={logoMark} alt="LeaveFlow logo" className="jh-logo h-16 w-16 rounded-2xl" />
        </div>

        <h1 className="jh-title text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Leave<span className="jh-title-accent">Flow</span>
        </h1>
        <p className="mt-2 text-sm tracking-[0.24em] text-cyan-100/80 uppercase">Smart Leave Experience</p>

        <div className="jh-loader mt-8">
          <span className="jh-loader-bar" />
        </div>
        <p className="mt-4 text-xs tracking-wide text-slate-300">{message}</p>
      </div>
    </div>
  );
};

export default SplashScreen;

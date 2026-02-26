const cardConfig = {
  total: {
    label: "Total Requests",
    className: "from-slate-900 to-slate-700 text-white",
    emoji: "All",
  },
  pending: {
    label: "Pending",
    className: "from-amber-100 to-amber-50 text-amber-900",
    emoji: "Wait",
  },
  approved: {
    label: "Approved",
    className: "from-emerald-100 to-emerald-50 text-emerald-900",
    emoji: "Done",
  },
  rejected: {
    label: "Rejected",
    className: "from-rose-100 to-rose-50 text-rose-900",
    emoji: "No",
  },
};

const SummaryCards = ({ summary }) => {
  const items = [
    { key: "total", value: summary?.total ?? 0 },
    { key: "pending", value: summary?.pending ?? 0 },
    { key: "approved", value: summary?.approved ?? 0 },
    { key: "rejected", value: summary?.rejected ?? 0 },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.key} className={`rounded-2xl bg-gradient-to-br p-4 shadow-sm sm:p-5 ${cardConfig[item.key].className}`}>
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <p className="text-xs font-medium opacity-85 sm:text-sm">{cardConfig[item.key].label}</p>
            <span className="rounded-md bg-white/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
              {cardConfig[item.key].emoji}
            </span>
          </div>
          <p className="text-3xl font-bold leading-none sm:text-4xl">{item.value}</p>
        </article>
      ))}
    </div>
  );
};

export default SummaryCards;

import { useMemo } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const statusColors = {
  pending: "rgba(251, 191, 36, 0.8)",
  approved: "rgba(16, 185, 129, 0.8)",
  rejected: "rgba(244, 63, 94, 0.8)",
};

const AnalyticsCharts = ({ summary, leaves = [], title = "Analytics Overview" }) => {
  const doughnutData = useMemo(
    () => ({
      labels: ["Pending", "Approved", "Rejected"],
      datasets: [
        {
          data: [summary?.pending ?? 0, summary?.approved ?? 0, summary?.rejected ?? 0],
          backgroundColor: [statusColors.pending, statusColors.approved, statusColors.rejected],
          borderColor: ["#f59e0b", "#10b981", "#f43f5e"],
          borderWidth: 1,
        },
      ],
    }),
    [summary]
  );

  const typeDistribution = useMemo(() => {
    const counts = { Sick: 0, Casual: 0, Earned: 0, Unpaid: 0 };
    leaves.forEach((leave) => {
      if (counts[leave.type] !== undefined) counts[leave.type] += 1;
    });

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Requests",
          data: Object.values(counts),
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(168, 85, 247, 0.8)",
            "rgba(20, 184, 166, 0.8)",
            "rgba(249, 115, 22, 0.8)",
          ],
          borderRadius: 8,
        },
      ],
    };
  }, [leaves]);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-5">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-xl border border-slate-100 bg-slate-50/70 p-3 sm:h-72 sm:p-4">
          <p className="mb-2 text-sm font-semibold text-slate-600">Status Breakdown</p>
          <Doughnut data={doughnutData} options={commonOptions} />
        </div>
        <div className="h-64 rounded-xl border border-slate-100 bg-slate-50/70 p-3 sm:h-72 sm:p-4">
          <p className="mb-2 text-sm font-semibold text-slate-600">Leave Type Distribution</p>
          <Bar
            data={typeDistribution}
            options={{
              ...commonOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { precision: 0 },
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default AnalyticsCharts;

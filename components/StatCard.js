// components/StatCard.js
"use client";

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color = "red",
}) {
  const colors = {
    red: "bg-red-500/10 text-red-400",
    blue: "bg-blue-500/10 text-blue-400",
    green: "bg-green-500/10 text-green-400",
    yellow: "bg-yellow-500/10 text-yellow-400",
  };

  return (
    <div className="bg-brand-steel border border-white/5 rounded-2xl p-6 flex items-start gap-4 hover:border-white/10 transition-all duration-200">
      {Icon && (
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}
        >
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-semibold mt-1">{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

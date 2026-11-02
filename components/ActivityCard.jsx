export default function ActivityCard({ activity, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition-all duration-150 active:scale-95 ${
        selected
          ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-200"
          : "border-zinc-200 bg-white hover:border-violet-300"
      }`}
    >
      <span className="text-3xl">{activity.emoji}</span>
      <span
        className={`text-sm font-medium ${
          selected ? "text-violet-700" : "text-zinc-600"
        }`}
      >
        {activity.label}
      </span>
    </button>
  );
}

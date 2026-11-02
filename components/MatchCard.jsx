import { ACTIVITIES } from "@/lib/students";
import Avatar from "@/components/Avatar";

function activityMeta(id) {
  return ACTIVITIES.find((a) => a.id === id) || { emoji: "✨", label: id };
}

// shows just enough info to start a conversation (first name, course, plans)
export default function MatchCard({ match }) {
  if (!match) return null;

  const { student, overlap, sharedActivities, location, score } = match;
  const firstName = student?.name?.split(" ")[0] || "Someone";

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-6 shadow-lg shadow-emerald-100/50">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
        <span className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          Match found
        </span>
      </div>

      <h2 className="text-2xl font-bold text-zinc-900">
        You have {overlap.duration} minutes together!
      </h2>

      <div className="flex items-center gap-4 rounded-2xl bg-white/80 p-4">
        <Avatar name={firstName} seed={student?.id} emoji={student?.emoji} size="lg" />
        <div>
          <p className="text-lg font-semibold text-zinc-900">{firstName}</p>
          {student?.course && (
            <p className="text-sm text-zinc-500">
              {student.course}
              {student.year ? ` · ${student.year}` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-white px-3 py-1.5 font-medium text-zinc-700 shadow-sm">
          🕡 {overlap.start}–{overlap.end}
        </span>
        <span className="rounded-full bg-white px-3 py-1.5 font-medium text-zinc-700 shadow-sm">
          📍 {location}
        </span>
        {sharedActivities.map((id) => {
          const meta = activityMeta(id);
          return (
            <span
              key={id}
              className="rounded-full bg-white px-3 py-1.5 font-medium text-zinc-700 shadow-sm"
            >
              {meta.emoji} {meta.label}
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-zinc-500">{score}/100</span>
      </div>
    </div>
  );
}

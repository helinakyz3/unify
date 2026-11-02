"use client";

// just checks the times look right before the user submits
function isValidRange(from, until) {
  if (!from || !until) return true;
  return until > from;
}

export default function TimePicker({ from, until, onFromChange, onUntilChange }) {
  const invalid = !isValidRange(from, until);

  const inputClass = (hasError) =>
    `rounded-xl border-2 px-4 py-3 text-lg font-semibold text-zinc-800 focus:outline-none ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-zinc-200 focus:border-violet-500"
    }`;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-500">From</span>
          <input
            type="time"
            value={from || ""}
            onChange={(e) => onFromChange(e.target.value)}
            className={inputClass(invalid)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-500">Until</span>
          <input
            type="time"
            value={until || ""}
            onChange={(e) => onUntilChange(e.target.value)}
            className={inputClass(invalid)}
          />
        </label>
      </div>
      {invalid && (
        <p className="text-sm font-medium text-red-500">
          End time must be after start time.
        </p>
      )}
    </div>
  );
}

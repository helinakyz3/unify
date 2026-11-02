"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";

// report/block buttons are just for show here, no backend behind them
export default function MeetupCard({ suggestion, peopleNames = [] }) {
  const [reported, setReported] = useState(false);
  const [blocked, setBlocked] = useState(false);

  if (!suggestion) return null;

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/50">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{suggestion.emoji}</span>
        <div>
          <p className="text-xl font-bold text-zinc-900">{suggestion.activity}</p>
          <p className="text-sm text-zinc-500">
            {suggestion.time} · {suggestion.duration} minutes
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
        📍 {suggestion.location}
        {suggestion.campus ? ` — ${suggestion.campus}` : ""}
      </div>

      {peopleNames.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            People
          </span>
          <div className="flex flex-wrap gap-2">
            {peopleNames.map((person) => {
              const name = typeof person === "string" ? person : person.name;
              const emoji = typeof person === "string" ? undefined : person.emoji;
              return (
                <span
                  key={name}
                  className="flex items-center gap-1.5 rounded-full bg-zinc-100 py-1 pl-1 pr-3 text-sm font-medium text-zinc-700"
                >
                  <Avatar name={name} emoji={emoji} size="sm" />
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-400">
          Conversation starter
        </p>
        <p className="mt-1 text-zinc-700">&ldquo;{suggestion.conversationStarter}&rdquo;</p>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
        🛡️ Meet in a public campus location.
      </div>

      <div className="flex gap-4 border-t border-zinc-100 pt-3 text-xs text-zinc-400">
        <button
          type="button"
          disabled={reported}
          onClick={() => setReported(true)}
          className="hover:text-zinc-600 disabled:opacity-50"
        >
          {reported ? "Reported ✓" : "Report"}
        </button>
        <button
          type="button"
          disabled={blocked}
          onClick={() => setBlocked(true)}
          className="hover:text-zinc-600 disabled:opacity-50"
        >
          {blocked ? "Blocked ✓" : "Block"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TimePicker from "@/components/TimePicker";
import ActivityCard from "@/components/ActivityCard";
import Button from "@/components/Button";
import { ACTIVITIES, LOCATIONS } from "@/lib/students";
import { isValidAvailability } from "@/lib/matching";
import { saveSession } from "@/lib/session";
import { AVATAR_EMOJIS } from "@/lib/avatar";

const MODE_DESTINATIONS = {
  match: "/match",
  pulse: "/pulse",
  groups: "/groups",
};

export default function AvailabilityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [from, setFrom] = useState("18:00");
  const [until, setUntil] = useState("20:00");
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [activities, setActivities] = useState([]);
  const [emoji, setEmoji] = useState(AVATAR_EMOJIS[0]);
  const [error, setError] = useState("");

  function toggleActivity(id) {
    setActivities((current) =>
      current.includes(id) ? current.filter((a) => a !== id) : [...current, id]
    );
  }

  function handleSubmit() {
    const currentUser = { id: 0, name: "You", freeFrom: from, freeUntil: until, location, activities, emoji };

    if (!isValidAvailability(currentUser)) {
      setError("End time must be after start time.");
      return;
    }
    if (activities.length === 0) {
      setError("Pick at least one activity.");
      return;
    }

    setError("");
    saveSession({ currentUser });
    router.push(MODE_DESTINATIONS[mode] || "/match");
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900">When are you free?</h1>
          <p className="mt-1 text-sm text-zinc-500">
            We&apos;ll find someone free at the same time.
          </p>
        </div>

        <TimePicker from={from} until={until} onFromChange={setFrom} onUntilChange={setUntil} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="text-sm font-medium text-zinc-500">
            Where are you?
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-xl border-2 border-zinc-200 px-4 py-3 text-base font-medium text-zinc-800 focus:border-violet-500 focus:outline-none"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-500">What do you want to do?</span>
          <div className="grid grid-cols-3 gap-3">
            {ACTIVITIES.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                selected={activities.includes(activity.id)}
                onClick={() => toggleActivity(activity.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-500">
            Profilin için bir simge seç (gerçek fotoğraf değil — kimliğini açığa çıkarmaz)
          </span>
          <div className="grid grid-cols-5 gap-2">
            {AVATAR_EMOJIS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setEmoji(option)}
                className={`flex items-center justify-center rounded-xl border-2 py-2 text-xl transition ${
                  emoji === option
                    ? "border-violet-500 bg-violet-50"
                    : "border-zinc-200 bg-white hover:border-violet-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-center text-sm font-medium text-red-500">{error}</p>}

        <Button onClick={handleSubmit}>Find My Match →</Button>
      </div>
    </main>
  );
}

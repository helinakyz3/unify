"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActivityCard from "@/components/ActivityCard";
import Button from "@/components/Button";
import { ACTIVITIES } from "@/lib/students";
import { loadSession, saveSession } from "@/lib/session";

export default function ActivityPage() {
  const router = useRouter();
  const [match, setMatch] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const session = loadSession();
    if (!session.match) {
      router.replace("/match");
      return;
    }
    setMatch(session.match);
  }, [router]);

  if (!match) return null;

  // only show activities both people picked
  const options = ACTIVITIES.filter((a) => match.sharedActivities.includes(a.id));

  function confirm(activityId) {
    saveSession({ activityId });
    router.push("/meetup");
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900">What should you do?</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Pick from what you both already said you&apos;re up for.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {options.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              selected={selected === activity.id}
              onClick={() => setSelected(activity.id)}
            />
          ))}
        </div>

        <Button disabled={!selected} onClick={() => confirm(selected)}>
          Plan meetup →
        </Button>

        <Button variant="ghost" onClick={() => confirm(null)}>
          ✨ Surprise Us
        </Button>
      </div>
    </main>
  );
}

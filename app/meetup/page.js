"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MeetupCard from "@/components/MeetupCard";
import Button from "@/components/Button";
import SafetyPanel from "@/components/SafetyPanel";
import { getAIMeetupSuggestion } from "@/lib/ai";
import { ACTIVITIES } from "@/lib/students";
import { loadSession, saveSession, clearSession } from "@/lib/session";

export default function MeetupPage() {
  const router = useRouter();
  const [suggestion, setSuggestion] = useState(null);
  const [peopleNames, setPeopleNames] = useState([]);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    const { match, activityId, currentUser } = loadSession();

    if (!match) {
      router.replace("/match");
      return;
    }

    const names = [
      { id: currentUser?.id ?? 0, name: currentUser?.name || "You", emoji: currentUser?.emoji },
      { id: match.student.id, name: match.student.name.split(" ")[0], emoji: match.student.emoji },
    ];
    setPeopleNames(names);

    getAIMeetupSuggestion(match, activityId).then((result) => {
      setSuggestion(result);
      const matchedActivity = ACTIVITIES.find((a) => a.label === result.activity);
      saveSession({
        connection: {
          type: "match",
          activityId: matchedActivity?.id || "coffee",
          location: result.location,
          time: result.time,
          members: names,
        },
      });
    });
  }, [router]);

  if (!suggestion) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-zinc-400">✨ UniFy is planning your meetup…</p>
      </main>
    );
  }

  if (checkedIn) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <div className="flex w-full max-w-xs justify-end">
          <SafetyPanel
            snapshot={{
              partnerName: peopleNames[1]?.name,
              activity: suggestion.activity,
              location: suggestion.campus ? `${suggestion.location} — ${suggestion.campus}` : suggestion.location,
              time: suggestion.time,
            }}
            onLeave={() => {
              clearSession();
              router.push("/");
            }}
          />
        </div>
        <span className="text-5xl">👋</span>
        <h1 className="text-xl font-bold text-zinc-900">Have a great meetup!</h1>
        <p className="text-sm text-zinc-500">Enjoy {suggestion.activity.toLowerCase()} together.</p>
        <div className="mt-2 w-full max-w-xs">
          <Button
            variant="secondary"
            onClick={() => {
              clearSession();
              router.push("/");
            }}
          >
            Start over
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Your meetup</h1>
        </div>

        <MeetupCard suggestion={suggestion} peopleNames={peopleNames} />

        <Button variant="secondary" onClick={() => router.push("/chat")}>
          Message 💬
        </Button>

        <Button onClick={() => setCheckedIn(true)}>I&apos;m Here 👋</Button>
      </div>
    </main>
  );
}

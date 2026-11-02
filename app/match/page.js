"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MatchCard from "@/components/MatchCard";
import Button from "@/components/Button";
import { students } from "@/lib/students";
import { findBestMatch } from "@/lib/matching";
import { loadSession, saveSession } from "@/lib/session";

export default function MatchPage() {
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading | found | none
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const { currentUser } = loadSession();

    if (!currentUser) {
      router.replace("/availability");
      return;
    }

    const result = findBestMatch(currentUser, students);
    saveSession({ match: result });
    setMatch(result);
    setStatus(result ? "found" : "none");
  }, [router]);

  if (status === "loading") {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-zinc-400">Finding your match…</p>
      </main>
    );
  }

  if (status === "none") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <span className="text-4xl">😕</span>
        <h1 className="text-xl font-bold text-zinc-900">No match right now</h1>
        <p className="max-w-xs text-sm text-zinc-500">
          Nobody shares your time, activity, and campus just yet. Try widening
          your availability or picking another activity.
        </p>
        <div className="w-full max-w-xs">
          <Button variant="secondary" onClick={() => router.push("/availability")}>
            ← Adjust availability
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col gap-8">
        <MatchCard match={match} />
        <Button onClick={() => router.push("/activity")}>Plan Our Meetup →</Button>
      </div>
    </main>
  );
}

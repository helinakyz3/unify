"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TabBar from "@/components/TabBar";
import { students, ACTIVITIES } from "@/lib/students";
import { getPulseStats } from "@/lib/social";
import { loadSession } from "@/lib/session";

export default function PulsePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const { currentUser: user } = loadSession();
    if (!user) {
      router.replace("/availability?mode=pulse");
      return;
    }
    setCurrentUser(user);
    setStats(getPulseStats(students, user.location));
  }, [router]);

  if (!stats) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-zinc-400">Checking the pulse…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-8 pb-28">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900">UniFy Pulse</h1>
          <p className="mt-1 text-sm text-zinc-500">
            What&apos;s happening right now at {currentUser.location}.
          </p>
        </div>

        {stats.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            Nobody&apos;s doing anything here yet — check back soon.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {stats.map((stat) => {
              const meta = ACTIVITIES.find((a) => a.id === stat.activityId);
              return (
                <Link
                  key={stat.activityId}
                  href={`/pulse/${stat.activityId}`}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meta?.emoji || "✨"}</span>
                    <span className="font-medium text-zinc-800">{meta?.label || stat.activityId}</span>
                  </div>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                    {stat.count} {stat.count === 1 ? "person" : "people"}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <TabBar />
    </main>
  );
}

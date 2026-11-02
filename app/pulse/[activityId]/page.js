"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import TabBar from "@/components/TabBar";
import { students, ACTIVITIES } from "@/lib/students";
import { findActivityPeers } from "@/lib/social";
import { loadSession, saveSession } from "@/lib/session";

export default function PulseActivityPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params?.activityId;
  const [currentUser, setCurrentUser] = useState(null);
  const [peers, setPeers] = useState(null);

  useEffect(() => {
    const { currentUser: user } = loadSession();
    if (!user) {
      router.replace("/availability?mode=pulse");
      return;
    }
    setCurrentUser(user);
    setPeers(findActivityPeers(user, students, activityId));
  }, [router, activityId]);

  const meta = ACTIVITIES.find((a) => a.id === activityId);

  if (!peers) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-zinc-400">Checking the pulse…</p>
      </main>
    );
  }

  function sayHi(peer) {
    saveSession({
      connection: {
        type: "pulse",
        activityId,
        location: currentUser.location,
        time: null,
        members: [
          { id: currentUser.id ?? 0, name: currentUser.name || "You", emoji: currentUser.emoji },
          { id: peer.id, name: peer.name, emoji: peer.emoji },
        ],
      },
    });
    router.push("/chat");
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-8 pb-28">
      <div className="flex w-full max-w-md flex-col gap-8">
        <Link href="/pulse" className="text-sm font-medium text-zinc-400 hover:text-zinc-600">
          ← Pulse
        </Link>

        <div className="text-center">
          <span className="text-4xl">{meta?.emoji || "✨"}</span>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900">
            {meta?.label || "Activity"} at {currentUser?.location}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {peers.length} {peers.length === 1 ? "person is" : "people are"} up for it right now.
          </p>
        </div>

        {peers.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            Nobody&apos;s free for this right now — check back soon.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {peers.map((peer) => (
              <div
                key={peer.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={peer.name} seed={peer.id} emoji={peer.emoji} />
                  <div>
                    <p className="font-semibold text-zinc-900">{peer.name}</p>
                    {peer.course && <p className="text-sm text-zinc-500">{peer.course}</p>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => sayHi(peer)}
                  className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Say hi
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </main>
  );
}

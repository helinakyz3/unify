"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import ActivityCard from "@/components/ActivityCard";
import Button from "@/components/Button";
import TabBar from "@/components/TabBar";
import { students, ACTIVITIES } from "@/lib/students";
import { formSmallGroup } from "@/lib/social";
import { loadSession, saveSession } from "@/lib/session";

export default function GroupsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [selected, setSelected] = useState(null);
  const [group, setGroup] = useState(undefined); // undefined = not searched, null = no group found

  useEffect(() => {
    const { currentUser: user } = loadSession();
    if (!user) {
      router.replace("/availability?mode=groups");
      return;
    }
    setCurrentUser(user);
  }, [router]);

  if (!currentUser) return null;

  const options = ACTIVITIES.filter((a) => currentUser.activities.includes(a.id));

  function pickActivity(activityId) {
    setSelected(activityId);
    setGroup(formSmallGroup(currentUser, students, activityId));
  }

  function startGroupChat() {
    saveSession({
      connection: {
        type: "group",
        activityId: group.activityId,
        location: group.location,
        time: null,
        members: group.members.map((m) => ({ id: m.id, name: m.name, emoji: m.emoji })),
      },
    });
    router.push("/chat");
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-8 pb-28">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Small Groups</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Pick an activity to find 2–4 people at {currentUser.location}.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {options.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              selected={selected === activity.id}
              onClick={() => pickActivity(activity.id)}
            />
          ))}
        </div>

        {selected && group === null && (
          <p className="text-center text-sm text-zinc-500">
            Not enough people free for this right now — try another activity.
          </p>
        )}

        {group && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Your group
            </span>
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              {group.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar name={member.name} seed={member.id} emoji={member.emoji} size="sm" />
                  <span className="font-medium text-zinc-800">{member.name}</span>
                </div>
              ))}
            </div>
            <Button onClick={startGroupChat}>Start Group Chat →</Button>
          </div>
        )}
      </div>

      <TabBar />
    </main>
  );
}

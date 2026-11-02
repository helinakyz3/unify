"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import TabBar from "@/components/TabBar";
import { loadSession } from "@/lib/session";
import { students } from "@/lib/students";
import { getPulseStats } from "@/lib/social";
import { CAMPUS_EVENTS } from "@/lib/events";
import { CAMPUS_SECURITY_CONTACT } from "@/lib/safety";

const FEATURES = [
  {
    mode: "match",
    emoji: "💫",
    title: "Find a Match",
    desc: "One person, free at the same time as you.",
  },
  {
    mode: "pulse",
    emoji: "📡",
    title: "UniFy Pulse",
    desc: "See what's happening near you right now.",
  },
  {
    mode: "groups",
    emoji: "👥",
    title: "Small Groups",
    desc: "Join 2–4 people doing the same thing.",
  },
];

export default function DiscoverPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [hasMatch, setHasMatch] = useState(false);
  const [activeNearby, setActiveNearby] = useState(0);
  const [safetyOpen, setSafetyOpen] = useState(false);

  useEffect(() => {
    const { currentUser: user, match } = loadSession();
    setCurrentUser(user || null);
    setHasMatch(Boolean(match));
    if (user) {
      const stats = getPulseStats(students, user.location);
      setActiveNearby(stats.reduce((sum, s) => sum + s.count, 0));
    }
  }, []);

  const hasProfile = Boolean(currentUser);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-8 pb-28">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={currentUser?.name || "You"} emoji={currentUser?.emoji} size="lg" />
            <div>
              <p className="text-sm text-zinc-500">Merhaba,</p>
              <p className="text-lg font-bold text-zinc-900">{currentUser?.name || "misafir"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSafetyOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            🛡️ Güvenlik
          </button>
        </div>

        {hasProfile && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <p className="text-2xl font-bold text-violet-700">{activeNearby}</p>
              <p className="text-xs text-zinc-500">{currentUser.location}&apos;da şu an aktif</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <p className="text-2xl font-bold text-violet-700">{hasMatch ? "1" : "0"}</p>
              <p className="text-xs text-zinc-500">aktif eşleşmen</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Kampüs Etkinlikleri
          </span>
          <div className="flex flex-col gap-2">
            {CAMPUS_EVENTS.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3"
              >
                <span className="text-2xl">{event.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-zinc-900">{event.title}</p>
                  <p className="text-xs text-zinc-500">
                    {event.club} · 📍 {event.location} · {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Ne yapmak istersin?
          </span>
          {FEATURES.map((feature) => (
            <Link
              key={feature.mode}
              href={hasProfile ? `/${feature.mode}` : `/availability?mode=${feature.mode}`}
              className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md active:scale-[0.98]"
            >
              <span className="text-3xl">{feature.emoji}</span>
              <div>
                <p className="font-semibold text-zinc-900">{feature.title}</p>
                <p className="text-sm text-zinc-500">{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {safetyOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="flex w-full max-w-sm flex-col gap-3 rounded-3xl bg-white p-6 text-left shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">Güvenlik</h2>
              <button
                type="button"
                onClick={() => setSafetyOpen(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-zinc-600">
              UniFy sadece ilk ad, bölüm ve güvenli kampüs binalarını gösterir — gerçek fotoğraf,
              GPS konumu ya da telefon numarası asla paylaşılmaz.
            </p>
            <ul className="flex flex-col gap-2 text-sm text-zinc-700">
              <li>✅ Her buluşma önerisi herkese açık, kampüs içi bir yerde.</li>
              <li>✅ Her sohbette anında Şikayet Et / Engelle seçeneği var.</li>
              <li>✅ Buluşma sırasında Safety Check-In zamanlayıcısı kullanabilirsin.</li>
            </ul>
            <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
              📞 {CAMPUS_SECURITY_CONTACT.label}: {CAMPUS_SECURITY_CONTACT.contact}
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </main>
  );
}

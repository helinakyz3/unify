"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import TabBar from "@/components/TabBar";
import { AVATAR_EMOJIS } from "@/lib/avatar";
import { ACTIVITIES } from "@/lib/students";
import { CLUBS } from "@/lib/events";
import { CAMPUS_SECURITY_CONTACT } from "@/lib/safety";
import { loadSession, saveSession } from "@/lib/session";

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const { currentUser: user, clubs: savedClubs } = loadSession();
    if (!user) {
      router.replace("/availability?mode=match");
      return;
    }
    setCurrentUser(user);
    setClubs(Array.isArray(savedClubs) ? savedClubs : []);
  }, [router]);

  if (!currentUser) return null;

  function pickEmoji(emoji) {
    const updated = { ...currentUser, emoji };
    setCurrentUser(updated);
    saveSession({ currentUser: updated });
  }

  function toggleClub(club) {
    const next = clubs.includes(club) ? clubs.filter((c) => c !== club) : [...clubs, club];
    setClubs(next);
    saveSession({ clubs: next });
  }

  const activityLabels = ACTIVITIES.filter((a) => currentUser.activities?.includes(a.id));

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-8 pb-28">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar name={currentUser.name} emoji={currentUser.emoji} size="lg" />
          <div>
            <p className="text-lg font-bold text-zinc-900">{currentUser.name}</p>
            <p className="text-sm text-zinc-500">
              📍 {currentUser.location} · {currentUser.freeFrom}–{currentUser.freeUntil}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Profil simgen
          </span>
          <div className="grid grid-cols-5 gap-2">
            {AVATAR_EMOJIS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => pickEmoji(option)}
                className={`flex items-center justify-center rounded-xl border-2 py-2 text-xl transition ${
                  currentUser.emoji === option
                    ? "border-violet-500 bg-violet-50"
                    : "border-zinc-200 bg-white hover:border-violet-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-400">Gerçek fotoğraf değil — sadece anonim bir simge.</p>
        </div>

        {activityLabels.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              İlgi alanların
            </span>
            <div className="flex flex-wrap gap-2">
              {activityLabels.map((a) => (
                <span
                  key={a.id}
                  className="rounded-full bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700"
                >
                  {a.emoji} {a.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Topluluklarım
          </span>
          <div className="flex flex-col gap-2">
            {CLUBS.map((club) => {
              const joined = clubs.includes(club);
              return (
                <button
                  key={club}
                  type="button"
                  onClick={() => toggleClub(club)}
                  className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
                    joined
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-violet-300"
                  }`}
                >
                  {club}
                  <span>{joined ? "Üyesin ✓" : "Katıl"}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <span className="text-sm font-semibold text-emerald-700">🛡️ Güvenlik</span>
          <p className="text-xs text-emerald-700">
            Her sohbette Şikayet Et / Engelle seçeneği var. Gerçek fotoğraf, GPS konumu veya telefon
            numarası hiçbir zaman paylaşılmaz.
          </p>
          <p className="text-xs text-emerald-700">
            📞 {CAMPUS_SECURITY_CONTACT.label}: {CAMPUS_SECURITY_CONTACT.contact}
          </p>
        </div>
      </div>

      <TabBar />
    </main>
  );
}

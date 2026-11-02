"use client";

// safety panel for a meetup — leave, block, report, share
// just a demo, buttons don't call a real backend

import { useEffect, useRef, useState } from "react";
import { SAFETY_TIMER_OPTIONS, CAMPUS_SECURITY_CONTACT, buildSafetySnapshot } from "@/lib/safety";

export default function SafetyPanel({ snapshot, onLeave }) {
  const safe = buildSafetySnapshot(snapshot);
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState("menu"); // "menu" | "notSafe"
  const [timerMinutes, setTimerMinutes] = useState(null);
  const [checkInNote, setCheckInNote] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [reported, setReported] = useState(false);
  const [shared, setShared] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function selectTimer(minutes) {
    setTimerMinutes(minutes);
    clearTimeout(timeoutRef.current);
    if (minutes) {
      timeoutRef.current = setTimeout(() => {
        setCheckInNote("");
        setScreen("menu");
        setOpen(true);
      }, minutes * 60 * 1000);
    }
  }

  function handleCheckIn(choice) {
    if (choice === "notSafe") {
      setScreen("notSafe");
      return;
    }
    if (choice === "checkLater") {
      selectTimer(10);
      setCheckInNote("We'll check in with you again in 10 minutes.");
    } else {
      setCheckInNote("Got it — glad you're okay! 👍");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setScreen("menu");
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-200"
      >
        🛡️ Safety
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-white p-6 text-left shadow-xl">
            {screen === "menu" ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-900">Safety Check-In</h2>
                  <button type="button" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Check in with me every
                  </span>
                  <div className="flex gap-2">
                    {SAFETY_TIMER_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => selectTimer(option.minutes)}
                        className={`flex-1 rounded-xl border-2 px-3 py-2 text-sm font-medium transition ${
                          timerMinutes === option.minutes
                            ? "border-violet-500 bg-violet-50 text-violet-700"
                            : "border-zinc-200 text-zinc-600 hover:border-violet-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-700">Feeling okay?</span>
                  <button
                    type="button"
                    onClick={() => handleCheckIn("good")}
                    className="rounded-xl border-2 border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-800 hover:border-violet-300"
                  >
                    ✅ I&apos;m good
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckIn("checkLater")}
                    className="rounded-xl border-2 border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-800 hover:border-violet-300"
                  >
                    🟡 Check on me in 10 minutes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckIn("notSafe")}
                    className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-700 hover:border-red-300"
                  >
                    🔴 I don&apos;t feel safe
                  </button>
                </div>

                {checkInNote && <p className="text-center text-xs text-zinc-500">{checkInNote}</p>}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-900">You&apos;re not alone</h2>
                  <button
                    type="button"
                    onClick={() => setScreen("menu")}
                    className="text-xs font-medium text-zinc-400 hover:text-zinc-600"
                  >
                    ← Back
                  </button>
                </div>

                <p className="text-sm text-zinc-500">Quick, discreet options — nothing here is shared publicly.</p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={onLeave}
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white"
                  >
                    🚪 Leave Meetup
                  </button>

                  <button
                    type="button"
                    disabled={blocked}
                    onClick={() => setBlocked(true)}
                    className="rounded-xl border-2 border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-800 hover:border-violet-300 disabled:opacity-50"
                  >
                    {blocked ? "Blocked ✓" : "🚫 Block"}
                  </button>

                  <button
                    type="button"
                    disabled={reported}
                    onClick={() => setReported(true)}
                    className="rounded-xl border-2 border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-800 hover:border-violet-300 disabled:opacity-50"
                  >
                    {reported ? "Reported ✓" : "🚩 Report"}
                  </button>

                  <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                    📞 {CAMPUS_SECURITY_CONTACT.label}: {CAMPUS_SECURITY_CONTACT.contact}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShared(true)}
                    className="rounded-xl border-2 border-zinc-200 px-4 py-3 text-left text-sm font-medium text-zinc-800 hover:border-violet-300"
                  >
                    {shared ? "Shared with trusted contact ✓ (demo)" : "📤 Share Meetup Details (demo)"}
                  </button>

                  {shared && (
                    <p className="rounded-xl bg-violet-50 px-4 py-3 text-xs text-violet-700">
                      Demo preview only — with {safe.partnerName} · {safe.activity} · {safe.location} · {safe.time}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

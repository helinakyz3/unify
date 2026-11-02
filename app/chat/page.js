"use client";

// simple chat page, no backend, messages reset when you refresh

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { loadSession } from "@/lib/session";
import { buildOpeningMessages, buildAutoReply } from "@/lib/chat";

export default function ChatPage() {
  const router = useRouter();
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [reported, setReported] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const { connection: conn } = loadSession();
    if (!conn) {
      router.replace("/discover");
      return;
    }
    setConnection(conn);
    setMessages(buildOpeningMessages(conn));
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!connection) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-zinc-400">Loading chat…</p>
      </main>
    );
  }

  const [self, ...others] = connection.members;
  const selfName = self?.name || "You";
  const emojiByName = Object.fromEntries(connection.members.map((m) => [m.name, m.emoji]));

  function send() {
    const text = draft.trim();
    if (!text || blocked) return;
    setMessages((current) => [...current, { from: selfName, text }]);
    setDraft("");
    setTimeout(() => {
      setMessages((current) => [
        ...current,
        { from: others[0]?.name || "Someone", text: buildAutoReply() },
      ]);
    }, 700);
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4">
        <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {others.map((member) => (
                <Avatar
                  key={member.id ?? member.name}
                  name={member.name}
                  seed={member.id}
                  emoji={member.emoji}
                  size="sm"
                />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                {others.map((member) => member.name).join(", ")}
              </p>
              <p className="text-xs text-zinc-400">📍 {connection.location}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/discover")}
            className="text-zinc-400 hover:text-zinc-600"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-2xl bg-white/60 p-3">
          {messages.map((msg, index) => {
            const mine = msg.from === selfName;
            return (
              <div key={index} className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                <Avatar name={msg.from} emoji={emojiByName[msg.from]} size="sm" />
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                    mine ? "bg-violet-600 text-white" : "bg-zinc-100 text-zinc-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {blocked ? (
          <p className="text-center text-xs text-zinc-400">You&apos;ve blocked this conversation.</p>
        ) : (
          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Message…"
              className="flex-1 rounded-full border-2 border-zinc-200 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={send}
              className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Send
            </button>
          </div>
        )}

        <div className="flex justify-center gap-4 border-t border-zinc-100 pt-3 text-xs text-zinc-400">
          <button
            type="button"
            disabled={reported}
            onClick={() => setReported(true)}
            className="hover:text-zinc-600 disabled:opacity-50"
          >
            {reported ? "Reported ✓" : "🚩 Report"}
          </button>
          <button
            type="button"
            disabled={blocked}
            onClick={() => setBlocked(true)}
            className="hover:text-zinc-600 disabled:opacity-50"
          >
            {blocked ? "Blocked ✓" : "🚫 Block"}
          </button>
        </div>
      </div>
    </main>
  );
}

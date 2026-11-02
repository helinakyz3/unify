"use client";

// bottom nav bar, shown on every main page except the chat screen

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/discover", emoji: "🧭", label: "Panel" },
  { href: "/pulse", emoji: "📡", label: "Pulse" },
  { href: "/groups", emoji: "👥", label: "Gruplar" },
  { href: "/chat", emoji: "💬", label: "Mesajlar" },
  { href: "/profile", emoji: "👤", label: "Profil" },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md justify-between px-2 py-2">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs font-medium transition-colors ${
                active ? "text-violet-700" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <span className="text-lg">{tab.emoji}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// simple avatar system, no real photos
// everyone gets a colored circle with their initials (or an emoji)

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-fuchsia-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-teal-500",
];

// turns a name/id into a number, so we can pick a color from it
function hash(seed) {
  const str = String(seed ?? "");
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function avatarColor(seed) {
  return AVATAR_COLORS[hash(seed) % AVATAR_COLORS.length];
}

// emoji options for the profile picture, not a real photo
export const AVATAR_EMOJIS = ["🎓", "🧑‍🎨", "⚽", "📷", "🎮", "🌍", "📚", "🎧", "🎨", "🚲"];

export function initials(name) {
  if (typeof name !== "string" || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

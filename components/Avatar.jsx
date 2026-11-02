import { avatarColor, initials } from "@/lib/avatar";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

const EMOJI_SIZES = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-2xl",
};

// shows initials, or an emoji if the user picked one. not a real photo
export default function Avatar({ name, seed, emoji, size = "md" }) {
  const sizes = emoji ? EMOJI_SIZES : SIZES;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${avatarColor(
        seed ?? name
      )} ${sizes[size] || sizes.md}`}
    >
      {emoji || initials(name)}
    </span>
  );
}

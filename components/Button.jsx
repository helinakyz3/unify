export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-xl hover:shadow-fuchsia-500/30 hover:-translate-y-0.5",
    secondary:
      "bg-white text-violet-700 border-2 border-violet-200 hover:border-violet-400",
    ghost: "bg-violet-50 text-violet-700 hover:bg-violet-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

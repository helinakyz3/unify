import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <span className="rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700">
          For university students
        </span>

        <h1 className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-5xl font-extrabold text-transparent">
          UniFy
        </h1>

        <p className="text-lg font-medium text-zinc-600">
          Match your time, meet your people.
        </p>

        <p className="text-zinc-500">
          Find students who are free when you are and want to do something
          similar.
        </p>

        <Link
          href="/discover"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-fuchsia-500/30 active:scale-[0.98]"
        >
          Get Started →
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold tracking-tight">WristSheet</h1>
        <p className="mt-4 text-lg text-zinc-600">
          Financial modeling, purchase planning, and grey market intelligence
          for watch collectors.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md border border-zinc-300 bg-white px-6 py-3 text-sm font-medium hover:bg-zinc-100"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

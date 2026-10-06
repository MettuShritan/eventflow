import Link from 'next/link';

export default function Unauthorized() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-sm text-indigo-300">403 · Restricted</div>
        <h1 className="mt-3 text-4xl font-black">Access Restricted</h1>
        <p className="mt-4 text-slate-400">
          You are logged in, but your current role does not have permission to access this area.
        </p>
        <Link
          className="mt-8 inline-flex rounded-xl bg-indigo-500 px-5 py-3 font-semibold"
          href="/events"
        >
          Back to Events
        </Link>
      </div>
    </main>
  );
}

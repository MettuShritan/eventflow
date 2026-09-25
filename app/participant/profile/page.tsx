import { getCurrentUser } from "@/lib/auth";
import { Shell } from "@/components/ui";

export default async function P() {
  const u = await getCurrentUser();

  return (
    <Shell role="PARTICIPANT" title="Profile">
      <div className="card max-w-2xl p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {u!.name}
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {u!.email}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Info a="College" b={u!.college || "—"} />
          <Info a="Department" b={u!.department || "—"} />
          <Info a="Year" b={String(u!.year || "—")} />
          <Info a="Role" b={u!.role} />
        </div>
      </div>
    </Shell>
  );
}

function Info({ a, b }: { a: string; b: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
      <small className="text-slate-500 dark:text-slate-400">
        {a}
      </small>

      <p className="font-semibold text-slate-900 dark:text-slate-100">
        {b}
      </p>
    </div>
  );
}
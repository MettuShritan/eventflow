import { Shell } from "@/components/ui";

export default function S() {
  return (
    <Shell role="ADMIN" title="Settings">
      <div className="card max-w-2xl p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          EventFlow
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Version <b className="text-slate-900 dark:text-slate-100">v1.0.0</b>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Database{" "}
            <b className="text-slate-900 dark:text-slate-100">
              PostgreSQL
            </b>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            ORM{" "}
            <b className="text-slate-900 dark:text-slate-100">Prisma</b>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            RBAC{" "}
            <b className="text-slate-900 dark:text-slate-100">
              Server-side
            </b>
          </div>
        </div>
      </div>
    </Shell>
  );
}
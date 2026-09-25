import { prisma } from "@/lib/prisma";
import { Shell } from "@/components/ui";

export default async function A() {
  const ls = await prisma.auditLog.findMany({
    include: { user: true },
    orderBy: { timestamp: "desc" },
    take: 100,
  });

  return (
    <Shell role="ADMIN" title="Audit logs">
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <th className="p-4 text-slate-700 dark:text-slate-300">
                Time
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                User
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                Action
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                Entity
              </th>
            </tr>
          </thead>

          <tbody>
            {ls.map((l) => (
              <tr
                className="border-b border-slate-200 dark:border-slate-700"
                key={l.id}
              >
                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {l.timestamp.toLocaleString()}
                </td>

                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {l.user.email}
                </td>

                <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                  {l.action}
                </td>

                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {l.entity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
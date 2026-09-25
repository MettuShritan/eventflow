import { prisma } from "@/lib/prisma";
import { Shell, Badge } from "@/components/ui";
import CreateUser from "./create-user-form";

export default async function U() {
  const us = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <Shell role="ADMIN" title="Users">
      <CreateUser />

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <th className="p-4 text-slate-700 dark:text-slate-300">
                User
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                Role
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {us.map((u) => (
              <tr
                className="border-b border-slate-200 dark:border-slate-700"
                key={u.id}
              >
                <td className="p-4 text-slate-900 dark:text-slate-100">
                  {u.name}

                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {u.email}
                  </div>
                </td>

                <td className="p-4">
                  <Badge>{u.role}</Badge>
                </td>

                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {u.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
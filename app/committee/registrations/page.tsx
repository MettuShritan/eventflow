import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Shell, Badge } from "@/components/ui";

export default async function R() {
  const u = await getCurrentUser();

  const rs = await prisma.registration.findMany({
    where: {
      event: {
        committees: {
          some: {
            userId: u!.id,
          },
        },
      },
    },
    include: {
      event: true,
      participant: true,
    },
    orderBy: {
      registeredAt: "desc",
    },
  });

  return (
    <Shell role="EVENT_COMMITTEE" title="Registrations">
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <th className="p-4 text-slate-700 dark:text-slate-300">
                Participant
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                Event
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {rs.map((r) => (
              <tr
                className="border-b border-slate-200 dark:border-slate-700"
                key={r.id}
              >
                <td className="p-4 text-slate-900 dark:text-slate-100">
                  {r.participant.name}

                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {r.participant.email}
                  </div>
                </td>

                <td className="p-4 text-slate-900 dark:text-slate-100">
                  {r.event.title}
                </td>

                <td className="p-4">
                  <Badge tone="green">{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
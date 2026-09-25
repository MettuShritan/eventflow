import { prisma } from "@/lib/prisma";
import { Shell } from "@/components/ui";

export default async function R() {
  const rs = await prisma.registration.findMany({
    include: {
      event: true,
      participant: true,
    },
    orderBy: {
      registeredAt: "desc",
    },
  });

  return (
    <Shell role="ADMIN" title="Registrations">
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <th className="p-4 text-slate-700 dark:text-slate-300">
                ID
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                Participant
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                Event
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                Status
              </th>

              <th className="p-4 text-slate-700 dark:text-slate-300">
                Check-in
              </th>
            </tr>
          </thead>

          <tbody>
            {rs.map((r) => (
              <tr
                className="border-b border-slate-200 dark:border-slate-700"
                key={r.id}
              >
                <td className="p-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                  {r.registrationNumber}
                </td>

                <td className="p-4 text-slate-900 dark:text-slate-100">
                  {r.participant.name}
                </td>

                <td className="p-4 text-slate-900 dark:text-slate-100">
                  {r.event.title}
                </td>

                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {r.status}
                </td>

                <td className="p-4 text-slate-700 dark:text-slate-300">
                  {r.checkedIn ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Shell, Stat } from "@/components/ui";

export default async function CommitteePage() {
  const u = await getCurrentUser();

  if (!u) {
    return null;
  }

  const events = await prisma.event.findMany({
    where: {
      committees: {
        some: {
          userId: u.id,
        },
      },
    },
    include: {
      _count: {
        select: {
          registrations: true,
          attendance: true,
        },
      },
    },
  });

  const totalRegistrations = events.reduce(
    (total, event) => total + event._count.registrations,
    0
  );

  const totalAttendance = events.reduce(
    (total, event) => total + event._count.attendance,
    0
  );

  return (
    <Shell role="EVENT_COMMITTEE" title="Operations dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          label="Assigned events"
          value={events.length}
          icon="CalendarDays"
        />

        <Stat
          label="Registrations"
          value={totalRegistrations}
          icon="Users"
        />

        <Stat
          label="Attendance"
          value={totalAttendance}
          icon="ShieldCheck"
        />
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-bold">Assigned events</h2>

        <div className="mt-4 space-y-3">
          {events.map((event) => (
            <div
              className="flex justify-between rounded-xl border p-4"
              key={event.id}
            >
              <div>
                <b>{event.title}</b>
                <p className="text-xs text-slate-500">
                  {event.startDate.toLocaleString()}
                </p>
              </div>

              <span className="text-sm">
                {event._count.registrations}/{event.capacity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
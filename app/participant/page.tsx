import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Shell, Stat, Badge } from "@/components/ui";
import Link from "next/link";

export default async function ParticipantDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const registrations = await prisma.registration.findMany({
    where: { participantId: user.id },
    include: { event: true },
    orderBy: { registeredAt: "desc" },
  });

  const events = await prisma.event.findMany({
    where: {
      startDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  const upcoming = registrations.filter(
    (registration) => registration.event.startDate > new Date()
  ).length;

  const approved = registrations.filter(
    (registration) => registration.status === "APPROVED"
  ).length;

  const registeredEventIds = new Set(
    registrations.map((registration) => registration.eventId)
  );

  return (
    <Shell role="PARTICIPANT" title="Events">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          label="Registrations"
          value={registrations.length}
          icon="ClipboardList"
        />

        <Stat
          label="Upcoming"
          value={upcoming}
          icon="CalendarDays"
        />

        <Stat
          label="Approved"
          value={approved}
          icon="ShieldCheck"
        />
      </div>

      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Upcoming events
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Discover and register for upcoming events.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
              No upcoming events available right now.
            </div>
          ) : (
            events.map((event) => {
              const isRegistered = registeredEventIds.has(event.id);

              return (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-200 p-5 transition hover:shadow-md dark:border-slate-600 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">
                      {event.title}
                    </h3>

                    {isRegistered && (
                      <Badge tone="green">
                        Registered
                      </Badge>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    {event.startDate.toLocaleString()}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                    {event.description}
                  </p>

                  <Link
                    href={`/participant/events/${event.id}`}
                    className="mt-4 inline-flex text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    View event →
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Shell>
  );
}
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Shell, Stat, Badge } from '@/components/ui';
import Link from 'next/link';

export default async function ParticipantDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const registrations = await prisma.registration.findMany({
    where: { participantId: user.id },
    include: { event: true },
    orderBy: { registeredAt: 'desc' },
  });

  const upcoming = registrations.filter(
    (registration) => registration.event.startDate > new Date()
  ).length;

  const approved = registrations.filter(
    (registration) => registration.status === 'APPROVED'
  ).length;

  return (
    <Shell role="PARTICIPANT" title="My dashboard">
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
        <div className="flex justify-between">
          <h2 className="font-bold">My events</h2>

          <Link
            href="/participant/events"
            className="text-sm font-bold text-indigo-600"
          >
            Browse
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {registrations.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
              No registrations yet. Browse events to get started.
            </div>
          ) : (
            registrations.map((registration) => (
              <div
                key={registration.id}
                className="flex justify-between rounded-xl border p-4"
              >
                <div>
                  <b>{registration.event.title}</b>

                  <p className="text-xs text-slate-500">
                    {registration.event.startDate.toLocaleString()}
                  </p>
                </div>

                <Badge
                  tone={
                    registration.status === 'APPROVED'
                      ? 'green'
                      : registration.status === 'REJECTED'
                        ? 'red'
                        : registration.status === 'PENDING'
                          ? 'amber'
                          : 'gray'
                  }
                >
                  {registration.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </Shell>
  );
}
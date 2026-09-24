import { prisma } from '@/lib/prisma';
import { Shell, Stat } from '@/components/ui';

export default async function AdminDashboard() {
  const [users, events, registrations, attendance] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.registration.count(),
    prisma.attendance.count(),
  ]);

  return (
    <Shell role="ADMIN" title="Admin dashboard">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat
          label="Users"
          value={users}
          icon="Users"
        />

        <Stat
          label="Events"
          value={events}
          icon="CalendarDays"
        />

        <Stat
          label="Registrations"
          value={registrations}
          icon="ClipboardList"
        />

        <Stat
          label="Attendance"
          value={attendance}
          icon="ShieldCheck"
        />
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-bold">Platform control</h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Global users, events, registrations, analytics, audit logs and
          the DevOps control center are restricted to administrators.
        </p>
      </div>
    </Shell>
  );
}
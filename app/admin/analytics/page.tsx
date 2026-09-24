import { prisma } from "@/lib/prisma";
import { Shell, Stat } from "@/components/ui";

export default async function AnalyticsPage() {
  const [u, e, r, a] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.registration.count(),
    prisma.attendance.count(),
  ]);

  return (
    <Shell role="ADMIN" title="Analytics">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat
          label="Users"
          value={u}
          icon="Users"
        />

        <Stat
          label="Events"
          value={e}
          icon="CalendarDays"
        />

        <Stat
          label="Registrations"
          value={r}
          icon="ClipboardList"
        />

        <Stat
          label="Attendance rate"
          value={r ? `${Math.round((a / r) * 100)}%` : "0%"}
          icon="ShieldCheck"
        />
      </div>
    </Shell>
  );
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { serializeRegistration } from '@/lib/serializers';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  const [totalUsers, participants, conductors, admins, totalEvents, activeEvents, completedEvents, totalRegistrations, totalAttendance, pendingRegistrations, recentRegistrations] = await Promise.all([
    prisma.user.count(), prisma.user.count({ where: { role: 'PARTICIPANT' } }), prisma.user.count({ where: { role: 'EVENT_CONDUCTOR' } }), prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.event.count(), prisma.event.count({ where: { status: 'PUBLISHED' } }), prisma.event.count({ where: { status: 'COMPLETED' } }), prisma.registration.count(), prisma.attendance.count(), prisma.registration.count({ where: { status: 'PENDING' } }),
    prisma.registration.findMany({ take: 8, orderBy: { registeredAt: 'desc' }, include: { event: true, participant: true } }),
  ]);
  return NextResponse.json({ totals: { totalUsers, participants, conductors, admins, totalEvents, activeEvents, completedEvents, totalRegistrations, totalAttendance, pendingRegistrations }, recentRegistrations: recentRegistrations.map(serializeRegistration) });
}

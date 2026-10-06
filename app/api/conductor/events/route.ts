import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { serializeEvent } from '@/lib/serializers';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'EVENT_CONDUCTOR') return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  const events = await prisma.event.findMany({ where: { conductors: { some: { userId: user.id } } }, include: { _count: { select: { registrations: true } }, creator: true }, orderBy: { startDate: 'asc' } });
  return NextResponse.json(events.map(serializeEvent));
}

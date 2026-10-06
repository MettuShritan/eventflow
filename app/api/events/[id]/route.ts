import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { audit } from '@/lib/audit';
import { eventSchema } from '@/lib/validators';
import { serializeEvent } from '@/lib/serializers';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id }, include: { _count: { select: { registrations: true } }, creator: true } });
  if (!event || event.status === 'DRAFT') return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  return NextResponse.json(serializeEvent(event));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'EVENT_CONDUCTOR'].includes(user.role)) return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  const { id } = await params;
  const existing = await prisma.event.findUnique({ where: { id }, include: { conductors: true } });
  if (!existing) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  if (user.role === 'EVENT_CONDUCTOR' && !existing.conductors.some((x) => x.userId === user.id)) return NextResponse.json({ error: 'You can only manage events assigned to you.' }, { status: 403 });
  try {
    const body = eventSchema.partial().parse(await request.json());
    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.venue !== undefined ? { venue: body.venue } : {}),
        ...(body.startDate !== undefined ? { startDate: new Date(body.startDate) } : {}),
        ...(body.endDate !== undefined ? { endDate: new Date(body.endDate) } : {}),
        ...(body.registrationDeadline !== undefined ? { registrationDeadline: new Date(body.registrationDeadline) } : {}),
        ...(body.capacity !== undefined ? { capacity: body.capacity } : {}),
        ...(body.registrationFee !== undefined ? { registrationFee: body.registrationFee } : {}),
        ...(body.eligibility !== undefined ? { eligibility: body.eligibility } : {}),
        ...(body.banner !== undefined ? { banner: body.banner } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
      },
      include: { _count: { select: { registrations: true } }, creator: true },
    });
    await audit(user.id, 'EVENT_UPDATED', 'Event', id);
    return NextResponse.json(serializeEvent(updated));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid event data' }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'EVENT_CONDUCTOR'].includes(user.role)) return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  const { id } = await params;
  const existing = await prisma.event.findUnique({ where: { id }, include: { conductors: true } });
  if (!existing) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  if (user.role === 'EVENT_CONDUCTOR' && !existing.conductors.some((x) => x.userId === user.id)) return NextResponse.json({ error: 'You can only manage events assigned to you.' }, { status: 403 });
  await prisma.event.delete({ where: { id } });
  await audit(user.id, 'EVENT_DELETED', 'Event', id);
  return NextResponse.json({ ok: true });
}

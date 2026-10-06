import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { eventSchema } from '@/lib/validators';
import { audit } from '@/lib/audit';
import { serializeEvent } from '@/lib/serializers';

export async function GET() {
  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED' },
    include: { _count: { select: { registrations: true } }, creator: true },
    orderBy: { startDate: 'asc' },
  });
  return NextResponse.json(events.map(serializeEvent));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'EVENT_CONDUCTOR'].includes(user.role)) return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  try {
    const body = eventSchema.parse(await request.json());
    const event = await prisma.event.create({
      data: {
        title: body.title,
        category: body.category,
        description: body.description,
        venue: body.venue,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        registrationDeadline: new Date(body.registrationDeadline),
        capacity: body.capacity,
        registrationFee: body.registrationFee,
        eligibility: body.eligibility ?? null,
        banner: body.banner ?? null,
        status: body.status,
        createdBy: user.id,
      },
      include: { _count: { select: { registrations: true } }, creator: true },
    });
    if (user.role === 'EVENT_CONDUCTOR') {
      await prisma.eventConductor.create({ data: { eventId: event.id, userId: user.id } });
    }
    await audit(user.id, 'EVENT_CREATED', 'Event', event.id);
    return NextResponse.json(serializeEvent(event), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid event data' }, { status: 400 });
  }
}

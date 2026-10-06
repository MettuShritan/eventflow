import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { registrationSchema } from '@/lib/validators';
import { audit } from '@/lib/audit';
import { serializeRegistration } from '@/lib/serializers';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const where = user.role === 'PARTICIPANT'
    ? { participantId: user.id }
    : user.role === 'EVENT_CONDUCTOR'
      ? { event: { conductors: { some: { userId: user.id } } } }
      : {};
  const rows = await prisma.registration.findMany({ where, include: { event: true, participant: true }, orderBy: { registeredAt: 'desc' } });
  return NextResponse.json(rows.map(serializeRegistration));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'PARTICIPANT') return NextResponse.json({ error: 'Participants only' }, { status: 403 });
  try {
    const body = registrationSchema.parse(await request.json());
    const event = await prisma.event.findUnique({ where: { id: body.eventId }, include: { _count: { select: { registrations: true } } } });
    if (!event || event.status !== 'PUBLISHED') return NextResponse.json({ error: 'Event unavailable' }, { status: 404 });
    if (new Date() > event.registrationDeadline) return NextResponse.json({ error: 'Registration deadline has passed.' }, { status: 400 });
    if (event._count.registrations >= event.capacity) return NextResponse.json({ error: 'This event is full.' }, { status: 400 });
    const duplicate = await prisma.registration.findUnique({ where: { eventId_participantId: { eventId: event.id, participantId: user.id } } });
    if (duplicate && duplicate.status !== 'CANCELLED') return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 409 });

    const registration = duplicate
      ? await prisma.registration.update({ where: { id: duplicate.id }, data: { status: 'PENDING', fullName: body.fullName, email: body.email, phone: body.phone, college: body.college, department: body.department, year: body.year, additionalInfo: body.additionalInfo ?? null } })
      : await prisma.registration.create({ data: { registrationNumber: `EF-${Date.now().toString(36).toUpperCase()}`, eventId: event.id, participantId: user.id, status: 'PENDING', fullName: body.fullName, email: body.email, phone: body.phone, college: body.college, department: body.department, year: body.year, additionalInfo: body.additionalInfo ?? null } });
    await prisma.notification.create({ data: { userId: user.id, title: 'Registration submitted', message: `Your registration for ${event.title} was submitted.`, type: 'REGISTRATION' } });
    await audit(user.id, 'REGISTRATION_CREATED', 'Registration', registration.id);
    const result = await prisma.registration.findUniqueOrThrow({ where: { id: registration.id }, include: { event: true, participant: true } });
    return NextResponse.json(serializeRegistration(result), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid registration data' }, { status: 400 });
  }
}

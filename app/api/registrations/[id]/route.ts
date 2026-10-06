import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { audit } from '@/lib/audit';
import { serializeRegistration } from '@/lib/serializers';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { id } = await params;
  const current = await prisma.registration.findUnique({ where: { id }, include: { event: { include: { conductors: true } }, participant: true } });
  if (!current) return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
  const body = await request.json();
  const requested = String(body.status || '').toUpperCase();
  if (user.role === 'PARTICIPANT') {
    if (current.participantId !== user.id || requested !== 'CANCELLED') return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  } else if (user.role === 'EVENT_CONDUCTOR') {
    if (!current.event.conductors.some((x) => x.userId === user.id)) return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    if (!['APPROVED', 'REJECTED'].includes(requested)) return NextResponse.json({ error: 'Invalid registration status.' }, { status: 400 });
  } else if (user.role !== 'ADMIN' || !['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(requested)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }
  const updated = await prisma.registration.update({ where: { id }, data: { status: requested as any }, include: { event: true, participant: true } });
  await audit(user.id, `REGISTRATION_${requested}`, 'Registration', id);
  return NextResponse.json(serializeRegistration(updated));
}

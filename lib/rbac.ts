import { NextResponse } from 'next/server';
import type { Role } from '@prisma/client';
import { getCurrentUser } from './auth';

export async function requireUser(roles?: Role[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  if (roles && !roles.includes(user.role)) throw new Error('FORBIDDEN');
  return user;
}

export async function requireOwnership(eventId: string, userId: string) {
  const assignment = await (await import('./prisma')).prisma.eventConductor.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });
  return Boolean(assignment);
}

export function apiAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  return null;
}

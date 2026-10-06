import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, getCurrentUser } from '@/lib/auth';
import { audit } from '@/lib/audit';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, role: true, status: true, college: true, department: true, year: true, createdAt: true } });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.password || !['PARTICIPANT', 'EVENT_CONDUCTOR', 'ADMIN'].includes(body.role)) return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    const email = String(body.email).toLowerCase();
    if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    const created = await prisma.user.create({ data: { name: body.name, email, passwordHash: await hashPassword(body.password), role: body.role, college: body.college || null, department: body.department || null, year: body.year || null } });
    await audit(user.id, 'USER_CREATED', 'User', created.id, { role: created.role });
    return NextResponse.json({ id: created.id, name: created.name, email: created.email, role: created.role }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create user' }, { status: 400 });
  }
}

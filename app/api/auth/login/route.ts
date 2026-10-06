import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, verifyPassword, homeForRole } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || user.status !== 'ACTIVE' || user.role !== body.role || !(await verifyPassword(body.password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email, password, or role.' }, { status: 401 });
    }
    await createSession(user);
    return NextResponse.json({ ok: true, redirect: homeForRole(user.role), role: user.role });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 });
  }
}

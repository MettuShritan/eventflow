import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { participantRegistrationSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = participantRegistrationSchema.parse(await request.json());
    const email = body.email.toLowerCase();
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: 'An account with this email already exists. Please log in instead.' }, { status: 409 });
    await prisma.user.create({
      data: {
        name: body.name,
        email,
        passwordHash: await hashPassword(body.password),
        role: 'PARTICIPANT',
        phone: body.phone,
        college: body.college,
        department: body.department,
        year: body.year,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create account' }, { status: 400 });
  }
}

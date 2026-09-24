import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { audit } from "@/lib/audit";

export async function POST(req: Request) {
  const u = await getCurrentUser();

  if (!u || u.role !== "ADMIN") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const b = await req.json();

  if (
    !b.name ||
    !b.email ||
    !b.password ||
    !["PARTICIPANT", "EVENT_COMMITTEE", "ADMIN"].includes(b.role)
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const email = String(b.email).toLowerCase();

  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: "Email exists" }, { status: 409 });
  }

  const x = await prisma.user.create({
    data: {
      name: b.name,
      email,
      passwordHash: await hashPassword(b.password),
      role: b.role,
    },
  });

  await audit(u.id, "USER_CREATED", "User", x.id, {
    role: x.role,
  });

  return NextResponse.json(x, { status: 201 });
}
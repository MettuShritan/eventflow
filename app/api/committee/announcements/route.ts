import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { audit } from "@/lib/audit";

export async function POST(req: Request) {
  const u = await getCurrentUser();

  if (!u || u.role !== "EVENT_COMMITTEE") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const b = await req.json();

  const assignment = await prisma.eventCommittee.findUnique({
    where: {
      eventId_userId: {
        eventId: b.eventId,
        userId: u.id,
      },
    },
  });

  if (!assignment) {
    return NextResponse.json(
      { error: "Event not assigned" },
      { status: 403 }
    );
  }

  const a = await prisma.announcement.create({
    data: {
      eventId: b.eventId,
      createdBy: u.id,
      title: b.title,
      message: b.message,
    },
  });

  const regs = await prisma.registration.findMany({
    where: { eventId: b.eventId },
    select: { participantId: true },
  });

  if (regs.length) {
    await prisma.notification.createMany({
      data: regs.map((x) => ({
        userId: x.participantId,
        title: b.title,
        message: b.message,
        type: "ANNOUNCEMENT" as const,
      })),
    });
  }

  await audit(
    u.id,
    "ANNOUNCEMENT_CREATED",
    "Announcement",
    a.id
  );

  return NextResponse.json(a, { status: 201 });
}
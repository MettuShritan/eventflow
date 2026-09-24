import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { registrationSchema } from "@/lib/validators";
import { audit } from "@/lib/audit";

export async function GET() {
  const u = await getCurrentUser();

  if (!u) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const where =
    u.role === "PARTICIPANT"
      ? { participantId: u.id }
      : u.role === "EVENT_COMMITTEE"
        ? {
            event: {
              committees: {
                some: {
                  userId: u.id,
                },
              },
            },
          }
        : {};

  const registrations = await prisma.registration.findMany({
    where,
    include: {
      event: true,
      participant: u.role === "PARTICIPANT" ? false : true,
    },
    orderBy: {
      registeredAt: "desc",
    },
  });

  return NextResponse.json(registrations);
}

export async function POST(req: Request) {
  try {
    const u = await getCurrentUser();

    if (!u || u.role !== "PARTICIPANT") {
      return NextResponse.json(
        { error: "Participants only" },
        { status: 403 }
      );
    }

    const b = registrationSchema.parse(await req.json());

    const e = await prisma.event.findUnique({
      where: {
        id: b.eventId,
      },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (!e || e.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Event unavailable" },
        { status: 404 }
      );
    }

    if (
      new Date() > e.registrationDeadline ||
      e._count.registrations >= e.capacity
    ) {
      return NextResponse.json(
        { error: "Registration is closed or event is full" },
        { status: 400 }
      );
    }

    const existing = await prisma.registration.findUnique({
      where: {
        eventId_participantId: {
          eventId: e.id,
          participantId: u.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already registered" },
        { status: 409 }
      );
    }

    const r = await prisma.registration.create({
      data: {
        registrationNumber: `EF-${Date.now()
          .toString(36)
          .toUpperCase()}`,
        eventId: e.id,
        participantId: u.id,
        fullName: b.fullName,
        email: b.email,
        phone: b.phone || null,
        college: b.college || null,
        department: b.department || null,
        year: b.year || null,
        additionalInfo: b.additionalInfo || null,
        status: "APPROVED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: u.id,
        title: "Registration successful",
        message: `You are registered for ${e.title}.`,
        type: "REGISTRATION",
      },
    });

    await audit(
      u.id,
      "REGISTRATION_CREATED",
      "Registration",
      r.id
    );

    return NextResponse.json(r, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Invalid request",
      },
      { status: 400 }
    );
  }
}
import type { Event as PrismaEvent, Registration as PrismaRegistration, User as PrismaUser } from '@prisma/client';

export function serializeEvent(event: PrismaEvent & { _count?: { registrations: number }; creator?: PrismaUser | null }) {
  return {
    id: event.id,
    title: event.title,
    category: event.category,
    description: event.description,
    date: event.startDate.toISOString(),
    time: `${event.startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} - ${event.endDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
    location: event.venue,
    organizer: event.creator?.name ?? 'EventFlow',
    seats: event.capacity,
    registered: event._count?.registrations ?? 0,
    deadline: event.registrationDeadline.toISOString(),
    image: event.banner ?? '/eventflow-event.svg',
    status: event.status,
    eligibility: event.eligibility,
    registrationFee: event.registrationFee,
  };
}

export function serializeRegistration(reg: PrismaRegistration & { event?: PrismaEvent; participant?: PrismaUser | null }) {
  return {
    id: reg.id,
    registrationNumber: reg.registrationNumber,
    eventId: reg.eventId,
    participantId: reg.participantId,
    participantName: reg.fullName,
    email: reg.email,
    phone: reg.phone,
    college: reg.college,
    department: reg.department,
    year: reg.year,
    registeredAt: reg.registeredAt.toISOString(),
    status: reg.status.charAt(0) + reg.status.slice(1).toLowerCase(),
    checkedIn: reg.checkedIn,
    event: reg.event ? {
      id: reg.event.id,
      title: reg.event.title,
      date: reg.event.startDate.toISOString(),
      location: reg.event.venue,
    } : undefined,
  };
}

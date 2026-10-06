import { PrismaClient, Role, UserStatus, EventStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const eventCatalog = [
  ['nex-synapse', 'Nex-Synapse 2026', 'Technology', 'A high-energy innovation hackathon where teams build practical solutions across AI, IoT, cybersecurity and emerging technology.', 'CBIT Innovation Hub, Hyderabad', '2026-10-24T09:00:00+05:30', '2026-10-24T18:00:00+05:30', 250, '2026-10-20T23:59:00+05:30', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'],
  ['ai-workshop', 'AI & Machine Learning Workshop', 'AI/ML', 'Hands-on workshop covering model building, evaluation, prompt engineering and practical ML deployment.', 'Seminar Hall A', '2026-10-08T10:00:00+05:30', '2026-10-08T16:00:00+05:30', 120, '2026-10-05T23:59:00+05:30', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80'],
  ['cyber-summit', 'Cybersecurity Summit', 'Cybersecurity', 'Security talks, capture-the-flag challenges and practical sessions on modern application security.', 'Main Auditorium', '2026-11-14T09:30:00+05:30', '2026-11-14T17:30:00+05:30', 300, '2026-11-10T23:59:00+05:30', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80'],
  ['web-bootcamp', 'Web Development Bootcamp', 'Web Development', 'Build and deploy a production-style web app using React, Next.js, APIs and modern frontend practices.', 'Lab Complex 2', '2026-10-17T09:00:00+05:30', '2026-10-17T17:00:00+05:30', 100, '2026-10-14T23:59:00+05:30', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'],
  ['blockchain-conf', 'Blockchain Conference', 'Blockchain', 'Explore smart contracts, decentralized applications, digital identity and enterprise blockchain.', 'Convention Centre', '2026-12-02T10:00:00+05:30', '2026-12-02T17:00:00+05:30', 180, '2026-11-28T23:59:00+05:30', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80'],
  ['iot-challenge', 'IoT Innovation Challenge', 'IoT', 'Prototype connected systems using sensors, edge computing and real-time dashboards.', 'IoT Makerspace', '2026-11-21T08:30:00+05:30', '2026-11-21T19:00:00+05:30', 150, '2026-11-17T23:59:00+05:30', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'],
  ['photo-workshop', 'Photography Workshop', 'Photography', 'Composition, street photography, editing workflow and visual storytelling with practical shoots.', 'Creative Studio', '2026-10-11T14:00:00+05:30', '2026-10-11T18:00:00+05:30', 80, '2026-10-08T23:59:00+05:30', 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1200&q=80'],
] as const;

async function upsertAccount(emailEnv: string, passwordEnv: string, role: Role, nameEnv: string) {
  const email = process.env[emailEnv]?.trim().toLowerCase();
  const password = process.env[passwordEnv];
  if (!email || !password) return null;
  const name = process.env[nameEnv]?.trim() || (role === Role.ADMIN ? 'EventFlow Admin' : 'Event Conductor');
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role, status: UserStatus.ACTIVE },
    create: { name, email, passwordHash, role, status: UserStatus.ACTIVE },
  });
}

async function main() {
  const admin = await upsertAccount('BOOTSTRAP_ADMIN_EMAIL', 'BOOTSTRAP_ADMIN_PASSWORD', Role.ADMIN, 'BOOTSTRAP_ADMIN_NAME');
  const conductor = await upsertAccount('BOOTSTRAP_CONDUCTOR_EMAIL', 'BOOTSTRAP_CONDUCTOR_PASSWORD', Role.EVENT_CONDUCTOR, 'BOOTSTRAP_CONDUCTOR_NAME');
  const creator = admin ?? conductor;

  for (const [id, title, category, description, venue, start, end, capacity, deadline, banner] of eventCatalog) {
    await prisma.event.upsert({
      where: { id },
      update: { title, category, description, venue, startDate: new Date(start), endDate: new Date(end), registrationDeadline: new Date(deadline), capacity, banner, status: EventStatus.PUBLISHED, createdBy: creator?.id ?? null },
      create: { id, title, category, description, venue, startDate: new Date(start), endDate: new Date(end), registrationDeadline: new Date(deadline), capacity, banner, status: EventStatus.PUBLISHED, createdBy: creator?.id ?? null },
    });
  }

  console.log('EventFlow database bootstrap completed. No participant/registration/pipeline demo records were created.');
}

main().finally(() => prisma.$disconnect());

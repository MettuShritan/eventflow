import Link from 'next/link';
import { ArrowRight, ShieldCheck, GitBranch, Container } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { serializeEvent } from '@/lib/serializers';
import { Page, Button, Stat } from '@/components/ui';
import EventCard from '@/components/EventCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [events, registrations, completedEvents] = await Promise.all([
    prisma.event.findMany({ where: { status: 'PUBLISHED' }, include: { _count: { select: { registrations: true } }, creator: true }, orderBy: { startDate: 'asc' }, take: 3 }),
    prisma.registration.count(),
    prisma.event.count({ where: { status: 'COMPLETED' } }),
  ]);
  const allPublished = await prisma.event.count({ where: { status: 'PUBLISHED' } });
  const serialized = events.map(serializeEvent);
  return <Page>
    <section className="grid-bg relative overflow-hidden rounded-3xl border border-white/10 px-6 py-20 md:px-14">
      <div className="max-w-3xl"><div className="mb-5 inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs text-indigo-200">Secure Event Management Platform</div><h1 className="text-5xl md:text-7xl font-black tracking-tight">Discover.<br/><span className="gradient-text">Register. Experience.</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">EventFlow brings event discovery, registration and administration into one polished workflow with a secure role-based architecture and delivery-ready CI/CD foundation.</p><div className="mt-8 flex flex-wrap gap-3"><Button href="/events">Explore Events <ArrowRight size={17}/></Button><Button href="/login" variant="secondary">Get Started</Button></div></div>
    </section>
    <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"><Stat label="Active Events" value={allPublished}/><Stat label="Registered Participants" value={registrations}/><Stat label="Completed Events" value={completedEvents}/></section>
    <section className="mt-16"><div className="flex items-end justify-between"><div><p className="text-sm text-indigo-300">Featured</p><h2 className="mt-1 text-3xl font-bold">Events worth showing up for</h2></div><Link className="text-sm text-indigo-300" href="/events">View all →</Link></div><div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">{serialized.map(e=><EventCard key={e.id} event={e}/>)}</div>{!serialized.length&&<div className="mt-6 rounded-2xl border border-dashed border-white/10 p-12 text-center text-slate-500">No published events yet.</div>}</section>
    <section className="mt-16 grid md:grid-cols-3 gap-5"><div className="glass rounded-2xl p-6"><GitBranch className="text-indigo-300"/><h3 className="mt-4 font-bold">How it works</h3><p className="mt-2 text-sm text-slate-400">Discover an event, sign in, submit a validated registration and track participation from your role-specific workspace.</p></div><div className="glass rounded-2xl p-6"><ShieldCheck className="text-emerald-300"/><h3 className="mt-4 font-bold">Security by design</h3><p className="mt-2 text-sm text-slate-400">Validation, protected operations, database-backed identities and secret-safe configuration are built into the platform.</p></div><div className="glass rounded-2xl p-6"><Container className="text-purple-300"/><h3 className="mt-4 font-bold">Delivery ready</h3><p className="mt-2 text-sm text-slate-400">PostgreSQL, Prisma, containerization, automated testing and deployment configuration support the DevSecOps workflow.</p></div></section>
  </Page>
}

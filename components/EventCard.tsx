import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { Event } from '@/types';
import { Badge, Button } from './ui';

export default function EventCard({ event }: { event: Event }) {
  const available = event.seats - event.registered;
  return <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[.03] hover:border-indigo-400/30 hover:-translate-y-1 transition">
    <img src={event.image} alt={event.title} className="h-44 w-full object-cover" />
    <div className="p-5">
      <div className="flex justify-between gap-3"><Badge>{event.category}</Badge><span className="text-xs text-slate-500">{available} seats available</span></div>
      <h3 className="mt-3 text-lg font-bold">{event.title}</h3>
      <p className="mt-2 text-sm text-slate-400 line-clamp-2">{event.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400"><span className="flex gap-2"><CalendarDays size={15}/>{new Date(event.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})} · {event.time.split(' - ')[0]}</span><span className="flex gap-2"><MapPin size={15}/>{event.location}</span></div>
      <div className="mt-5 flex gap-2"><Button href={`/events/${event.id}`} variant="secondary">Details</Button><Button href={`/register/${event.id}`} disabled={available<=0}>{available<=0?'Full':'Register'}</Button></div>
    </div>
  </div>
}

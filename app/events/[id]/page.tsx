import { notFound } from 'next/navigation';
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { serializeEvent } from '@/lib/serializers';
import { Page, Button, Badge } from '@/components/ui';
import EventCard from '@/components/EventCard';

export const dynamic = 'force-dynamic';

export default async function Details({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const raw=await prisma.event.findUnique({where:{id},include:{_count:{select:{registrations:true}},creator:true}});
  if(!raw||raw.status!=='PUBLISHED')return notFound();
  const e=serializeEvent(raw);
  const relatedRaw=await prisma.event.findMany({where:{status:'PUBLISHED',id:{not:id}},include:{_count:{select:{registrations:true}},creator:true},orderBy:{startDate:'asc'},take:3});
  const related=relatedRaw.map(serializeEvent);
  const available=e.seats-e.registered;
  return <Page><div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.03]"><img src={e.image} className="h-72 md:h-96 w-full object-cover"/><div className="p-6 md:p-10"><div className="flex flex-wrap items-center gap-3"><Badge>{e.category}</Badge><span className="text-sm text-slate-500">Registration deadline {new Date(e.deadline).toLocaleDateString('en-IN')}</span></div><h1 className="mt-4 text-4xl md:text-5xl font-black">{e.title}</h1><p className="mt-5 max-w-3xl text-slate-400 leading-7">{e.description}</p><div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-3"><Info icon={<CalendarDays/>} label="Date" value={new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}/><Info icon={<Clock/>} label="Time" value={e.time}/><Info icon={<MapPin/>} label="Venue" value={e.location}/><Info icon={<Users/>} label="Seats" value={`${available} remaining`}/></div><div className="mt-8 flex flex-wrap gap-3"><Button href={`/register/${e.id}`} disabled={!available}>Register for event</Button><Button href="/events" variant="secondary">Back to events</Button></div></div></div><section className="mt-14"><h2 className="text-2xl font-bold">Related events</h2><div className="mt-5 grid md:grid-cols-3 gap-5">{related.map(x=><EventCard key={x.id} event={x}/>)}</div></section></Page>
}
function Info({icon,label,value}:{icon:any;label:string;value:string}){return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><div className="text-indigo-300">{icon}</div><div className="mt-3 text-xs text-slate-500">{label}</div><div className="mt-1 text-sm font-semibold">{value}</div></div>}

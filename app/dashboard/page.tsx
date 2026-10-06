'use client';
import { useEffect,useState } from 'react';
import { CalendarDays,Ticket } from 'lucide-react';
import { Page,Stat,Badge,Button } from '@/components/ui';
import RoleGuard from '@/components/RoleGuard';
import type { Registration } from '@/types';

export default function Dashboard(){return <RoleGuard role="participant"><ParticipantDashboard/></RoleGuard>}
function ParticipantDashboard(){
  const [rs,setRs]=useState<Registration[]>([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch('/api/registrations',{cache:'no-store'}).then(r=>r.json()).then(setRs).finally(()=>setLoading(false))},[]);
  const upcoming=rs.filter(r=>r.event&&new Date(r.event.date)>=new Date()).length;
  return <Page><div><p className="text-sm text-indigo-300">Participant</p><h1 className="text-4xl font-black mt-1">My dashboard</h1><p className="mt-2 text-slate-400">Track registrations and participation from your account.</p></div><div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"><Stat label="Total registrations" value={rs.length}/><Stat label="Upcoming" value={upcoming}/><Stat label="Approved" value={rs.filter(r=>r.status==='Approved').length}/><Stat label="Cancelled" value={rs.filter(r=>r.status==='Cancelled').length}/></div><section className="mt-12"><h2 className="text-2xl font-bold">Your registrations</h2>{loading?<div className="mt-5 text-slate-500">Loading...</div>:<div className="mt-5 space-y-3">{rs.map(r=><div key={r.id} className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><div className="flex items-center gap-2"><Ticket size={18} className="text-indigo-300"/><h3 className="font-bold">{r.event?.title||'Event'}</h3><Badge status={r.status}/></div><div className="mt-2 text-sm text-slate-500 flex gap-4"><span className="flex gap-1"><CalendarDays size={15}/>{r.event?.date?new Date(r.event.date).toLocaleDateString('en-IN'):''}</span><span>ID: {r.registrationNumber||r.id}</span></div></div><Button href={`/events/${r.eventId}`} variant="secondary">View event</Button></div>)}{!rs.length&&<div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-500">No registrations yet. Explore events to get started.</div>}</div>}</section></Page>
}

'use client';
import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Page } from '@/components/ui';
import EventCard from '@/components/EventCard';
import type { Event } from '@/types';

export default function Events(){
  const [events,setEvents]=useState<Event[]>([]); const [q,setQ]=useState(''); const [cat,setCat]=useState('All'); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  useEffect(()=>{fetch('/api/events',{cache:'no-store'}).then(async r=>{if(!r.ok)throw new Error((await r.json()).error||'Unable to load events');return r.json()}).then(setEvents).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]);
  const categories=useMemo(()=>['All',...Array.from(new Set(events.map(e=>e.category)))],[events]);
  const filtered=useMemo(()=>events.filter(e=>(cat==='All'||e.category===cat)&&`${e.title} ${e.description} ${e.location} ${e.organizer}`.toLowerCase().includes(q.toLowerCase())),[events,q,cat]);
  return <Page><div><p className="text-sm text-indigo-300">Explore</p><h1 className="mt-1 text-4xl font-black">Find your next event</h1><p className="mt-3 text-slate-400">Browse workshops, hackathons, conferences and club events.</p></div><div className="mt-8 flex flex-col md:flex-row gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-3.5 text-slate-500" size={18}/><input value={q} onChange={e=>setQ(e.target.value)} data-testid="event-search" placeholder="Search events, venues, organizers..." className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 outline-none focus:border-indigo-400/50"/></div><div className="flex items-center gap-2"><SlidersHorizontal size={18} className="text-slate-500"/><select value={cat} onChange={e=>setCat(e.target.value)} className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none">{categories.map(c=><option key={c}>{c}</option>)}</select></div></div>{loading?<div className="mt-12 text-center text-slate-500">Loading events...</div>:error?<div className="mt-12 rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-200">{error}</div>:<><div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">{filtered.map(e=><EventCard key={e.id} event={e}/>)}</div>{!filtered.length&&<div className="mt-10 text-center py-20 text-slate-500">No events match your search.</div>}</>}</Page>
}

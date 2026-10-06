'use client';
import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Page,Button,Toast } from '@/components/ui';
import RoleGuard from '@/components/RoleGuard';
import { api } from '@/lib/client-api';
import type { Event, Registration } from '@/types';

const schema=z.object({name:z.string().min(2).max(80),email:z.string().email(),phone:z.string().regex(/^[6-9]\d{9}$/,'Enter a valid 10-digit Indian mobile number'),college:z.string().min(2).max(120),department:z.string().min(2).max(80),year:z.string().min(1),additionalInfo:z.string().max(1000).optional(),terms:z.literal(true,{errorMap:()=>({message:'Accept the terms to continue.'})})});
type Form=z.infer<typeof schema>;
export default function Register({params}:{params:Promise<{id:string}>}){
  return <RoleGuard role="participant"><RegisterInner params={params}/></RoleGuard>;
}

function RegisterInner({params}:{params:Promise<{id:string}>}){
  const router=useRouter(); const [id,setId]=useState(''); const [event,setEvent]=useState<Event|null>(null); const [error,setError]=useState(''); const [loadingEvent,setLoadingEvent]=useState(true);
  useEffect(()=>{params.then(({id})=>{setId(id);return fetch(`/api/events/${id}`,{cache:'no-store'})}).then(async(r)=>{if(!r||!r.ok)throw new Error('Event not found');return r.json()}).then(setEvent).catch(e=>setError(e.message)).finally(()=>setLoadingEvent(false))},[params]);
  const {register,handleSubmit,formState:{errors,isSubmitting}}=useForm<Form>({resolver:zodResolver(schema)});
  const onSubmit=async(d:Form)=>{setError('');try{const r=await api<Registration>('/api/registrations',{method:'POST',body:JSON.stringify({eventId:id,fullName:d.name,email:d.email,phone:d.phone,college:d.college,department:d.department,year:d.year,additionalInfo:d.additionalInfo,terms:d.terms})});sessionStorage.setItem('eventflow-success',JSON.stringify({registration:r,event,participant:d}));router.push('/register/success')}catch(err){setError(err instanceof Error?err.message:'Unable to register')}};
  if(loadingEvent)return <Page><div className="py-20 text-center text-slate-500">Loading event...</div></Page>;
  if(!event)return <Page><div className="py-20 text-center text-red-300">{error||'Event not found.'}</div></Page>;
  return <Page><div className="mx-auto max-w-3xl"><p className="text-sm text-indigo-300">Registration</p><h1 className="mt-1 text-4xl font-black">Join {event.title}</h1><p className="mt-3 text-slate-400">Complete the form below. You must be signed in to submit the registration.</p>{error&&<div className="mt-5"><Toast message={error} type="error"/></div>}<form onSubmit={handleSubmit(onSubmit)} className="mt-8 glass rounded-3xl p-6 md:p-8 grid md:grid-cols-2 gap-5">{[['name','Full Name'],['email','Email'],['phone','Phone Number'],['college','College / Organization'],['department','Department']].map(([n,l])=><Field key={n} name={n as any} label={l} register={register} error={(errors as any)[n]?.message}/>)}<div><label className="text-sm text-slate-300">Year</label><select {...register('year')} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3"><option value="">Select year</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select>{errors.year&&<p className="mt-1 text-xs text-red-300">{errors.year.message}</p>}</div><div className="md:col-span-2"><label className="text-sm text-slate-300">Additional information <span className="text-slate-500">(optional)</span></label><textarea {...register('additionalInfo')} rows={4} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3"/></div><div className="md:col-span-2 rounded-xl border border-white/10 bg-white/[.02] p-4"><label className="flex gap-3 text-sm text-slate-300"><input type="checkbox" {...register('terms')} className="mt-1"/>I agree to the event terms and understand that registration is subject to organizer approval.</label>{errors.terms&&<p className="mt-2 text-xs text-red-300">{errors.terms.message}</p>}</div><div className="md:col-span-2 flex justify-end"><Button type="submit" disabled={isSubmitting}>{isSubmitting?'Submitting...':'Submit Registration'}</Button></div></form></div></Page>
}
function Field({name,label,register,error}:{name:any;label:string;register:any;error?:string}){return <div><label className="text-sm text-slate-300">{label}</label><input {...register(name)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-indigo-400/50"/>{error&&<p className="mt-1 text-xs text-red-300">{error}</p>}</div>}

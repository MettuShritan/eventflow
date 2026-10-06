'use client';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Page, Button } from '@/components/ui';
import { api } from '@/lib/client-api';

type Role = 'PARTICIPANT' | 'EVENT_CONDUCTOR' | 'ADMIN';
const roleOptions: Array<{ id: Role; label: string; description: string }> = [
  { id: 'PARTICIPANT', label: 'Participant', description: 'Discover events, register and track your participation.' },
  { id: 'EVENT_CONDUCTOR', label: 'Event Conductor', description: 'Manage assigned events, registrations and attendance.' },
  { id: 'ADMIN', label: 'Admin', description: 'Manage the platform and access the DevSecOps area.' },
];

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('PARTICIPANT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRegistered(params.get('registered') === '1');
    setEmail(params.get('email') || '');
    setNext(params.get('next') || '');
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const data = await api<{redirect:string}>('/api/auth/login', { method: 'POST', body: JSON.stringify({ role, email, password }) });
      router.replace(next || data.redirect);
    } catch (err) { setError(err instanceof Error ? err.message : 'Login failed.'); setLoading(false); }
  }

  return <Page><div className="mx-auto max-w-2xl py-6 md:py-12"><div className="text-center"><div className="text-sm text-indigo-300">Secure role-based access</div><h1 className="mt-2 text-4xl md:text-5xl font-black">Sign in to EventFlow</h1><p className="mt-3 text-slate-400">Sign in before entering any protected role workspace or event registration flow.</p></div>
    <form onSubmit={submit} className="mt-10 glass rounded-3xl p-6 md:p-8">
      {registered && <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">Your account has been created. Sign in to continue.</div>}
      <div className="text-sm font-semibold">Continue as</div><div className="mt-3 grid gap-3">{roleOptions.map(option=><button key={option.id} type="button" data-testid={`${option.id.toLowerCase().replace('_','-')}-role`} onClick={()=>{setRole(option.id);setError('')}} className={`rounded-2xl border p-4 text-left transition ${role===option.id?'border-indigo-400/50 bg-indigo-500/10':'border-white/10 bg-white/[.03] hover:bg-white/[.05]'}`}><div className="flex items-center justify-between"><span className="font-bold">{option.label}</span>{role===option.id&&<span className="text-xs text-indigo-300">Selected</span>}</div><p className="mt-1 text-xs text-slate-500">{option.description}</p></button>)}</div>
      <label className="block mt-6 text-sm text-slate-300">Email<input data-testid="email" value={email} onChange={e=>setEmail(e.target.value)} required type="email" autoComplete="email" placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-indigo-400/50"/></label>
      <label className="block mt-4 text-sm text-slate-300">Password<input data-testid="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} type="password" autoComplete="current-password" placeholder="Enter your password" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-indigo-400/50"/></label>
      {error&&<div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</div>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row"><span data-testid="login-submit"><Button type="submit" disabled={loading}>{loading?'Signing in...':'Login'}</Button></span><Button href="/register" variant="secondary">Create participant account</Button></div>
      <p className="mt-5 text-center text-xs text-slate-500">Admin and Event Conductor accounts are created by platform administration.</p>
    </form></div></Page>
}

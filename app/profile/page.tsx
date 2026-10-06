'use client';
import { useEffect,useState } from 'react';
import { Page, Button } from '@/components/ui';
import RoleGuard from '@/components/RoleGuard';

type U={name:string;email:string;role:'PARTICIPANT'|'EVENT_CONDUCTOR'|'ADMIN';college?:string;department?:string;year?:string};
export default function Profile(){return <RoleGuard><ProfileInner/></RoleGuard>}
function ProfileInner(){const [user,setUser]=useState<U|null>(null);useEffect(()=>{fetch('/api/auth/me',{cache:'no-store'}).then(r=>r.json()).then(d=>setUser(d.user))},[]);if(!user)return <Page><div>Loading profile...</div></Page>;const label=user.role==='ADMIN'?'Admin':user.role==='EVENT_CONDUCTOR'?'Event Conductor':'Participant';return <Page><div className="max-w-3xl"><p className="text-sm text-indigo-300">Profile</p><h1 className="mt-1 text-4xl font-black">Your EventFlow identity</h1><div className="mt-8 glass rounded-3xl p-6 space-y-5"><div><div className="text-xs text-slate-500">Name</div><div className="mt-1 font-bold">{user.name}</div></div><div><div className="text-xs text-slate-500">Role</div><div className="mt-1 font-bold">{label}</div></div><div><div className="text-xs text-slate-500">Email</div><div className="mt-1 font-semibold">{user.email}</div></div>{user.college&&<div><div className="text-xs text-slate-500">College / Organization</div><div className="mt-1 font-semibold">{user.college}</div></div>}<Button href={user.role==='ADMIN'?'/admin':user.role==='EVENT_CONDUCTOR'?'/conductor':'/dashboard'}>Back to dashboard</Button></div></div></Page>}

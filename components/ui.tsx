'use client';
import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, Shield, UserRound, BriefcaseBusiness, Sun, Moon, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { AppRole } from '@/components/roles';

export function Button({children,href,onClick,variant='primary',type='button',disabled=false,className=''}:{children:ReactNode;href?:string;onClick?:()=>void;variant?:'primary'|'secondary'|'danger'|'ghost';type?:'button'|'submit';disabled?:boolean;className?:string}){
  const c={primary:'bg-indigo-500 hover:bg-indigo-400 text-white',secondary:'bg-white/5 hover:bg-white/10 text-white border border-white/10',danger:'bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/20',ghost:'hover:bg-white/5 text-slate-300'}[variant];
  if(href)return <Link href={href} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${c} ${disabled?'pointer-events-none opacity-50':''} ${className}`}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${c} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>{children}</button>
}

const navByRole: Record<AppRole, Array<{href:string; label:string}>> = {
  participant: [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/dashboard', label: 'My Registrations' },
    { href: '/profile', label: 'Profile' },
  ],
  'event-conductor': [
    { href: '/conductor', label: 'Dashboard' },
    { href: '/conductor/events', label: 'My Events' },
    { href: '/conductor/registrations', label: 'Registrations' },
    { href: '/conductor/attendance', label: 'Attendance' },
    { href: '/profile', label: 'Profile' },
  ],
  admin: [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/events', label: 'Events' },
    { href: '/admin/registrations', label: 'Registrations' },
    { href: '/admin/devops', label: 'DevOps' },
    { href: '/profile', label: 'Profile' },
  ],
};

const roleLabel: Record<AppRole, string> = {
  participant: 'Participant',
  'event-conductor': 'Event Conductor',
  admin: 'Admin',
};

export function ThemeToggle(){
  const [light,setLight]=useState(false);
  useEffect(()=>{setLight(localStorage.getItem('eventflow-theme')==='light')},[]);
  const toggle=()=>{
    const next=!light;
    setLight(next);
    document.documentElement.classList.toggle('light',next);
    localStorage.setItem('eventflow-theme',next?'light':'dark');
  };
  return <button type="button" onClick={toggle} aria-label={`Switch to ${light?'black':'light'} theme`} title={`Switch to ${light?'black':'light'} theme`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.03] text-slate-300 transition hover:bg-white/[.08]">
    {light?<Moon size={17}/>:<Sun size={17}/>} 
  </button>
}

export function Navbar(){
  const [open,setOpen]=useState(false);
  const [role,setRole]=useState<AppRole|null>(null);
  const router=useRouter();
  const pathname=usePathname();
  useEffect(()=>{
    let mounted=true;
    fetch('/api/auth/me',{cache:'no-store'}).then(async r=>r.ok?r.json():null).then(data=>{
      if(!mounted)return;
      const apiRole=data?.user?.role;
      setRole(apiRole==='ADMIN'?'admin':apiRole==='EVENT_CONDUCTOR'?'event-conductor':apiRole==='PARTICIPANT'?'participant':null);
    }).catch(()=>mounted&&setRole(null));
    if(localStorage.getItem('eventflow-theme')==='light') document.documentElement.classList.add('light');
    return ()=>{mounted=false};
  },[pathname]);
  const items=role ? navByRole[role] : [{href:'/events',label:'Events'}];
  const logout=async()=>{await fetch('/api/auth/logout',{method:'POST'}).catch(()=>{});setRole(null);setOpen(false);router.replace('/login')};
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
      <Link href="/" className="text-xl font-black tracking-tight">Event<span className="gradient-text">Flow</span></Link>
      <nav className="hidden md:flex items-center gap-1">
        {items.map(item=><Link key={item.href} className={`rounded-lg px-3 py-2 text-sm ${pathname===item.href||pathname.startsWith(item.href+'/')?'bg-white/5 text-white':'text-slate-300 hover:bg-white/5'}`} href={item.href}>{item.label}</Link>)}
        <ThemeToggle/>
        {role ? <>
          <div className="ml-1 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-slate-400">{role==='admin'?<Shield size={14}/>:role==='event-conductor'?<BriefcaseBusiness size={14}/>:<UserRound size={14}/>} {roleLabel[role]}</div>
          <Button onClick={logout} variant="secondary"><LogOut size={15}/> Logout</Button>
        </> : <><Button href="/register" variant="secondary">Register</Button><Button href="/login">Login</Button></>}
      </nav>
      <div className="md:hidden flex items-center gap-2"><ThemeToggle/><button className="inline-flex h-10 w-10 items-center justify-center rounded-xl" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
    </div>
    {open&&<nav className="md:hidden border-t border-white/10 p-4 space-y-1">
      {items.map(item=><Link key={item.href} onClick={()=>setOpen(false)} className="block p-3 rounded-lg" href={item.href}>{item.label}</Link>)}
      {role ? <button onClick={logout} className="w-full text-left p-3 rounded-lg text-red-300">Logout</button> : <><Link onClick={()=>setOpen(false)} className="block p-3 rounded-lg" href="/register">Register</Link><Link onClick={()=>setOpen(false)} className="block p-3 rounded-lg" href="/login">Login</Link></>}
    </nav>}
  </header>
}

export function Footer(){return <footer className="mt-20 border-t border-white/10"><div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-3 gap-8"><div><div className="text-lg font-bold">Event<span className="gradient-text">Flow</span></div><p className="mt-2 text-sm text-slate-400">Discover. Register. Experience.</p></div><div><div className="font-semibold">Platform</div><div className="mt-3 flex flex-col gap-2 text-sm text-slate-400"><Link href="/events">Events</Link><Link href="/register">Register</Link><Link href="/login">Sign in</Link></div></div><div><div className="font-semibold">Roles</div><div className="mt-3 flex flex-col gap-2 text-sm text-slate-400"><span>Participant</span><span>Event Conductor</span><span>Admin</span></div></div></div><div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">© 2026 EventFlow · Event Registration &amp; Management Platform</div></footer>}
export function Page({children}:{children:ReactNode}){return <><Navbar/><main className="mx-auto max-w-7xl px-4 py-8">{children}</main><Footer/></>}
export function Stat({label,value,sub}:{label:string;value:string|number;sub?:string}){return <div className="glass rounded-2xl p-5 shadow-glow"><div className="text-sm text-slate-400">{label}</div><div className="mt-2 text-3xl font-black">{value}</div>{sub&&<div className="mt-1 text-xs text-emerald-300">{sub}</div>}</div>}
export function Badge({children,status}:{children?:ReactNode;status?:string}){const s=status||String(children);const cls=s==='Approved'||s==='success'?'bg-emerald-400/10 text-emerald-300 border-emerald-400/20':s==='Pending'||s==='running'?'bg-amber-400/10 text-amber-300 border-amber-400/20':s==='Rejected'||s==='Cancelled'?'bg-red-400/10 text-red-300 border-red-400/20':'bg-indigo-400/10 text-indigo-300 border-indigo-400/20';return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>{children||s}</span>}
export function Toast({message,type='success'}:{message:string;type?:'success'|'error'}){return <div className="fixed right-4 top-20 z-[60] glass rounded-xl px-4 py-3 shadow-2xl flex items-center gap-2">{type==='success'?<CheckCircle2 className="text-emerald-400" size={18}/>:<AlertCircle className="text-red-400" size={18}/>}<span className="text-sm">{message}</span></div>}

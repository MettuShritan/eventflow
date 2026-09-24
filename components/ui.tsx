'use client';
import { useState } from 'react';
import { Bell, LogOut, Menu, X, Search, CalendarDays, Users, ShieldCheck, GitBranch, BarChart3, ClipboardList, Settings, QrCode, Megaphone, UserCircle } from 'lucide-react';
import Link from 'next/link';

export function Button({children,className='',...props}:React.ButtonHTMLAttributes<HTMLButtonElement>){return <button className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50 ${className||'bg-indigo-600 text-white'}`} {...props}>{children}</button>}
export function Badge({children,tone='gray'}:{children:React.ReactNode;tone?:'gray'|'green'|'amber'|'red'|'blue'}){const m={gray:'bg-slate-100 text-slate-700',green:'bg-emerald-100 text-emerald-700',amber:'bg-amber-100 text-amber-700',red:'bg-rose-100 text-rose-700',blue:'bg-blue-100 text-blue-700'};return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${m[tone]}`}>{children}</span>}
const statIcons = {
  CalendarDays,
  ClipboardList,
  ShieldCheck,
  Users,
  BarChart3,
  QrCode,
  Megaphone,
  UserCircle,
  Search,
  GitBranch,
  Settings,
  Bell,
} as const;

type StatIconName = keyof typeof statIcons;

export function Stat({
  label,
  value,
  icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: StatIconName;
  sub?: string;
}) {
  const Icon = statIcons[icon];

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          {sub && (
            <p className="mt-1 text-xs text-slate-500">
              {sub}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
const roleLinks={PARTICIPANT:[['/participant','Home',CalendarDays],['/participant/events','Events',Search],['/participant/registrations','My Registrations',ClipboardList],['/participant/notifications','Notifications',Bell],['/participant/profile','Profile',UserCircle]],EVENT_COMMITTEE:[['/committee','Dashboard',BarChart3],['/committee/events','My Events',CalendarDays],['/committee/registrations','Registrations',Users],['/committee/attendance','Attendance',QrCode],['/committee/announcements','Announcements',Megaphone],['/committee/feedback','Feedback',ClipboardList],['/committee/profile','Profile',UserCircle]],ADMIN:[['/admin','Dashboard',BarChart3],['/admin/users','Users',Users],['/admin/events','Events',CalendarDays],['/admin/registrations','Registrations',ClipboardList],['/admin/analytics','Analytics',BarChart3],['/admin/devops','DevOps',GitBranch],['/admin/audit','Audit Logs',ShieldCheck],['/admin/settings','Settings',Settings],['/admin/profile','Profile',UserCircle]]} as const;
export function Sidebar({role}:{role:keyof typeof roleLinks}){const [open,setOpen]=useState(false);return <><button className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow md:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><aside className={`${open?'translate-x-0':'-translate-x-full'} fixed z-40 flex h-screen w-64 flex-col border-r bg-white p-5 transition md:translate-x-0`}><Link href="/" className="mb-8 flex items-center gap-2 px-2 text-xl font-black"><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">E</span>EventFlow</Link><div className="mb-4 px-2 text-xs font-bold uppercase tracking-widest text-slate-400">{role.replace('_',' ')}</div><nav className="space-y-1">{roleLinks[role].map(([href,label,Icon])=><Link key={href} href={href} onClick={()=>setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"><Icon size={18}/>{label}</Link>)}</nav><div className="mt-auto"><form action="/api/auth/logout" method="post"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100"><LogOut size={18}/>Logout</button></form></div></aside></>}
export function Topbar({title,role}:{title:string;role:string}){return <header className="sticky top-0 z-30 border-b bg-white/90 px-5 py-4 backdrop-blur md:ml-64"><div className="flex items-center justify-between"><div className="pl-12 md:pl-0"><h1 className="text-xl font-bold">{title}</h1><p className="text-xs text-slate-500">EventFlow · {role.replace('_',' ')}</p></div><Link href={role==='ADMIN'?'/admin/notifications':role==='EVENT_COMMITTEE'?'/committee/notifications':'/participant/notifications'} className="relative rounded-xl p-2 hover:bg-slate-100"><Bell size={20}/></Link></div></header>}
export function Shell({role,title,children}:{role:keyof typeof roleLinks;title:string;children:React.ReactNode}){return <div className="min-h-screen bg-slate-50"><Sidebar role={role}/><Topbar title={title} role={role}/><main className="px-5 py-6 md:ml-64">{children}</main></div>}
export function Field({label,...props}:React.InputHTMLAttributes<HTMLInputElement>&{label:string}){return <label className="block text-sm font-medium text-slate-700"><span className="mb-1.5 block">{label}</span><input {...props} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none ring-indigo-200 focus:ring-4"/></label>}

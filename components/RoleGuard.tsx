'use client';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { AppRole } from './roles';

type ApiUser = { role: 'PARTICIPANT' | 'EVENT_CONDUCTOR' | 'ADMIN' };
const map: Record<ApiUser['role'], AppRole> = { PARTICIPANT: 'participant', EVENT_CONDUCTOR: 'event-conductor', ADMIN: 'admin' };

export default function RoleGuard({ role, children }: { role?: AppRole; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) throw new Error('AUTH');
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        const current = data.user ? map[data.user.role as ApiUser['role']] : null;
        if (!current || (role && current !== role)) {
          router.replace(current ? '/unauthorized' : `/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        setAllowed(true);
      })
      .catch(() => router.replace(`/login?next=${encodeURIComponent(pathname)}`));
    return () => { active = false; };
  }, [pathname, role, router]);
  return allowed ? <>{children}</> : null;
}

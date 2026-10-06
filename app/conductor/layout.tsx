import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ConductorLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/conductor');
  if (user.role !== 'EVENT_CONDUCTOR') redirect('/unauthorized');
  return <>{children}</>;
}

import { NextResponse } from 'next/server';
import { getCurrentUser } from './auth';
import type { Role } from '@prisma/client';
export async function requireUser(roles?:Role[]){
  const user=await getCurrentUser();
  if(!user) throw new Error('UNAUTHENTICATED');
  if(roles && !roles.includes(user.role)) throw new Error('FORBIDDEN');
  if(user.status!=='ACTIVE') throw new Error('FORBIDDEN');
  return user;
}
export function apiAuthError(e:unknown){
  const m=e instanceof Error?e.message:'';
  if(m==='UNAUTHENTICATED') return NextResponse.json({error:'Authentication required'},{status:401});
  if(m==='FORBIDDEN') return NextResponse.json({error:'Access denied'},{status:403});
  return null;
}

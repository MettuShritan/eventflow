import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import type { Role } from '@prisma/client';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-only-change-me');
const COOKIE = 'eventflow_session';

export async function hashPassword(password:string){ return bcrypt.hash(password,12); }
export async function verifyPassword(password:string, hash:string){ return bcrypt.compare(password,hash); }
export async function createSession(user:{id:string; role:Role; email:string}){
  const token = await new SignJWT({sub:user.id, role:user.role, email:user.email}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('8h').sign(secret);
  (await cookies()).set(COOKIE, token, {httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV==='production', path:'/', maxAge:60*60*8});
}
export async function destroySession(){ (await cookies()).delete(COOKIE); }
export async function getSession(){
  const token=(await cookies()).get(COOKIE)?.value; if(!token) return null;
  try { const {payload}=await jwtVerify(token,secret); return {id:String(payload.sub), role:payload.role as Role, email:String(payload.email)}; } catch { return null; }
}
export async function getCurrentUser(){ const s=await getSession(); if(!s)return null; return prisma.user.findUnique({where:{id:s.id}}); }

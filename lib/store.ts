'use client';
import { api } from './client-api';
import type { Registration } from '@/types';
export async function getRegistrations() { return api<Registration[]>('/api/registrations', { cache: 'no-store' }); }
export async function register(input: any) { return api<Registration>('/api/registrations', { method: 'POST', body: JSON.stringify(input) }); }

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
  role: z.enum(['PARTICIPANT', 'EVENT_CONDUCTOR', 'ADMIN']),
});

export const participantRegistrationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.'),
  college: z.string().trim().min(2).max(120),
  department: z.string().trim().min(2).max(80),
  year: z.string().min(1).max(20),
});

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(160),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(5000),
  venue: z.string().trim().min(2).max(180),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }),
  registrationDeadline: z.string().datetime({ offset: true }),
  capacity: z.coerce.number().int().min(1).max(100000),
  registrationFee: z.coerce.number().min(0).max(1000000).default(0),
  eligibility: z.string().trim().max(500).optional().nullable(),
  banner: z.string().url().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).default('DRAFT'),
});

export const registrationSchema = z.object({
  eventId: z.string().min(1),
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.'),
  college: z.string().trim().min(2).max(120),
  department: z.string().trim().min(2).max(80),
  year: z.string().min(1).max(20),
  additionalInfo: z.string().trim().max(1000).optional().nullable(),
  terms: z.literal(true),
});

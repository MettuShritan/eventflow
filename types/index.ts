export type EventCategory = string;
export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  seats: number;
  registered: number;
  deadline: string;
  image: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  eligibility?: string | null;
  registrationFee?: number;
}
export interface User { id: string; name: string; email: string; role: 'participant' | 'event-conductor' | 'admin'; college?: string; department?: string; year?: string; }
export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export interface Registration {
  id: string; registrationNumber?: string; eventId: string; participantId: string; participantName: string; email: string; registeredAt: string; status: RegistrationStatus;
  phone?: string | null; college?: string | null; department?: string | null; year?: string | null; checkedIn?: boolean;
  event?: { id: string; title: string; date: string; location: string };
}
export interface PipelineStage { name: string; tool: string; status: 'success' | 'running' | 'failed' | 'pending'; description: string; }

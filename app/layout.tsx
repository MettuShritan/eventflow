import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'EventFlow — Discover. Register. Experience.', description: 'Event registration and management platform' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }

import './globals.css';import {ReactNode} from 'react';export const metadata={title:'EventFlow — Discover. Register. Experience.',description:'Event registration and management platform'};export const dynamic = 'force-dynamic';

export default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zoom - Video Conferencing, Web Events, Webinars & Team Chat',
  description: 'Functional Zoom web application clone replicating Zoom design, meeting creation, schedule management, and WebRTC video conferencing.',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans antialiased text-slate-800">
        {children}
      </body>
    </html>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

export default function LeaveMeetingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col items-center justify-between py-12 px-4 font-sans select-none">
      <div />

      {/* Center Zoom Workplace Branding */}
      <div className="flex flex-col items-center text-center max-w-md w-full space-y-8">
        <div className="flex flex-col items-center space-y-1">
          <span className="text-4xl font-extrabold text-zoom-blue tracking-tight">zoom</span>
          <span className="text-3xl font-bold text-slate-900 tracking-tight">Workplace</span>
        </div>

        {/* Action Button Container - Only Join Meeting */}
        <div className="w-full max-w-xs pt-4">
          <Link
            href="/"
            className="w-full inline-block py-2.5 px-6 text-center text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Join Meeting
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
        <a href="https://zoom.us" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors">
          About Zoom
        </a>
        <span>|</span>
        <div className="flex items-center space-x-1 cursor-pointer hover:text-slate-800">
          <span>🌐 English</span>
          <span>^</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import { UserProfile } from '@/lib/api';

interface NavbarProps {
  user: UserProfile | null;
  onJoinClick?: () => void;
  onScheduleClick?: () => void;
  onHostClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onJoinClick,
  onScheduleClick,
  onHostClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 shadow-2xs font-sans text-xs select-none">
      {/* Top Black/Navy Utility Bar matching Zoom Website */}
      <div className="bg-[#000529] text-slate-300 py-1.5 px-4 lg:px-10 flex items-center justify-end space-x-6 text-[11px] font-normal border-b border-slate-900">
        <button className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer">
          <Search className="w-3 h-3 text-slate-300" />
          <span>Search</span>
        </button>
        <a href="https://support.zoom.us" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
          Support
        </a>
        <span className="font-sans text-slate-300">0008000503335</span>
        <a href="#" className="hover:text-white transition-colors">Contact Sales</a>
        <a href="#" className="hover:text-white transition-colors">Request a Demo</a>
      </div>

      {/* Main White Header Bar matching Zoom Website */}
      <div className="h-14 px-4 lg:px-10 flex items-center justify-between">
        {/* Left: Zoom Logo & Primary Nav Links */}
        <div className="flex items-center space-x-7">
          <Link href="/" className="flex items-center focus:outline-none">
            <span className="text-[26px] font-extrabold text-[#0e71eb] tracking-tighter font-sans lowercase">zoom</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-5 text-[13px] font-normal text-[#525266]">
            <a href="#" className="hover:text-[#0e71eb] transition-colors">Products</a>
            <a href="#" className="hover:text-[#0e71eb] transition-colors">Solutions</a>
            <a href="#" className="hover:text-[#0e71eb] transition-colors">Resources</a>
            <a href="#" className="hover:text-[#0e71eb] transition-colors">Plans &amp; Pricing</a>
          </nav>
        </div>

        {/* Right Utility Links matching Zoom Website */}
        <div className="flex items-center space-x-5 text-[13px] font-normal text-[#232333]">
          <Link href="/schedule" className="hover:text-[#0e71eb] transition-colors">
            Schedule
          </Link>

          <Link href="/join" className="hover:text-[#0e71eb] transition-colors">
            Join
          </Link>

          <button
            onClick={onHostClick}
            className="flex items-center space-x-1 hover:text-[#0e71eb] transition-colors cursor-pointer"
          >
            <span>Host</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#747474]" />
          </button>

          <button className="flex items-center space-x-1 hover:text-[#0e71eb] transition-colors cursor-pointer">
            <span>Web App</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#747474]" />
          </button>

          {/* User Profile Avatar Pill matching crimson red badge in screenshot */}
          <div className="w-7 h-7 rounded-full bg-[#d92138] text-white flex items-center justify-center font-semibold text-[12px] shadow-2xs">
            {user ? `${user.name[0]?.toUpperCase()}.` : 'A.'}
          </div>
        </div>
      </div>
    </header>
  );
};


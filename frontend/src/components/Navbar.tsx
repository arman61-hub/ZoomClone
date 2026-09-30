'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Menu, X, ChevronRight, ExternalLink } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 shadow-2xs font-sans text-xs select-none">
      {/* Top Black/Navy Utility Bar matching Zoom Website (hidden on mobile) */}
      <div className="hidden md:flex bg-[#000529] text-slate-300 py-1.5 px-4 lg:px-10 items-center justify-end space-x-6 text-[11px] font-normal border-b border-slate-900">
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
        <div className="flex items-center space-x-4 lg:space-x-7">
          <Link href="/" className="flex items-center focus:outline-none">
            <span className="text-[24px] sm:text-[26px] font-extrabold text-[#0e71eb] tracking-tighter font-sans lowercase">zoom</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-5 text-[13px] font-normal text-[#525266]">
            <a href="#" className="hover:text-[#0e71eb] transition-colors">Products</a>
            <a href="#" className="hover:text-[#0e71eb] transition-colors">Solutions</a>
            <a href="#" className="hover:text-[#0e71eb] transition-colors">Resources</a>
            <a href="#" className="hover:text-[#0e71eb] transition-colors">Plans &amp; Pricing</a>
          </nav>
        </div>

        {/* Right Utility Links matching Zoom Website */}
        <div className="flex items-center space-x-3 sm:space-x-5 text-[13px] font-normal text-[#232333]">
          <Link href="/schedule" className="hidden sm:inline-block hover:text-[#0e71eb] transition-colors">
            Schedule
          </Link>

          <Link href="/join" className="hover:text-[#0e71eb] transition-colors">
            Join
          </Link>

          <button
            onClick={onHostClick}
            className="flex items-center space-x-0.5 sm:space-x-1 hover:text-[#0e71eb] transition-colors cursor-pointer"
          >
            <span>Host</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#747474]" />
          </button>

          <button className="hidden sm:flex items-center space-x-1 hover:text-[#0e71eb] transition-colors cursor-pointer">
            <span>Web App</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#747474]" />
          </button>

          {/* User Profile Avatar Pill */}
          <div className="w-7 h-7 rounded-full bg-[#854BE3] text-white flex items-center justify-center font-bold text-[11px] shadow-2xs cursor-pointer">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AR'}
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-1.5 text-[#232333] hover:text-[#0e71eb] rounded-md hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sub-Header Bar matching Zoom Website (Image 1, 4 & 5) */}
      <div className="bg-[#f7f9fa] border-t border-b border-slate-200/80 px-4 lg:px-10 py-2 flex items-center justify-between text-xs text-[#232333]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="font-semibold text-[#0e71eb] hover:underline flex items-center space-x-1">
            <span>Home</span>
          </Link>
          <button
            onClick={() => setHomeDropdownOpen(!homeDropdownOpen)}
            className="text-[#0e71eb] hover:text-[#0b5cbe] cursor-pointer"
          >
            {homeDropdownOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-md py-4 px-5 space-y-4 text-[13px] text-[#232333] animate-fadeIn">
          <div className="space-y-2 border-b border-slate-100 pb-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-[#0e71eb] py-1"
            >
              Home
            </Link>
            <Link
              href="/schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#0e71eb]"
            >
              Schedule a Meeting
            </Link>
            <Link
              href="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-[#0e71eb]"
            >
              Join a Meeting
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onHostClick) onHostClick();
              }}
              className="block w-full text-left py-1 hover:text-[#0e71eb] cursor-pointer"
            >
              Host a Meeting
            </button>
          </div>

          <div className="space-y-2 border-b border-slate-100 pb-3 text-[#525266]">
            <span className="text-[11px] font-bold text-[#747474] uppercase tracking-wider block mb-1">Navigation</span>
            <a href="#" className="block py-1 hover:text-[#0e71eb]">Products</a>
            <a href="#" className="block py-1 hover:text-[#0e71eb]">Solutions</a>
            <a href="#" className="block py-1 hover:text-[#0e71eb]">Resources</a>
            <a href="#" className="block py-1 hover:text-[#0e71eb]">Plans &amp; Pricing</a>
          </div>

          <div className="space-y-2 text-[#525266]">
            <span className="text-[11px] font-bold text-[#747474] uppercase tracking-wider block mb-1">Account &amp; Support</span>
            <a href="#" className="block py-1 hover:text-[#0e71eb]">My Account</a>
            <a href="#" className="block py-1 hover:text-[#0e71eb]">Settings</a>
            <a href="https://support.zoom.us" target="_blank" rel="noreferrer" className="block py-1 hover:text-[#0e71eb]">Support Center</a>
          </div>
        </div>
      )}
    </header>
  );
};



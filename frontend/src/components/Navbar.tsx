'use client';

import React from 'react';
import { Search, Bell, ChevronDown, Video } from 'lucide-react';
import { UserProfile } from '@/lib/api';

interface NavbarProps {
  user: UserProfile | null;
  onJoinClick: () => void;
  onScheduleClick: () => void;
  onHostClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onJoinClick,
  onScheduleClick,
  onHostClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 h-16 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left section: Zoom logo & Main nav links */}
      <div className="flex items-center space-x-6">
        <a href="/" className="flex items-center space-x-1.5 focus:outline-none">
          <svg className="w-24 h-6 text-zoom-blue fill-current" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 5.5C8.98 5.5 4.5 9.98 4.5 15.5C4.5 21.02 8.98 25.5 14.5 25.5C20.02 25.5 24.5 21.02 24.5 15.5C24.5 9.98 20.02 5.5 14.5 5.5ZM14.5 21.5C11.19 21.5 8.5 18.81 8.5 15.5C8.5 12.19 11.19 9.5 14.5 9.5C17.81 9.5 20.5 12.19 20.5 15.5C20.5 18.81 17.81 21.5 14.5 21.5Z" />
            <text x="32" y="22" fontFamily="Inter, sans-serif" fontSize="22" fontWeight="800" fill="#0E71EB">zoom</text>
          </svg>
        </a>

        <nav className="hidden md:flex items-center space-x-5 text-sm font-medium text-slate-700">
          <a href="#" className="hover:text-zoom-blue transition-colors">Products</a>
          <a href="#" className="hover:text-zoom-blue transition-colors">Solutions</a>
          <a href="#" className="hover:text-zoom-blue transition-colors">Resources</a>
          <a href="#" className="hover:text-zoom-blue transition-colors">Plans & Pricing</a>
        </nav>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search meetings, contacts, tools..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 border border-transparent rounded-lg focus:bg-white focus:border-zoom-blue focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right section: Quick actions, notifications, User Profile */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onScheduleClick}
          className="text-xs font-semibold text-slate-700 hover:text-zoom-blue px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
        >
          Schedule
        </button>

        <button
          onClick={onJoinClick}
          className="text-xs font-semibold text-slate-700 hover:text-zoom-blue px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
        >
          Join
        </button>

        <button
          onClick={onHostClick}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-700 hover:text-zoom-blue px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
        >
          <Video className="w-3.5 h-3.5 text-zoom-orange mr-0.5" />
          <span>Host</span>
          <ChevronDown className="w-3 h-3 ml-0.5" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        <button className="text-slate-500 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* User Profile Avatar Circle */}
        <div className="flex items-center space-x-2 pl-1 cursor-pointer">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-zoom-blue font-bold text-xs border border-blue-200">
            {user ? user.name.split(' ').map(n => n[0]).join('') : 'JT'}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-none">
              {user ? user.name : 'Arman'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
              {user ? user.plan_type : 'Workplace Basic'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

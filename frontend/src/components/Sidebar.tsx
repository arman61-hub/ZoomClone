'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [myAccountOpen, setMyAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <aside className="w-52 bg-[#f7f9fa] border-r border-slate-200/70 flex flex-col py-3 px-3 text-[13px] font-sans select-none overflow-y-auto shrink-0 min-h-[calc(100vh-3.5rem)]">
      {/* Home item */}
      <div className="mb-2">
        <Link
          href="/"
          className="w-full flex items-center px-2 py-1.5 font-semibold text-[#0e71eb] text-[14px] hover:underline"
        >
          Home
        </Link>
      </div>

      {/* My Products Section */}
      <div className="space-y-0.5 mb-3">
        <span className="px-2 text-[12px] font-normal text-[#747474] block py-1">
          My Products
        </span>
        <ul className="space-y-0.5 text-[#232333]">
          <li className="flex items-center justify-between px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">
            <span>AI</span>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-semibold bg-[#e8f2ff] text-[#0e71eb] px-1.5 py-0.5 rounded">New</span>
              <ExternalLink className="w-3 h-3 text-[#747474]" />
            </div>
          </li>
          <li className="px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors font-medium text-[#131619]">
            <Link href="/#meetings" className="block w-full">Meetings</Link>
          </li>
          <li className="px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">Recordings</li>
          <li className="px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">Summaries</li>
          <li className="flex items-center justify-between px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">
            <span>Hub</span>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-semibold bg-[#e8f2ff] text-[#0e71eb] px-1.5 py-0.5 rounded">New</span>
              <ExternalLink className="w-3 h-3 text-[#747474]" />
            </div>
          </li>
          <li className="flex items-center justify-between px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">
            <span>Whiteboards</span>
            <ExternalLink className="w-3 h-3 text-[#747474]" />
          </li>
          <li className="px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">Notes</li>
          <li className="flex items-center justify-between px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">
            <span>Clips</span>
            <ExternalLink className="w-3 h-3 text-[#747474]" />
          </li>
          <li className="flex items-center justify-between px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">
            <span>Canvas</span>
            <ExternalLink className="w-3 h-3 text-[#747474]" />
          </li>
          <li className="flex items-center justify-between px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">
            <span>Paper</span>
            <ExternalLink className="w-3 h-3 text-[#747474]" />
          </li>
          <li className="flex items-center justify-between px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">
            <span>Sheets</span>
            <ExternalLink className="w-3 h-3 text-[#747474]" />
          </li>
          <li className="flex items-center justify-between px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">
            <span>Slides</span>
            <ExternalLink className="w-3 h-3 text-[#747474]" />
          </li>
          <li className="flex items-center justify-between px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors">
            <span>Tasks</span>
            <ExternalLink className="w-3 h-3 text-[#747474]" />
          </li>
          <li className="flex items-center justify-between px-2 py-1.5 hover:bg-[#ebf4fe] rounded-md cursor-pointer transition-colors text-[#0e71eb] font-normal">
            <span>Scheduler</span>
            <ExternalLink className="w-3 h-3 text-[#0e71eb]" />
          </li>
          <li className="px-2 py-1.5 text-[#747474] hover:text-[#131619] cursor-pointer pt-2 text-[12px]">
            Discover More Products
          </li>
        </ul>
      </div>

      {/* My Account Dropdown Accordion */}
      <div className="space-y-0.5 mb-1.5">
        <button
          onClick={() => setMyAccountOpen(!myAccountOpen)}
          className="w-full flex items-center space-x-1.5 px-2 py-1 text-[12px] font-normal text-[#747474] hover:text-[#131619] transition-colors"
        >
          {myAccountOpen ? <ChevronDown className="w-3 h-3 text-[#747474]" /> : <ChevronRight className="w-3 h-3 text-[#747474]" />}
          <span>My Account</span>
        </button>
        {myAccountOpen && (
          <ul className="space-y-0.5 mt-0.5 text-[#232333] pl-3">
            <li className="px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">Profile</li>
            <li className="px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">Settings</li>
            <li className="px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">Personal Devices</li>
            <li className="px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">Personal Contacts</li>
            <li className="px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">Data &amp; Privacy</li>
          </ul>
        )}
      </div>

      {/* Admin Dropdown Accordion */}
      <div className="space-y-0.5 mb-1.5">
        <button
          onClick={() => setAdminOpen(!adminOpen)}
          className="w-full flex items-center space-x-1.5 px-2 py-1 text-[12px] font-normal text-[#747474] hover:text-[#131619] transition-colors"
        >
          {adminOpen ? <ChevronDown className="w-3 h-3 text-[#747474]" /> : <ChevronRight className="w-3 h-3 text-[#747474]" />}
          <span>Admin</span>
        </button>
        {adminOpen && (
          <ul className="space-y-0.5 mt-0.5 text-[#232333] pl-3">
            <li className="px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">Plans and Billing</li>
            <li className="px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">User Management</li>
            <li className="px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">Account Management</li>
            <li className="px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">Advanced</li>
          </ul>
        )}
      </div>

      {/* Support Dropdown Accordion */}
      <div className="space-y-0.5">
        <button
          onClick={() => setSupportOpen(!supportOpen)}
          className="w-full flex items-center space-x-1.5 px-2 py-1 text-[12px] font-normal text-[#747474] hover:text-[#131619] transition-colors"
        >
          {supportOpen ? <ChevronDown className="w-3 h-3 text-[#747474]" /> : <ChevronRight className="w-3 h-3 text-[#747474]" />}
          <span>Support</span>
        </button>
        {supportOpen && (
          <ul className="space-y-0.5 mt-0.5 text-[#232333] pl-3">
            <li className="flex items-center justify-between px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">
              <span>Zoom Learning Center</span>
              <ExternalLink className="w-3 h-3 text-[#747474]" />
            </li>
            <li className="flex items-center justify-between px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">
              <span>Video Tutorials</span>
              <ExternalLink className="w-3 h-3 text-[#747474]" />
            </li>
            <li className="px-2 py-1 hover:bg-[#ebf4fe] rounded-md cursor-pointer">Knowledge Base</li>
          </ul>
        )}
      </div>
    </aside>
  );
};


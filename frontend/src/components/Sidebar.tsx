'use client';

import React from 'react';
import {
  Video,
  Disc,
  FileText,
  Layout,
  FileCode,
  Paperclip,
  CheckSquare,
  User,
  Settings,
  Smartphone,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const products = [
    { id: 'ai', label: 'AI Companion', icon: Sparkles, badge: 'NEW' },
    { id: 'meetings', label: 'Meetings', icon: Video },
    { id: 'recordings', label: 'Recordings', icon: Disc },
    { id: 'summaries', label: 'Summaries', icon: FileText },
    { id: 'whiteboards', label: 'Whiteboards', icon: Layout },
    { id: 'notes', label: 'Notes', icon: FileCode },
    { id: 'clips', label: 'Clips', icon: Paperclip },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  const account = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'devices', label: 'Personal Devices', icon: Smartphone },
    { id: 'privacy', label: 'Data & Privacy', icon: ShieldAlert },
  ];

  return (
    <aside className="w-60 bg-slate-50 border-r border-slate-200 flex flex-col justify-between py-5 px-3 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Products Section */}
        <div>
          <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            My Products
          </h3>
          <ul className="space-y-0.5">
            {products.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-zoom-blue border-l-3 border-zoom-blue shadow-2xs font-bold'
                        : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-zoom-blue' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold bg-blue-100 text-zoom-blue px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Account Section */}
        <div>
          <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            My Account
          </h3>
          <ul className="space-y-0.5">
            {account.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-zoom-blue border-l-3 border-zoom-blue shadow-2xs font-bold'
                        : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-zoom-blue' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Support Section */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Support
        </h3>
        <ul className="space-y-1 text-xs text-slate-600">
          <li>
            <a
              href="https://support.zoom.us"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-slate-200/60 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Zoom Learning Center</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

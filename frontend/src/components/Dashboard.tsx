'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Video,
  Copy,
  Check,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { UserProfile, Meeting, createInstantMeeting, fetchUpcomingMeetings, fetchRecentMeetings } from '@/lib/api';

interface DashboardProps {
  user: UserProfile | null;
  onOpenJoin?: () => void;
  onOpenSchedule?: () => void;
  onStartMeeting: (meetingId: string) => void;
}

// 3D Isometric Open Blue Box SVG matching Zoom website's recent activity empty state
const Blue3DBoxSVG = () => (
  <svg width="120" height="96" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto drop-shadow-xs">
    {/* Soft floor shadow */}
    <ellipse cx="60" cy="84" rx="42" ry="7" fill="#000000" fillOpacity="0.08" />
    {/* Inside dark blue floor */}
    <path d="M30 42L60 30L90 42L60 54L30 42Z" fill="#1A70E6" />
    {/* Left Open Flap */}
    <path d="M30 42L18 26L48 20L60 30L30 42Z" fill="#71B2FF" />
    {/* Right Open Flap */}
    <path d="M90 42L102 26L72 20L60 30L90 42Z" fill="#71B2FF" />
    {/* Front Left Flap */}
    <path d="M30 42L60 54L48 72L18 56L30 42Z" fill="#4B9BFF" />
    {/* Front Right Flap */}
    <path d="M90 42L60 54L72 72L102 56L90 42Z" fill="#4B9BFF" />
    {/* Box Body Front Left Panel */}
    <path d="M30 42V68L60 80V54L30 42Z" fill="#0E71EB" />
    {/* Box Body Front Right Panel */}
    <path d="M60 54V80L90 68V42L60 54Z" fill="#0056C6" />
  </svg>
);

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onOpenJoin,
  onOpenSchedule,
  onStartMeeting,
}) => {
  const [copiedPmi, setCopiedPmi] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [upcoming, setUpcoming] = useState<Meeting[]>([]);
  const [recent, setRecent] = useState<Meeting[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);

  // Pagination states (3 items per page)
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [recentPage, setRecentPage] = useState(1);
  const ITEMS_PER_PAGE = 2;

  const loadMeetings = async () => {
    try {
      setIsLoadingMeetings(true);
      const [upcomingData, recentData] = await Promise.all([
        fetchUpcomingMeetings(),
        fetchRecentMeetings()
      ]);
      setUpcoming(upcomingData);
      setRecent(recentData);
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setIsLoadingMeetings(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleCopyPmi = () => {
    const pmi = user?.personal_meeting_id || '5602842970';
    const formatted = `${pmi.slice(0, 3)} ${pmi.slice(3, 6)} ${pmi.slice(6)}`;
    navigator.clipboard.writeText(formatted);
    setCopiedPmi(true);
    setTimeout(() => setCopiedPmi(false), 2000);
  };

  const handleCopyInviteUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleInstantMeeting = async () => {
    try {
      const newMeeting = await createInstantMeeting();
      onStartMeeting(newMeeting.id);
    } catch (err) {
      console.error('Failed to launch instant meeting:', err);
    }
  };

  // Paginated Slices
  const totalUpcomingPages = Math.ceil(upcoming.length / ITEMS_PER_PAGE) || 1;
  const paginatedUpcoming = upcoming.slice(
    (upcomingPage - 1) * ITEMS_PER_PAGE,
    upcomingPage * ITEMS_PER_PAGE
  );

  const totalRecentPages = Math.ceil(recent.length / ITEMS_PER_PAGE) || 1;
  const paginatedRecent = recent.slice(
    (recentPage - 1) * ITEMS_PER_PAGE,
    recentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1 bg-white p-5 lg:p-7 space-y-6 font-sans text-xs text-[#232333] select-none relative min-h-[calc(100vh-3.5rem)]">
      {/* Top Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Top-Left Card: Profile Box */}
        <div className="lg:col-span-7 bg-white p-5 lg:p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Avatar + Name + Plan */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#e4e7eb] text-[#9ea4b0] flex items-center justify-center shrink-0">
              <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-[#131619] tracking-tight leading-tight">
                {user ? user.name : 'Arman'} .
              </h1>
              <p className="text-[#747474] text-[13px] font-normal mt-0.5">
                Plan: <span className="font-bold text-[#000529]">{user?.plan_type || 'Workplace Basic'}</span>
              </p>
            </div>
          </div>

          {/* Right: Manage Plan Button + View Plan Details Link */}
          <div className="flex flex-col items-center sm:items-end space-y-2 w-full sm:w-auto">
            <button className="px-5 py-2 bg-[#e8f2ff] hover:bg-[#d8e8ff] text-[#0e71eb] font-semibold text-[13px] rounded-full transition-colors w-full sm:w-auto text-center shadow-none cursor-pointer">
              Manage Plan
            </button>
            <a href="#" className="text-[#0e71eb] text-[12px] font-normal hover:underline text-center sm:text-right cursor-pointer">
              View Plan Details
            </a>
          </div>
        </div>

        {/* Top-Right Card: Quick Actions & PMI */}
        <div className="lg:col-span-5 bg-white p-5 lg:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="grid grid-cols-3 gap-3">
            <Link
              href="/schedule"
              className="group flex flex-col items-center justify-center p-2 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0e71eb] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-1.5">
                <span className="font-bold text-base leading-none">19</span>
              </div>
              <span className="text-[12px] font-normal text-[#232333]">Schedule</span>
            </Link>

            <Link
              href="/join"
              className="group flex flex-col items-center justify-center p-2 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0e71eb] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-1.5">
                <Plus className="w-6 h-6 stroke-[3]" />
              </div>
              <span className="text-[12px] font-normal text-[#232333]">Join</span>
            </Link>

            <button
              onClick={handleInstantMeeting}
              className="group flex flex-col items-center justify-center p-2 text-center cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#f26d21] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-1.5">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-[12px] font-normal text-[#232333]">Host</span>
            </button>
          </div>

          <div className="text-center space-y-0.5 pt-1">
            <div className="text-[13px] font-bold text-[#131619]">
              Personal Meeting ID
            </div>
            <div className="flex items-center justify-center space-x-1.5 text-[#525266] text-[13px] font-normal">
              <span>560 284 2970</span>
              <button onClick={handleCopyPmi} className="text-[#747474] hover:text-[#0e71eb] cursor-pointer">
                {copiedPmi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Recent Activity Box */}
        <div className="lg:col-span-7 bg-white p-5 lg:p-6 rounded-2xl border border-slate-200/80 shadow-2xs min-h-[320px] flex flex-col justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#131619] mb-4">
              Recent activity
            </h2>

            {recent.length > 0 ? (
              <div className="divide-y divide-slate-100 mt-2">
                {paginatedRecent.map((m) => (
                  <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-[#131619] text-[13px]">{m.title}</h4>
                      <span className="text-[#747474] text-[12px]">Meeting ID: {m.id}</span>
                    </div>
                    <span className="text-[#747474] text-[12px]">Ended</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-2">
                <Blue3DBoxSVG />
                <span className="text-[13px] font-bold text-[#232333] text-center pt-2 block">No recent activity</span>
              </div>
            )}
          </div>

          {/* Recent Activity Pagination Controls */}
          {recent.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-[#747474]">
              <span>Page {recentPage} of {totalRecentPages}</span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={recentPage === 1}
                  onClick={() => setRecentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={recentPage === totalRecentPages}
                  onClick={() => setRecentPage(prev => Math.min(prev + 1, totalRecentPages))}
                  className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Meetings Box */}
        <div id="meetings" className="lg:col-span-5 bg-white p-5 lg:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[#131619]">Meetings</h2>
            <a href="#" className="text-[12px] font-normal text-[#0e71eb] hover:underline">
              Visit Meetings
            </a>
          </div>

          <div className="bg-[#f7f9fa] py-2 px-3.5 rounded-lg border border-slate-100 text-[13px] font-bold text-[#131619]">
            Today
          </div>

          {isLoadingMeetings ? (
            <div className="py-6 text-center text-xs text-[#747474]">Loading meetings...</div>
          ) : upcoming.length > 0 ? (
            <div className="space-y-3">
              {paginatedUpcoming.map((m) => (
                <div key={m.id} className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-2 shadow-2xs">
                  <div>
                    <h4 className="text-[13px] font-bold text-[#0e71eb]">{m.title}</h4>
                    <p className="text-[12px] font-bold text-[#131619] mt-0.5">4:00 PM - 4:40 PM</p>
                    <p className="text-[12px] text-[#747474] font-normal mt-0.5">
                      Meeting ID: {m.id}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => onStartMeeting(m.id)}
                      className="px-4 py-1.5 bg-[#0e71eb] hover:bg-[#0b5cbe] text-white font-semibold text-[12px] rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handleCopyInviteUrl(m.invite_url, m.id)}
                      className="px-3.5 py-1.5 bg-[#e8f2ff] hover:bg-[#d8e8ff] text-[#0e71eb] font-semibold text-[12px] rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      {copiedLink === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#0e71eb]" />}
                      <span>{copiedLink === m.id ? 'Copied' : 'Copy Invitation'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-2 shadow-2xs">
              <div>
                <h4 className="text-[13px] font-bold text-[#0e71eb]">My Meeting</h4>
                <p className="text-[12px] font-bold text-[#131619] mt-0.5">4:00 PM - 4:40 PM</p>
                <p className="text-[12px] text-[#747474] font-normal mt-0.5">
                  Meeting ID: 845 4563 1899
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => onStartMeeting('84545631899')}
                  className="px-4 py-1.5 bg-[#0e71eb] hover:bg-[#0b5cbe] text-white font-semibold text-[12px] rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Start
                </button>
                <button
                  onClick={() => handleCopyInviteUrl('http://localhost:3000/join?meetingId=84545631899', 'default')}
                  className="px-3.5 py-1.5 bg-[#e8f2ff] hover:bg-[#d8e8ff] text-[#0e71eb] font-semibold text-[12px] rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#0e71eb]" />
                  <span>Copy Invitation</span>
                </button>
              </div>
            </div>
          )}

          {/* Upcoming Meetings Pagination Controls */}
          {upcoming.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-[#747474]">
              <span>Page {upcomingPage} of {totalUpcomingPages}</span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={upcomingPage === 1}
                  onClick={() => setUpcomingPage(prev => Math.max(prev - 1, 1))}
                  className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={upcomingPage === totalUpcomingPages}
                  onClick={() => setUpcomingPage(prev => Math.min(prev + 1, totalUpcomingPages))}
                  className="p-1 rounded-md border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Speech Bubble Icon */}
      <button className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-[#0e71eb] text-white shadow-lg hover:bg-[#0b5cbe] transition-all flex items-center justify-center z-40 active:scale-95 cursor-pointer">
        <MessageCircle className="w-5 h-5 fill-current text-white" />
      </button>
    </div>
  );
};


'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Video,
  Copy,
  Check,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Box
} from 'lucide-react';
import { UserProfile, Meeting, createInstantMeeting, fetchUpcomingMeetings, fetchRecentMeetings } from '@/lib/api';

interface DashboardProps {
  user: UserProfile | null;
  onOpenJoin: () => void;
  onOpenSchedule: () => void;
  onStartMeeting: (meetingId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onOpenJoin,
  onOpenSchedule,
  onStartMeeting,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [upcoming, setUpcoming] = useState<Meeting[]>([]);
  const [recent, setRecent] = useState<Meeting[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);

  // Load upcoming and recent meetings from FastAPI backend
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
    const pmi = user?.personal_meeting_id || '6997723211';
    const formatted = `${pmi.slice(0, 3)} ${pmi.slice(3, 6)} ${pmi.slice(6)}`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
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

  return (
    <div className="flex-1 bg-slate-100/70 p-4 lg:p-8 space-y-6 overflow-y-auto">
      {/* Top Welcome Banner & Digital Clock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-zoom-blue flex items-center justify-center font-bold text-lg border border-blue-200 shadow-2xs">
            {user ? user.name.split(' ').map(n => n[0]).join('') : 'JT'}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Welcome back, {user ? user.name : 'Arman'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Plan: <span className="font-semibold text-zoom-blue">{user?.plan_type || 'Workplace Basic'}</span> | Account ID: 699-772-3211
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyPmi}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg transition-colors border border-slate-200"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedId ? 'Copied PMI!' : 'Copy PMI'}</span>
          </button>

          <button className="px-3.5 py-1.5 text-xs font-bold bg-zoom-blue text-white rounded-lg shadow-2xs hover:bg-zoom-blue-hover transition-colors">
            Manage Plan
          </button>
        </div>
      </div>

      {/* Main Grid: Hero Actions & Meetings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Quick Action Buttons & Promo Banner */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Action Cards Container */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-3 gap-4">
              {/* 1. Schedule Button */}
              <button
                onClick={onOpenSchedule}
                className="group flex flex-col items-center justify-center p-5 bg-blue-50/60 hover:bg-blue-100/60 border border-blue-100 rounded-2xl transition-all duration-150 active:scale-98"
              >
                <div className="w-12 h-12 rounded-xl bg-zoom-blue text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2.5">
                  <span className="font-bold text-base leading-none">19</span>
                </div>
                <span className="text-xs font-bold text-slate-800">Schedule</span>
              </button>

              {/* 2. Join Button */}
              <button
                onClick={onOpenJoin}
                className="group flex flex-col items-center justify-center p-5 bg-blue-50/60 hover:bg-blue-100/60 border border-blue-100 rounded-2xl transition-all duration-150 active:scale-98"
              >
                <div className="w-12 h-12 rounded-xl bg-zoom-blue text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2.5">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold text-slate-800">Join</span>
              </button>

              {/* 3. Host Button (Orange) */}
              <button
                onClick={handleInstantMeeting}
                className="group flex flex-col items-center justify-center p-5 bg-orange-50/60 hover:bg-orange-100/60 border border-orange-100 rounded-2xl transition-all duration-150 active:scale-98"
              >
                <div className="w-12 h-12 rounded-xl bg-zoom-orange text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-2.5">
                  <Video className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800">Host</span>
              </button>
            </div>

            {/* Personal Meeting ID Copy Bar */}
            <div className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <span className="font-semibold text-slate-500">Personal Meeting ID:</span>
                <span className="font-mono font-bold text-slate-900">
                  {user?.personal_meeting_id ? `${user.personal_meeting_id.slice(0, 3)} ${user.personal_meeting_id.slice(3, 6)} ${user.personal_meeting_id.slice(6)}` : '699 772 3211'}
                </span>
              </div>
              <button
                onClick={handleCopyPmi}
                className="flex items-center space-x-1 text-zoom-blue hover:text-zoom-blue-hover font-bold transition-colors"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Workplace Pro Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 rounded-2xl shadow-xs border border-blue-700 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-block text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Workplace Pro • Limited time offer!
              </span>
              <h3 className="text-base font-bold">Upgrade to Zoom Workplace Pro</h3>
              <p className="text-xs text-blue-100 max-w-sm">
                Get unlimited meeting duration, AI Companion automated summaries, and 5GB cloud recording storage.
              </p>
            </div>
            <button className="whitespace-nowrap px-5 py-2.5 text-xs font-bold bg-white text-zoom-blue rounded-xl shadow-xs hover:bg-blue-50 transition-colors">
              Get offer
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Upcoming Meetings & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Meetings Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">Meetings</h2>
              <button className="text-xs font-semibold text-zoom-blue hover:underline">
                Visit Meetings
              </button>
            </div>

            {isLoadingMeetings ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading scheduled meetings...</div>
            ) : upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((m) => (
                  <div key={m.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 hover:border-blue-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>ID: {m.id}</span>
                          {m.passcode && <span className="text-slate-400">• Passcode: {m.passcode}</span>}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        {m.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <button
                        onClick={() => handleCopyInviteUrl(m.invite_url, m.id)}
                        className="text-[11px] font-medium text-slate-600 hover:text-zoom-blue flex items-center space-x-1"
                      >
                        {copiedLink === m.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLink === m.id ? 'Copied Link' : 'Copy Link'}</span>
                      </button>

                      <button
                        onClick={() => onStartMeeting(m.id)}
                        className="px-3 py-1 text-xs font-bold bg-zoom-blue hover:bg-zoom-blue-hover text-white rounded-lg shadow-2xs transition-colors"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <Box className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-medium text-slate-500">No Upcoming Meetings</p>
              </div>
            )}

            <div className="pt-4 mt-auto">
              <button className="w-full py-2 text-xs font-semibold text-zoom-blue bg-blue-50 hover:bg-blue-100/80 rounded-xl transition-colors border border-blue-100">
                Test Audio and Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-800 mb-4">Recent activity</h2>

        {recent.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recent.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-800">{m.title}</h4>
                  <span className="text-slate-400">Meeting ID: {m.id}</span>
                </div>
                <span className="text-slate-400 font-medium">Ended</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Box className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-medium text-slate-600">No recent activity</p>
            <p className="text-[11px] text-slate-400">
              Meetings, whiteboards, and recordings you create or interact with will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { scheduleMeeting } from '@/lib/api';
import { AlertTriangle, Info, Plus } from 'lucide-react';

export default function DedicatedSchedulePage() {
  const router = useRouter();

  const [topic, setTopic] = useState('My Meeting');
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState('2026-09-30');
  const [timeStr, setTimeStr] = useState('03:30');
  const [ampm, setAmpm] = useState('AM');
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [timeZone, setTimeZone] = useState('(GMT+05:30) India');
  const [usePersonalId, setUsePersonalId] = useState(false);
  const [passcode, setPasscode] = useState('507797');
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [hostVideoOn, setHostVideoOn] = useState(true);
  const [participantVideoOn, setParticipantVideoOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState('');

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setScheduleError('');

    try {
      const scheduledStart = new Date(`${dateStr}T${timeStr}:00Z`).toISOString();
      const totalMinutes = durationHours * 60 + durationMinutes;

      await scheduleMeeting({
        title: topic,
        description,
        scheduled_start: scheduledStart,
        duration_minutes: totalMinutes,
        passcode,
        use_personal_id: usePersonalId
      });

      router.push('/');
    } catch (err: any) {
      setScheduleError(err.message || 'Meeting schedule conflict! Only one meeting is allowed at a particular timestamp.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans select-none">
      <Navbar user={{ id: '1', name: 'Arman Redhu', email: 'arman@zoomclone.local', plan_type: 'Workplace Basic', personal_meeting_id: '3527955122', created_at: '' }} />

      <div className="flex flex-1">
        <Sidebar activeTab="meetings" setActiveTab={() => {}} />

        {/* Main Schedule Workspace matching Image 2 */}
        <main className="flex-1 bg-white p-6 lg:p-10 max-w-4xl space-y-6 text-xs text-slate-800">
          {/* Back Link */}
          <Link href="/" className="inline-block text-xs font-semibold text-[#0e71eb] hover:underline mb-2">
            &lt; Back to Meetings
          </Link>

          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Schedule Meeting
          </h1>

          {scheduleError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold flex items-center space-x-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{scheduleError}</span>
            </div>
          )}

          <form onSubmit={handleSaveSchedule} className="space-y-6">
            {/* Topic */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="font-semibold text-slate-700 md:text-right">
                <span className="text-red-500 mr-0.5">*</span>Topic
              </label>
              <div className="md:col-span-3 space-y-1.5">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs font-medium focus:border-zoom-blue focus:outline-none"
                />
                {!showDescription && (
                  <button
                    type="button"
                    onClick={() => setShowDescription(true)}
                    className="text-zoom-blue font-semibold hover:underline flex items-center space-x-1 pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Description</span>
                  </button>
                )}
                {showDescription && (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter meeting description..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs font-medium focus:border-zoom-blue focus:outline-none mt-2"
                  />
                )}
              </div>
            </div>

            {/* When */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="font-semibold text-slate-700 md:text-right">
                When
              </label>
              <div className="md:col-span-3 flex items-center space-x-2">
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-md focus:border-zoom-blue focus:outline-none"
                />
                <input
                  type="time"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-md focus:border-zoom-blue focus:outline-none"
                />
                <select
                  value={ampm}
                  onChange={(e) => setAmpm(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-md focus:border-zoom-blue focus:outline-none font-semibold"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="font-semibold text-slate-700 md:text-right">
                Duration
              </label>
              <div className="md:col-span-3 flex items-center space-x-2">
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="px-3 py-1.5 border border-slate-300 rounded-md focus:border-zoom-blue focus:outline-none"
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
                <span className="font-medium text-slate-600">hr</span>

                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="px-3 py-1.5 border border-slate-300 rounded-md focus:border-zoom-blue focus:outline-none"
                >
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={45}>45</option>
                  <option value={60}>60</option>
                </select>
                <span className="font-medium text-slate-600">min</span>
              </div>
            </div>

            {/* Basic Plan Upgrade Banner matching Image 2 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div />
              <div className="md:col-span-3 bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-amber-900 text-[11px] leading-relaxed flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span>You can schedule meetings for up to 40 minutes each with your current Basic plan. Need more time? </span>
                  <a href="#" className="text-zoom-blue font-semibold hover:underline">Upgrade to Zoom Workplace Pro</a>
                </div>
              </div>
            </div>

            {/* Time Zone */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="font-semibold text-slate-700 md:text-right">
                Time Zone
              </label>
              <div className="md:col-span-3">
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full md:w-80 px-3 py-1.5 border border-slate-300 rounded-md focus:border-zoom-blue focus:outline-none"
                >
                  <option value="(GMT+05:30) India">(GMT+05:30) India</option>
                  <option value="(GMT-08:00) Pacific Time">(GMT-08:00) Pacific Time</option>
                  <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                </select>
              </div>
            </div>

            {/* Meeting ID Radios matching Image 2 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <label className="font-semibold text-slate-700 md:text-right">
                Meeting ID
              </label>
              <div className="md:col-span-3 space-x-6">
                <label className="inline-flex items-center space-x-2 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="meetingIdRadio"
                    checked={!usePersonalId}
                    onChange={() => setUsePersonalId(false)}
                    className="text-zoom-blue focus:ring-zoom-blue"
                  />
                  <span>Generate Automatically</span>
                </label>

                <label className="inline-flex items-center space-x-2 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="meetingIdRadio"
                    checked={usePersonalId}
                    onChange={() => setUsePersonalId(true)}
                    className="text-zoom-blue focus:ring-zoom-blue"
                  />
                  <span>Personal Meeting ID 944 772 6574</span>
                </label>
              </div>
            </div>

            {/* Security Passcode & Waiting Room matching Image 2 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              <label className="font-semibold text-slate-700 md:text-right pt-1">
                Security
              </label>
              <div className="md:col-span-3 space-y-3">
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 font-medium cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-zoom-blue" />
                    <span>Passcode</span>
                  </label>
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-28 px-2.5 py-1 border border-slate-300 rounded font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 pl-6">
                  Only users who have the invite link or passcode can join the meeting
                </p>

                <label className="flex items-center space-x-2 font-medium cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={waitingRoom}
                    onChange={(e) => setWaitingRoom(e.target.checked)}
                    className="rounded text-zoom-blue"
                  />
                  <span>Waiting Room</span>
                </label>
                <p className="text-[11px] text-slate-500 pl-6">
                  Only users admitted by the host can join the meeting
                </p>
              </div>
            </div>

            {/* Video Host/Participant ON/OFF Radios matching Image 2 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-t border-slate-100 pt-4">
              <label className="font-semibold text-slate-700 md:text-right">
                Video
              </label>
              <div className="md:col-span-3 space-y-2">
                <div className="flex items-center space-x-6">
                  <span className="w-20 font-semibold text-slate-600">Host</span>
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="hostVideo"
                      checked={hostVideoOn}
                      onChange={() => setHostVideoOn(true)}
                      className="text-zoom-blue"
                    />
                    <span>on</span>
                  </label>
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="hostVideo"
                      checked={!hostVideoOn}
                      onChange={() => setHostVideoOn(false)}
                      className="text-zoom-blue"
                    />
                    <span>off</span>
                  </label>
                </div>

                <div className="flex items-center space-x-6">
                  <span className="w-20 font-semibold text-slate-600">Participant</span>
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="partVideo"
                      checked={participantVideoOn}
                      onChange={() => setParticipantVideoOn(true)}
                      className="text-zoom-blue"
                    />
                    <span>on</span>
                  </label>
                  <label className="inline-flex items-center space-x-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="partVideo"
                      checked={!participantVideoOn}
                      onChange={() => setParticipantVideoOn(false)}
                      className="text-zoom-blue"
                    />
                    <span>off</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Save & Cancel Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
              <div />
              <div className="md:col-span-3 flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-zoom-blue hover:bg-zoom-blue-hover text-white font-bold text-xs rounded-md shadow-2xs transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <Link
                  href="/"
                  className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-md transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}

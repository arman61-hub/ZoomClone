'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { scheduleMeeting, Meeting } from '@/lib/api';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduledSuccess: (meeting: Meeting) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onScheduledSuccess }) => {
  const [topic, setTopic] = useState('Sprint Planning & Architecture Sync');
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState('2026-10-01');
  const [timeStr, setTimeStr] = useState('10:00');
  const [duration, setDuration] = useState(45);
  const [usePersonalId, setUsePersonalId] = useState(false);
  const [passcode, setPasscode] = useState('839201');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg('Please enter a meeting topic.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const scheduledStart = new Date(`${dateStr}T${timeStr}:00Z`).toISOString();
      const meeting = await scheduleMeeting({
        title: topic,
        description,
        scheduled_start: scheduledStart,
        duration_minutes: Number(duration),
        passcode,
        use_personal_id: usePersonalId
      });

      onScheduledSuccess(meeting);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule meeting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">Schedule Meeting</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSchedule} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {/* Topic */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Meeting Title"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-zoom-blue focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Agenda or topics to discuss..."
              rows={2}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-zoom-blue focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-zoom-blue focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Time</span>
              </label>
              <input
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-zoom-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-zoom-blue focus:outline-none"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>

          {/* Meeting ID */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-700 mb-2">
              Meeting ID
            </label>
            <div className="space-y-1.5 text-slate-700">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="meetingIdType"
                  checked={!usePersonalId}
                  onChange={() => setUsePersonalId(false)}
                  className="text-zoom-blue focus:ring-zoom-blue"
                />
                <span>Generate Automatically</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="meetingIdType"
                  checked={usePersonalId}
                  onChange={() => setUsePersonalId(true)}
                  className="text-zoom-blue focus:ring-zoom-blue"
                />
                <span>Personal Meeting ID (699-772-3211)</span>
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-700 mb-2">
              Security
            </label>
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-slate-600">Passcode:</span>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-32 px-3 py-1 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-800 focus:bg-white focus:border-zoom-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold text-white bg-zoom-blue hover:bg-zoom-blue-hover rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Scheduling...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

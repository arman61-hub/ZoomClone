'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { fetchMeetingById } from '@/lib/api';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess: (meetingId: string, displayName: string, audioOff: boolean, videoOff: boolean) => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, onJoinSuccess }) => {
  const [meetingInput, setMeetingInput] = useState('');
  const [displayName, setDisplayName] = useState('Arman');
  const [noAudio, setNoAudio] = useState(false);
  const [noVideo, setNoVideo] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingInput.trim()) {
      setErrorMsg('Please enter a Meeting ID or Invite Link.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    // Extract ID if full URL pasted
    let cleanId = meetingInput.trim();
    if (cleanId.includes('/meeting/')) {
      cleanId = cleanId.split('/meeting/')[1].split('?')[0];
    }

    try {
      // Validate meeting with backend API
      const meeting = await fetchMeetingById(cleanId);
      onJoinSuccess(meeting.id, displayName, noAudio, noVideo);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid Meeting ID. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800">Join Meeting</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleJoin} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Meeting ID or Personal Link Name
            </label>
            <input
              type="text"
              value={meetingInput}
              onChange={(e) => setMeetingInput(e.target.value)}
              placeholder="Enter 10-digit Meeting ID (e.g. 699-772-3211)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono focus:bg-white focus:border-zoom-blue focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-zoom-blue focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-2 space-y-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={noAudio}
                onChange={(e) => setNoAudio(e.target.checked)}
                className="w-4 h-4 rounded text-zoom-blue focus:ring-zoom-blue border-slate-300"
              />
              <span className="text-slate-700 font-medium">Do not connect to audio</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={noVideo}
                onChange={(e) => setNoVideo(e.target.checked)}
                className="w-4 h-4 rounded text-zoom-blue focus:ring-zoom-blue border-slate-300"
              />
              <span className="text-slate-700 font-medium">Turn off my video</span>
            </label>
          </div>

          {/* Footer Actions */}
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
              {isLoading ? 'Connecting...' : 'Join'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Meeting } from '@/lib/api';

interface CopyInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: {
    id: string;
    title: string;
    passcode?: string;
    scheduled_start?: string;
    time_str?: string;
    hostName?: string;
  } | null;
}

export const CopyInvitationModal: React.FC<CopyInvitationModalProps> = ({
  isOpen,
  onClose,
  meeting
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !meeting) return null;

  const hostName = meeting.hostName || 'Arman Redhu';
  const topic = meeting.title || 'My Meeting';
  const rawId = meeting.id.replace(/\D/g, '');
  const formattedId = rawId.length === 10 
    ? `${rawId.slice(0, 3)} ${rawId.slice(3, 6)} ${rawId.slice(6)}`
    : meeting.id;
  const passcode = meeting.passcode || '352795';
  const timeStr = meeting.time_str || 'Sep 30, 2026 01:00 AM Pacific Time (US and Canada)';

  const invitationText = `${hostName} is inviting you to a scheduled Zoom meeting.

Topic: ${topic}
Time: ${timeStr}

Join Zoom Meeting
http://localhost:3000/join?meetingId=${rawId}&passcode=${passcode}

Meeting chat link
http://localhost:3000/wc/${rawId}/join

Meeting ID: ${formattedId}
Passcode: ${passcode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 font-sans select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 lg:p-7 max-w-xl w-full shadow-2xl space-y-5 relative border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#131619]">
            Copy Meeting Invitation
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Textarea Box matching Image 2 */}
        <div className="border-2 border-[#0e71eb] bg-[#f4f8ff] rounded-2xl p-4">
          <textarea
            readOnly
            rows={11}
            value={invitationText}
            className="w-full bg-transparent text-[#525266] text-xs font-normal leading-relaxed focus:outline-none resize-none font-sans"
          />
        </div>

        {/* Bottom Buttons matching Image 2 */}
        <div className="flex items-center justify-end space-x-3 pt-1">
          <button
            onClick={handleCopy}
            className="px-6 py-2.5 bg-[#0e71eb] hover:bg-[#0b5cbe] text-white font-semibold text-xs rounded-full transition-colors cursor-pointer flex items-center space-x-1.5 shadow-none"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : null}
            <span>{copied ? 'Copied!' : 'Copy Meeting Invitation'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#f0f6ff] hover:bg-blue-100/80 text-[#0e71eb] font-semibold text-xs rounded-full transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

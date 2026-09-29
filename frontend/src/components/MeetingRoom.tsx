'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Shield,
  Users,
  MessageSquare,
  Share2,
  Smile,
  PhoneOff,
  Copy,
  Check,
  Grid,
  Maximize2,
  X,
  Send,
  UserX,
  VolumeX,
  Hand
} from 'lucide-react';
import { useWebRTC } from '@/lib/useWebRTC';

interface MeetingRoomProps {
  meetingId: string;
  displayName: string;
  initialAudioOff: boolean;
  initialVideoOff: boolean;
  onLeaveMeeting: () => void;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  meetingId,
  displayName,
  initialAudioOff,
  initialVideoOff,
  onLeaveMeeting,
}) => {
  const isHost = true; // Default user is host
  const participantId = useRef(`user-${Math.random().toString(36).substr(2, 9)}`).current;

  const {
    localStream,
    initLocalStream,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    isHandRaised,
    participants,
    chatMessages,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    toggleHandRaise,
    sendChatMessage,
    hostMuteAll,
    hostRemoveParticipant
  } = useWebRTC(meetingId, participantId, displayName, isHost);

  const [activePanel, setActivePanel] = useState<'participants' | 'chat' | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'speaker'>('gallery');

  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initLocalStream(!initialAudioOff, !initialVideoOff);
  }, [initLocalStream, initialAudioOff, initialVideoOff]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendChatMessage(chatInput);
      setChatInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1A1C23] text-white font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 bg-[#0F1015] border-b border-slate-800 px-4 flex items-center justify-between z-30 select-none">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2.5 py-1 rounded-md text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 fill-current" />
            <span>Encrypted</span>
          </div>

          <div className="hidden sm:flex flex-col">
            <h1 className="text-xs font-bold text-white tracking-wide">
              Zoom Meeting Room
            </h1>
            <span className="text-[11px] text-slate-400 font-mono">
              ID: {meetingId}
            </span>
          </div>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedId ? 'Copied Link' : 'Copy Invite'}</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'gallery' ? 'speaker' : 'gallery')}
            className="flex items-center space-x-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <Grid className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{viewMode} View</span>
          </button>
        </div>
      </header>

      {/* Main Workspace (Video Grid + Side Panel) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Video Grid */}
        <main className="flex-1 p-4 flex items-center justify-center overflow-hidden bg-[#1A1C23]">
          <div className={`w-full h-full grid gap-4 place-content-center ${
            participants.length <= 1
              ? 'grid-cols-1 max-w-4xl max-h-[80vh]'
              : participants.length <= 4
              ? 'grid-cols-2 max-w-5xl max-h-[85vh]'
              : 'grid-cols-3 max-w-6xl max-h-[85vh]'
          }`}>
            {/* Local Video Tile */}
            <div className="relative bg-[#242731] rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl flex items-center justify-center group">
              {!isVideoOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl border-2 border-blue-400 shadow-md">
                    {displayName.split(' ').map(n => n[0]).join('') || 'JT'}
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Video Off</span>
                </div>
              )}

              {/* Participant Label & Mic indicator */}
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg flex items-center space-x-2 text-xs font-medium border border-slate-800">
                <span className="text-white font-bold">{displayName} (You)</span>
                {isAudioMuted ? (
                  <MicOff className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {isHandRaised && <Hand className="w-3.5 h-3.5 text-amber-400 animate-bounce" />}
              </div>
            </div>

            {/* Remote Participants Dummy Video Grid */}
            {participants.filter(p => p.id !== participantId).map((p, idx) => (
              <div key={p.id || idx} className="relative bg-[#242731] rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center group">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl border-2 border-indigo-400 shadow-md">
                    {p.displayName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Connected</span>
                </div>

                <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg flex items-center space-x-2 text-xs font-medium border border-slate-800">
                  <span className="text-white font-bold">{p.displayName}</span>
                  {p.isAudioMuted ? (
                    <MicOff className="w-3.5 h-3.5 text-red-500" />
                  ) : (
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Side Drawers (Participants & Chat) */}
        {activePanel && (
          <aside className="w-80 bg-[#161922] border-l border-slate-800 flex flex-col z-20 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {activePanel === 'participants' ? `Participants (${participants.length || 1})` : 'In-Meeting Chat'}
              </h3>
              <button
                onClick={() => setActivePanel(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Participants Panel */}
            {activePanel === 'participants' && (
              <div className="flex-1 flex flex-col p-4 space-y-4">
                {isHost && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={hostMuteAll}
                      className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <VolumeX className="w-3.5 h-3.5 text-red-400" />
                      <span>Mute All</span>
                    </button>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto space-y-2">
                  {/* Local User */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-xl text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {displayName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-bold text-white">{displayName} (Host, me)</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      {isAudioMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                      {isVideoOff ? <VideoOff className="w-3.5 h-3.5 text-red-400" /> : <VideoIcon className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                  </div>

                  {/* Remote Participants */}
                  {participants.filter(p => p.id !== participantId).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-800/30 rounded-xl text-xs hover:bg-slate-800/60 transition-colors">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          {p.displayName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-slate-200">{p.displayName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isHost && (
                          <button
                            onClick={() => hostRemoveParticipant(p.id)}
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md"
                            title="Remove participant"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Panel */}
            {activePanel === 'chat' && (
              <div className="flex-1 flex flex-col h-full">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {chatMessages.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-8">
                      No messages yet. Send a message to everyone in the meeting.
                    </p>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} className="bg-slate-800/60 p-2.5 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                          <span className="font-bold text-blue-400">{msg.senderName}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 flex items-center space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-zoom-blue"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-zoom-blue text-white rounded-xl hover:bg-zoom-blue-hover transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Bottom Floating Toolbar */}
      <footer className="h-16 bg-[#0F1015] border-t border-slate-800 px-6 flex items-center justify-between z-30 select-none">
        {/* Left: Audio & Video Controls */}
        <div className="flex items-center space-x-2">
          {/* Audio Mute Button */}
          <button
            onClick={toggleAudio}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 rounded-xl text-[11px] font-semibold transition-all ${
              isAudioMuted
                ? 'text-red-400 hover:bg-red-950/40'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isAudioMuted ? <MicOff className="w-5 h-5 mb-0.5 text-red-500" /> : <Mic className="w-5 h-5 mb-0.5 text-emerald-400" />}
            <span>{isAudioMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* Video Toggle Button */}
          <button
            onClick={toggleVideo}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 rounded-xl text-[11px] font-semibold transition-all ${
              isVideoOff
                ? 'text-red-400 hover:bg-red-950/40'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5 mb-0.5 text-red-500" /> : <VideoIcon className="w-5 h-5 mb-0.5 text-emerald-400" />}
            <span>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
          </button>
        </div>

        {/* Center: In-Meeting Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Security */}
          <button className="flex flex-col items-center justify-center min-w-[56px] h-12 rounded-xl text-[11px] font-semibold text-slate-200 hover:bg-slate-800 transition-all">
            <Shield className="w-5 h-5 mb-0.5 text-slate-400" />
            <span>Security</span>
          </button>

          {/* Participants */}
          <button
            onClick={() => setActivePanel(activePanel === 'participants' ? null : 'participants')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 rounded-xl text-[11px] font-semibold transition-all ${
              activePanel === 'participants' ? 'bg-slate-800 text-zoom-blue' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5 text-slate-300" />
            <span>Participants</span>
          </button>

          {/* Chat */}
          <button
            onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 rounded-xl text-[11px] font-semibold transition-all ${
              activePanel === 'chat' ? 'bg-slate-800 text-zoom-blue' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5 text-slate-300" />
            <span>Chat</span>
          </button>

          {/* Share Screen (Bright Green) */}
          <button
            onClick={toggleScreenShare}
            className={`flex flex-col items-center justify-center min-w-[64px] h-12 rounded-xl text-[11px] font-bold transition-all ${
              isScreenSharing
                ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-700'
                : 'text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <Share2 className="w-5 h-5 mb-0.5 text-emerald-400" />
            <span>Share Screen</span>
          </button>

          {/* Reactions */}
          <button
            onClick={toggleHandRaise}
            className={`flex flex-col items-center justify-center min-w-[56px] h-12 rounded-xl text-[11px] font-semibold transition-all ${
              isHandRaised ? 'bg-amber-950/60 text-amber-400' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Smile className="w-5 h-5 mb-0.5 text-slate-300" />
            <span>Reactions</span>
          </button>
        </div>

        {/* Right: End Meeting Button */}
        <div>
          <button
            onClick={onLeaveMeeting}
            className="flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

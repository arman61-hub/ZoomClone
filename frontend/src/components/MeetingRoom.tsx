'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Shield,
  Users,
  MessageSquare,
  Share2,
  Heart,
  MoreHorizontal,
  X,
  Send,
  UserX,
  VolumeX,
  Info,
  Maximize2,
  AlertTriangle,
  ChevronUp,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useWebRTC, ParticipantInfo } from '@/lib/useWebRTC';

interface RemoteVideoTileProps {
  participant: ParticipantInfo;
  stream?: MediaStream;
}

const RemoteVideoTile: React.FC<RemoteVideoTileProps> = ({ participant, stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full min-h-[220px] bg-[#222222] rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl flex items-center justify-center">
      {stream && !participant.isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            {participant.displayName[0]?.toUpperCase() || 'G'}
          </div>
          <span className="font-bold text-slate-200 text-sm">{participant.displayName}</span>
        </div>
      )}

      {/* Bottom Left Name Tag */}
      <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-xs rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-1.5 border border-slate-700/50">
        {participant.isAudioMuted ? (
          <MicOff className="w-3.5 h-3.5 text-red-500" />
        ) : (
          <Mic className="w-3.5 h-3.5 text-slate-300" />
        )}
        <span>{participant.displayName} {participant.isHost ? '(Host)' : ''}</span>
      </div>
    </div>
  );
};

interface MeetingRoomProps {
  meetingId: string;
  displayName: string;
  initialAudioOff: boolean;
  initialVideoOff: boolean;
  isHost?: boolean;
  hostName?: string;
  passcode?: string;
  onLeaveMeeting: () => void;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  meetingId,
  displayName,
  initialAudioOff,
  initialVideoOff,
  isHost = false,
  hostName = 'Arman',
  passcode,
  onLeaveMeeting,
}) => {
  const router = useRouter();
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
    remoteStreams,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    toggleHandRaise,
    sendChatMessage,
    hostMuteAll,
    hostRemoveParticipant,
    endMeetingForAll
  } = useWebRTC(meetingId, participantId, displayName, isHost);

  const [activePanel, setActivePanel] = useState<'participants' | 'chat' | null>('participants');
  const [chatInput, setChatInput] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCameraWarning, setShowCameraWarning] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initLocalStream(!initialAudioOff, !initialVideoOff);
  }, [initLocalStream, initialAudioOff, initialVideoOff]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendChatMessage(chatInput);
      setChatInput('');
    }
  };

  const handleEndMeetingForAll = () => {
    if (isHost) {
      endMeetingForAll();
    }
    onLeaveMeeting ? onLeaveMeeting() : router.push('/');
  };

  const handleLeaveMeetingOnly = () => {
    onLeaveMeeting ? onLeaveMeeting() : router.push('/leave');
  };

  const [copyNotification, setCopyNotification] = useState(false);

  const handleCopyInviteLink = () => {
    const passQuery = passcode ? `&passcode=${encodeURIComponent(passcode)}` : '';
    const inviteUrl = `${window.location.origin}/join?meetingId=${encodeURIComponent(meetingId)}${passQuery}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 2500);
  };

  const otherParticipants = participants.filter(p => p.id !== participantId);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#141414] text-white font-sans overflow-hidden select-none relative">
      {/* Top Header Bar matching Image 2 */}
      <header className="h-10 bg-[#0A0A0A] px-4 flex items-center justify-between z-30 border-b border-slate-900 text-xs">
        {/* Left: Meeting Title */}
        <div className="flex items-center space-x-2 text-slate-200">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold tracking-tight">{hostName}'s Zoom Meeting</span>
        </div>

        {/* Right: Security & Utility Icons */}
        <div className="flex items-center space-x-3 text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
          <SlidersHorizontal className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
          <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
            {displayName[0]?.toUpperCase() || 'A'}
          </div>
        </div>
      </header>

      {/* Copy Link Toast Notification */}
      {copyNotification && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#0e71eb] text-white text-xs px-4 py-2 rounded-xl shadow-xl font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <span>✔ Invite link copied to clipboard!</span>
        </div>
      )}

      {/* Camera Warning Banner matching Image 2 */}
      {showCameraWarning && !copyNotification && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 bg-[#1A1A1A]/90 border border-amber-500/40 text-amber-200 text-xs px-4 py-1.5 rounded-xl flex items-center space-x-2 shadow-lg">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Please enable access to your <button onClick={toggleVideo} className="text-blue-400 underline cursor-pointer">camera</button> for the best experience.</span>
          <button onClick={() => setShowCameraWarning(false)} className="text-slate-400 hover:text-white ml-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Stage Canvas */}
        <main className="flex-1 relative flex items-center justify-center bg-[#141414] p-4">
          {otherParticipants.length === 0 ? (
            /* Single User Stage View */
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-28 h-28 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-4xl shadow-xl">
                  {displayName[0]?.toUpperCase() || 'A'}
                </div>
                <span className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  {displayName}
                </span>
              </div>

              {/* Self View PIP Thumbnail Box */}
              <div className="absolute top-4 right-4 w-48 h-32 bg-[#222222] rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
                {!isVideoOff ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-slate-300 font-bold text-sm">
                    {displayName}
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/70 rounded text-[10px] text-slate-300 font-medium">
                  {displayName} (me)
                </div>
              </div>

              <div className="absolute bottom-4 left-4 px-2.5 py-1 bg-black/80 rounded text-xs font-semibold text-slate-300 border border-slate-800">
                {displayName}
              </div>
            </div>
          ) : (
            /* Multi-Participant Video Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full h-full max-w-6xl max-h-[82vh] p-2 items-center justify-center">
              {/* Local User Tile */}
              <div className="relative w-full h-full min-h-[220px] bg-[#222222] rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl flex items-center justify-center">
                {!isVideoOff ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                      {displayName[0]?.toUpperCase() || 'A'}
                    </div>
                    <span className="font-bold text-slate-200 text-sm">{displayName}</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-xs rounded-lg text-xs font-semibold text-slate-200 flex items-center space-x-1.5 border border-slate-700/50">
                  {isAudioMuted ? <MicOff className="w-3.5 h-3.5 text-red-500" /> : <Mic className="w-3.5 h-3.5 text-slate-300" />}
                  <span>{displayName} (me)</span>
                </div>
              </div>

              {/* Remote Participants Tiles */}
              {otherParticipants.map((p) => (
                <RemoteVideoTile key={p.id} participant={p} stream={remoteStreams[p.id]} />
              ))}
            </div>
          )}
        </main>

        {/* Right Drawer: Participants Panel matching Image 2 */}
        {activePanel === 'participants' && (
          <aside className="w-80 bg-[#1A1A1E] border-l border-slate-800/80 flex flex-col z-20 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-200">
                Participants ({participants.length || 1})
              </h3>
              <div className="flex items-center space-x-2 text-slate-400">
                <ExternalLink className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                <button onClick={() => setActivePanel(null)} className="hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
              {/* Local User */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                    {displayName[0]?.toUpperCase() || 'A'}
                  </div>
                  <span className="font-semibold text-slate-200">
                    {displayName} ({isHost ? 'Host, me' : 'me'})
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  {isAudioMuted ? <MicOff className="w-3.5 h-3.5 text-red-500" /> : <Mic className="w-3.5 h-3.5 text-slate-300" />}
                  {isVideoOff ? <VideoOff className="w-3.5 h-3.5 text-red-500" /> : <VideoIcon className="w-3.5 h-3.5 text-slate-300" />}
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Remote Participants */}
              {participants.filter(p => p.id !== participantId).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                      {p.displayName[0]?.toUpperCase() || 'G'}
                    </div>
                    <span className="font-semibold text-slate-200">
                      {p.displayName} ({p.isHost ? 'Host' : 'Guest'})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    {p.isAudioMuted ? <MicOff className="w-3.5 h-3.5 text-red-500" /> : <Mic className="w-3.5 h-3.5 text-slate-300" />}
                    {p.isVideoOff ? <VideoOff className="w-3.5 h-3.5 text-red-500" /> : <VideoIcon className="w-3.5 h-3.5 text-slate-300" />}
                    {isHost && (
                      <button onClick={() => hostRemoveParticipant(p.id)} className="text-red-400 hover:text-red-300 text-[10px] underline ml-1 cursor-pointer">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions in Participants Drawer */}
            <div className="p-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={handleCopyInviteLink}
                className="flex-1 py-1.5 px-3 bg-[#2D2D38] hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Invite
              </button>
              {isHost && (
                <button
                  onClick={hostMuteAll}
                  className="flex-1 py-1.5 px-3 bg-[#2D2D38] hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Mute All
                </button>
              )}
              <button
                onClick={handleCopyInviteLink}
                className="flex-1 py-1.5 px-3 bg-[#2D2D38] hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Share Link
              </button>
            </div>
          </aside>
        )}

        {/* Right Drawer: Chat Panel */}
        {activePanel === 'chat' && (
          <aside className="w-80 bg-[#1A1A1E] border-l border-slate-800 flex flex-col z-20 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-200">In-Meeting Chat</h3>
              <button onClick={() => setActivePanel(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {chatMessages.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No messages yet.</p>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className="bg-slate-800/60 p-2.5 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-blue-400">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-200">{msg.message}</p>
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
                className="flex-1 px-3 py-1.5 bg-[#0A0A0A] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-zoom-blue"
              />
              <button type="submit" className="p-1.5 bg-zoom-blue text-white rounded-lg hover:bg-zoom-blue-hover">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* Bottom Control Bar matching Image 2 */}
      <footer className="h-16 bg-[#0A0A0A] border-t border-slate-900 px-6 flex items-center justify-between z-30 select-none">
        <div className="flex items-center space-x-3">
          {/* Mute Button */}
          <button
            onClick={toggleAudio}
            className="flex flex-col items-center justify-center min-w-[50px] text-slate-300 hover:text-white transition-colors"
          >
            {isAudioMuted ? <MicOff className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5" />}
            <span className="text-[10px] mt-1 font-medium">{isAudioMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* Video Button */}
          <button
            onClick={toggleVideo}
            className="flex flex-col items-center justify-center min-w-[50px] text-slate-300 hover:text-white transition-colors"
          >
            {isVideoOff ? <VideoOff className="w-5 h-5 text-red-500" /> : <VideoIcon className="w-5 h-5" />}
            <span className="text-[10px] mt-1 font-medium">{isVideoOff ? 'Start Video' : 'Video'}</span>
          </button>
        </div>

        {/* Center Icons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActivePanel(activePanel === 'participants' ? null : 'participants')}
            className="flex flex-col items-center justify-center min-w-[50px] text-slate-300 hover:text-white transition-colors relative"
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Participants</span>
            <span className="absolute -top-1 right-2 text-[9px] font-bold bg-slate-800 text-white px-1.5 py-0.2 rounded-full border border-slate-700">
              {participants.length || 1}
            </span>
          </button>

          <button
            onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
            className="flex flex-col items-center justify-center min-w-[50px] text-slate-300 hover:text-white transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Chat</span>
          </button>

          <button
            onClick={toggleHandRaise}
            className="flex flex-col items-center justify-center min-w-[50px] text-slate-300 hover:text-white transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">React</span>
          </button>

          <button
            onClick={toggleScreenShare}
            className={`flex flex-col items-center justify-center min-w-[50px] transition-colors ${
              isScreenSharing ? 'text-emerald-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Share</span>
          </button>

          {isHost && (
            <button className="flex flex-col items-center justify-center min-w-[50px] text-slate-300 hover:text-white transition-colors">
              <Shield className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium">Host tools</span>
            </button>
          )}

          <button className="flex flex-col items-center justify-center min-w-[50px] text-slate-300 hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">More</span>
          </button>
        </div>

        {/* Right End Call Button matching Image 2 */}
        <div className="relative">
          <button
            onClick={() => setShowEndModal(!showEndModal)}
            className="flex items-center space-x-1 px-3.5 py-1.5 bg-[#E02828] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <span>✕</span>
            <span>End</span>
          </button>

          {/* End Call Modal matching Image 3 */}
          {showEndModal && (
            <div className="absolute bottom-14 right-0 z-50 bg-[#1A1A1E] border border-slate-800 rounded-2xl p-3 shadow-2xl w-56 space-y-2 animate-in fade-in zoom-in-95 duration-100">
              {isHost ? (
                <>
                  <button
                    onClick={handleEndMeetingForAll}
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-[#E02828] hover:bg-red-700 rounded-xl transition-colors text-center"
                  >
                    End Meeting for All
                  </button>
                  <button
                    onClick={handleLeaveMeetingOnly}
                    className="w-full py-2 px-3 text-xs font-bold text-slate-200 bg-[#2D2D38] hover:bg-slate-700 rounded-xl transition-colors text-center"
                  >
                    Leave Meeting
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLeaveMeetingOnly}
                  className="w-full py-2 px-3 text-xs font-bold text-slate-200 bg-[#2D2D38] hover:bg-slate-700 rounded-xl transition-colors text-center"
                >
                  Leave Meeting
                </button>
              )}

              <button
                onClick={() => setShowEndModal(false)}
                className="w-full text-center text-[11px] text-slate-400 hover:text-white pt-1"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

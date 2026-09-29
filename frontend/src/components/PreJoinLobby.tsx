'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Settings, Volume2 } from 'lucide-react';

interface PreJoinLobbyProps {
  meetingId: string;
  onJoinMeeting: (displayName: string, audioOff: boolean, videoOff: boolean) => void;
  onCancel: () => void;
}

export const PreJoinLobby: React.FC<PreJoinLobbyProps> = ({
  meetingId,
  onJoinMeeting,
  onCancel,
}) => {
  const [displayName, setDisplayName] = useState('Arman');
  const [isAudioOff, setIsAudioOff] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startPreview() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn('Media hardware access fallback:', err);
      }
    }
    startPreview();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleCam = () => {
    if (stream) {
      const vTrack = stream.getVideoTracks()[0];
      if (vTrack) {
        vTrack.enabled = !vTrack.enabled;
        setIsVideoOff(!vTrack.enabled);
      }
    } else {
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleMic = () => {
    if (stream) {
      const aTrack = stream.getAudioTracks()[0];
      if (aTrack) {
        aTrack.enabled = !aTrack.enabled;
        setIsAudioOff(!aTrack.enabled);
      }
    } else {
      setIsAudioOff(!isAudioOff);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    onJoinMeeting(displayName, isAudioOff, isVideoOff);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 text-center space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Ready to join meeting?</h2>
          <p className="text-xs text-slate-500 font-medium">Meeting ID: {meetingId}</p>

          {/* Video Preview Box */}
          <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
            {!isVideoOff ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-zoom-blue flex items-center justify-center font-bold text-xl border border-blue-200 shadow-2xs">
                  {displayName.split(' ').map((n) => n[0]).join('') || 'JT'}
                </div>
                <span className="text-xs text-slate-400 font-medium">Camera is off</span>
              </div>
            )}

            {/* Test Hardware Bar Overlay */}
            <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-lg flex items-center justify-between text-[11px] text-slate-300">
              <span className="truncate">{displayName}</span>
              <button type="button" className="flex items-center space-x-1 hover:text-white transition-colors">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Audio & Video</span>
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleJoin} className="space-y-4 pt-2 text-left text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Your Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:bg-white focus:border-zoom-blue focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
            </div>

            {/* Media Toggles */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={toggleMic}
                className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl font-bold border transition-all ${isAudioOff
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
              >
                {isAudioOff ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4 text-emerald-600" />}
                <span>{isAudioOff ? 'Mic OFF' : 'Mic ON'}</span>
              </button>

              <button
                type="button"
                onClick={toggleCam}
                className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl font-bold border transition-all ${isVideoOff
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4 text-red-600" /> : <Video className="w-4 h-4 text-emerald-600" />}
                <span>{isVideoOff ? 'Camera OFF' : 'Camera ON'}</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 text-xs font-bold text-white bg-zoom-blue hover:bg-zoom-blue-hover rounded-xl shadow-xs transition-colors text-center"
              >
                Join Meeting
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

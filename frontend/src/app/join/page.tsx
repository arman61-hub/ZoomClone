'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mic, MicOff, Video, VideoOff, AlertTriangle, ChevronUp, Image as ImageIcon } from 'lucide-react';

function JoinMeetingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const meetingIdParam = searchParams.get('meetingId') || searchParams.get('id') || '699-772-3211';
  const isHostParam = searchParams.get('isHost') === 'true';

  const [meetingIdInput, setMeetingIdInput] = useState(meetingIdParam);
  const [yourName, setYourName] = useState('');
  const [rememberName, setRememberName] = useState(true);
  const [isAudioOff, setIsAudioOff] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [cameraWarning, setCameraWarning] = useState('Your camera is being used by other apps. Close those apps and try again.');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        setStream(mediaStream);
        setIsVideoOff(false);
        setCameraWarning('');
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setIsVideoOff(true);
        setCameraWarning('Your camera is being used by other apps. Close those apps and try again.');
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourName.trim()) return;

    const cleanId = meetingIdInput.trim() || '699-772-3211';
    
    if (rememberName) {
      localStorage.setItem('zoom_user_name', yourName);
    }

    const query = new URLSearchParams({
      name: yourName.trim(),
      audioOff: String(isAudioOff),
      videoOff: String(isVideoOff),
      isHost: String(isHostParam)
    }).toString();

    router.push(`/meeting/${encodeURIComponent(cleanId)}?${query}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between p-6 font-sans select-none">
      {/* Top Bar with Back Link */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs font-semibold text-zoom-blue hover:underline space-x-1">
          <span>&lt; Back</span>
        </Link>
      </div>

      {/* Main Content Area: Replica of Image 1 */}
      <main className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 py-6">
        {/* Left Card: Camera Preview Box */}
        <div className="w-full lg:w-[540px] bg-[#222222] rounded-2xl p-4 flex flex-col justify-between h-[360px] relative shadow-lg text-white">
          {/* Top Camera Warning Banner */}
          {cameraWarning && (
            <div className="w-full bg-[#1A1A1A]/90 border border-amber-500/40 text-amber-200 text-xs px-3.5 py-2 rounded-xl flex items-center space-x-2 shadow-xs z-10">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">{cameraWarning}</span>
            </div>
          )}

          {/* Center Stage: Video or Avatar Placeholder */}
          <div className="flex-1 flex items-center justify-center relative my-2 overflow-hidden rounded-xl">
            {!isVideoOff ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100 rounded-xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-[#333333] flex items-center justify-center border border-slate-700">
                <svg className="w-16 h-16 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="flex items-center justify-between pt-2 px-2 z-10">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsAudioOff(!isAudioOff)}
                className="flex items-center space-x-1 bg-[#1A1A1A] hover:bg-[#333333] text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                {isAudioOff ? <MicOff className="w-3.5 h-3.5 text-red-500" /> : <Mic className="w-3.5 h-3.5 text-white" />}
                <span>Mute</span>
                <ChevronUp className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsVideoOff(!isVideoOff)}
                className="flex items-center space-x-1 bg-[#1A1A1A] hover:bg-[#333333] text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                {isVideoOff ? <VideoOff className="w-3.5 h-3.5 text-red-500" /> : <Video className="w-3.5 h-3.5 text-white" />}
                <span>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
                <ChevronUp className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>
            </div>

            <button
              type="button"
              className="flex items-center space-x-1 bg-[#1A1A1A] hover:bg-[#333333] text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
              <span>Backgrounds</span>
            </button>
          </div>
        </div>

        {/* Right Card: Enter Meeting Info */}
        <div className="w-full lg:w-[380px] space-y-5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight text-center lg:text-left">
            Enter Meeting Info
          </h2>

          <form onSubmit={handleJoinSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="Enter display name (e.g. kk)"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm font-medium focus:border-zoom-blue focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
            </div>

            <label className="flex items-center space-x-2 text-slate-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={rememberName}
                onChange={(e) => setRememberName(e.target.checked)}
                className="w-4 h-4 rounded text-zoom-blue focus:ring-zoom-blue border-slate-300"
              />
              <span>Remember my name for future meetings</span>
            </label>

            <button
              type="submit"
              disabled={!yourName.trim()}
              className="w-full py-2.5 text-sm font-bold text-white bg-zoom-blue hover:bg-zoom-blue-hover rounded-lg transition-colors shadow-2xs disabled:opacity-50 disabled:bg-slate-300"
            >
              Join
            </button>
          </form>

          <div className="space-y-2 text-[11px] text-slate-500 leading-relaxed pt-2">
            <p>
              By clicking "Join", you agree to our{' '}
              <a href="#" className="text-zoom-blue hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-zoom-blue hover:underline">Privacy Statement</a>.
            </p>
            <p>
              Zoom is protected by reCAPTCHA and their{' '}
              <a href="#" className="text-zoom-blue hover:underline">Privacy Policy</a> and{' '}
              <a href="#" className="text-zoom-blue hover:underline">Terms of Service</a> apply.
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full text-center text-[11px] text-slate-500 py-4 border-t border-slate-100">
        © 2026 Zoom Communications, Inc. All rights reserved.{' '}
        <a href="#" className="hover:underline">Privacy & Legal Policies</a> |{' '}
        <a href="#" className="hover:underline">Send Report</a>
      </footer>
    </div>
  );
}

export default function JoinMeetingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-500 text-xs">Loading Join page...</div>}>
      <JoinMeetingContent />
    </Suspense>
  );
}

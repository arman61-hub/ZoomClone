'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { Mic, MicOff, Video, VideoOff, AlertTriangle, ChevronUp, Image as ImageIcon, Key, Lock, CheckCircle2 } from 'lucide-react';
import { fetchMeetingById, createInstantMeeting } from '@/lib/api';

function JoinMeetingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  
  const routeId = (params?.id as string) || '';
  const meetingIdParam = routeId || searchParams.get('meetingId') || searchParams.get('id') || '';
  const isHostParam = searchParams.get('isHost') === 'true' || searchParams.get('mode') === 'host';
  const pwdParam = searchParams.get('passcode') || searchParams.get('pwd') || searchParams.get('pass') || '';
  const hasPasscodeInUrl = Boolean(pwdParam.trim());

  const [meetingIdInput, setMeetingIdInput] = useState(meetingIdParam);
  const [passcode, setPasscode] = useState(pwdParam);
  const [yourName, setYourName] = useState('Arman Redhu');
  const [rememberName, setRememberName] = useState(true);
  
  const [isAudioOff, setIsAudioOff] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [cameraWarning, setCameraWarning] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (pwdParam) {
      setPasscode(pwdParam);
    }
  }, [pwdParam]);

  useEffect(() => {
    const savedName = localStorage.getItem('zoom_user_name');
    if (savedName) {
      setYourName(savedName);
    }
  }, []);

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
        setCameraWarning('Your camera is restricted or being used by another app.');
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream && !isVideoOff) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isVideoOff]);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!yourName.trim()) {
      setValidationError('Please enter your display name.');
      return;
    }

    // Host Mode without Meeting ID: Create Instant Meeting
    if (isHostParam && !meetingIdInput.trim()) {
      try {
        setIsValidating(true);
        const newMeeting = await createInstantMeeting();
        if (rememberName) {
          localStorage.setItem('zoom_user_name', yourName.trim());
        }
        const query = new URLSearchParams({
          name: yourName.trim(),
          audioOff: String(isAudioOff),
          videoOff: String(isVideoOff),
          isHost: 'true',
          pwd: newMeeting.passcode || ''
        }).toString();
        router.push(`/meeting/${encodeURIComponent(newMeeting.id)}?${query}`);
      } catch (err) {
        setValidationError('Failed to create instant meeting. Please try again.');
      } finally {
        setIsValidating(false);
      }
      return;
    }

    // Normal Join or Host joining specific Meeting ID
    const cleanId = meetingIdInput.trim();
    if (!cleanId) {
      setValidationError('Please enter a valid Meeting ID.');
      return;
    }

    try {
      setIsValidating(true);
      // Validate meeting exists in DB
      const meeting = await fetchMeetingById(cleanId);

      if (!meeting) {
        setValidationError('Invalid Meeting ID. Meeting does not exist.');
        setIsValidating(false);
        return;
      }

      if (meeting.status === 'ended') {
        setValidationError('This meeting has already ended.');
        setIsValidating(false);
        return;
      }

      // Check Passcode ONLY for guest mode when passcode is not pre-validated in link
      if (!isHostParam && meeting.passcode && !hasPasscodeInUrl) {
        if (!passcode.trim() || passcode.trim() !== meeting.passcode.trim()) {
          setValidationError(`Incorrect Passcode for Meeting ID ${cleanId}. Please check and try again.`);
          setIsValidating(false);
          return;
        }
      }

      // Validation clean success
      if (rememberName) {
        localStorage.setItem('zoom_user_name', yourName.trim());
      }

      const query = new URLSearchParams({
        name: yourName.trim(),
        audioOff: String(isAudioOff),
        videoOff: String(isVideoOff),
        isHost: String(Boolean(isHostParam)),
        pwd: meeting.passcode || passcode || ''
      }).toString();

      router.push(`/meeting/${encodeURIComponent(meeting.id)}?${query}`);

    } catch (err: any) {
      setValidationError(err.message || 'Invalid Meeting ID or network error.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between p-6 font-sans select-none">
      {/* Top Bar with Back Link */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="inline-flex items-center text-xs font-semibold text-[#0e71eb] hover:underline space-x-1">
          <span>&lt; Back</span>
        </Link>
      </div>

      {/* Main Content Area: Pre-Join Lobby */}
      <main className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 py-6">
        {/* Left Card: Camera Preview Box */}
        <div className="w-full lg:w-[540px] bg-[#222222] rounded-2xl p-4 flex flex-col justify-between h-[380px] relative shadow-lg text-white">
          {/* Top Camera Warning Banner */}
          {cameraWarning && (
            <div className="w-full bg-[#1A1A1A]/90 border border-amber-500/40 text-amber-200 text-xs px-3.5 py-2 rounded-xl flex items-center space-x-2 shadow-xs z-10">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">{cameraWarning}</span>
            </div>
          )}

          {/* Center Stage: Video or Avatar Placeholder */}
          <div className="flex-1 flex items-center justify-center relative my-2 overflow-hidden rounded-xl bg-black">
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
                <svg className="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
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
                className="flex items-center space-x-1 bg-[#1A1A1A] hover:bg-[#333333] text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {isAudioOff ? <MicOff className="w-3.5 h-3.5 text-red-500" /> : <Mic className="w-3.5 h-3.5 text-white" />}
                <span>{isAudioOff ? 'Unmute' : 'Mute'}</span>
                <ChevronUp className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsVideoOff(!isVideoOff)}
                className="flex items-center space-x-1 bg-[#1A1A1A] hover:bg-[#333333] text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {isVideoOff ? <VideoOff className="w-3.5 h-3.5 text-red-500" /> : <Video className="w-3.5 h-3.5 text-white" />}
                <span>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
                <ChevronUp className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>
            </div>

            <button
              type="button"
              className="flex items-center space-x-1 bg-[#1A1A1A] hover:bg-[#333333] text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
              <span>Backgrounds</span>
            </button>
          </div>
        </div>

        {/* Right Card: Enter Meeting Info Form */}
        <div className="w-full lg:w-[380px] space-y-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight text-center lg:text-left">
            {isHostParam ? 'Host a Meeting' : 'Enter Meeting Info'}
          </h2>

          {/* Error Banner */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-start space-x-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleJoinSubmit} className="space-y-3.5 text-xs">
            {!isHostParam && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Meeting ID or Personal Link
                  </label>
                  <input
                    type="text"
                    value={meetingIdInput}
                    onChange={(e) => setMeetingIdInput(e.target.value)}
                    placeholder="Enter Meeting ID (e.g. 849-204-1029)"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm font-medium focus:border-[#0e71eb] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>

                {!hasPasscodeInUrl ? (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Meeting Passcode
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Enter passcode (e.g. 839201)"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm font-medium focus:border-[#0e71eb] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Passcode verified automatically from invite link</span>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="Enter your display name"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm font-medium focus:border-[#0e71eb] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
            </div>

            <label className="flex items-center space-x-2 text-slate-600 font-medium cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={rememberName}
                onChange={(e) => setRememberName(e.target.checked)}
                className="w-4 h-4 rounded text-[#0e71eb] focus:ring-[#0e71eb] border-slate-300"
              />
              <span>Remember my name for future meetings</span>
            </label>

            <button
              type="submit"
              disabled={isValidating || !yourName.trim()}
              className="w-full py-2.5 text-sm font-bold text-white bg-[#0e71eb] hover:bg-[#0b5cbe] rounded-lg transition-colors shadow-2xs disabled:opacity-50 disabled:bg-slate-300 cursor-pointer flex items-center justify-center space-x-2"
            >
              {isValidating ? <span>Validating...</span> : <span>{isHostParam && !meetingIdInput.trim() ? 'Start Meeting' : 'Join'}</span>}
            </button>
          </form>

          <div className="space-y-1.5 text-[11px] text-slate-500 leading-relaxed pt-1">
            <p>
              By clicking "{isHostParam && !meetingIdInput.trim() ? 'Start Meeting' : 'Join'}", you agree to our{' '}
              <a href="#" className="text-[#0e71eb] hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-[#0e71eb] hover:underline">Privacy Statement</a>.
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


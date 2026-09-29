'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MeetingRoom } from '@/components/MeetingRoom';

function DirectMeetingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const meetingId = params?.id as string;
  const nameParam = searchParams.get('name');
  const audioOffParam = searchParams.get('audioOff') === 'true';
  const videoOffParam = searchParams.get('videoOff') === 'true';
  const isHostParam = searchParams.get('isHost') === 'true';

  useEffect(() => {
    if (!nameParam && meetingId) {
      router.replace(`/join?meetingId=${encodeURIComponent(meetingId)}`);
    }
  }, [nameParam, meetingId, router]);

  if (!meetingId) {
    return <div className="p-8 text-center text-red-500">Invalid Meeting URL</div>;
  }

  if (!nameParam) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-500 text-xs">
        Redirecting to Meeting Join page...
      </div>
    );
  }

  return (
    <MeetingRoom
      meetingId={meetingId}
      displayName={nameParam}
      initialAudioOff={audioOffParam}
      initialVideoOff={videoOffParam}
      isHost={isHostParam}
      hostName="Arman"
      onLeaveMeeting={() => router.push('/leave')}
    />
  );
}

export default function DirectMeetingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">Loading meeting...</div>}>
      <DirectMeetingContent />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PreJoinLobby } from '@/components/PreJoinLobby';
import { MeetingRoom } from '@/components/MeetingRoom';

export default function DirectMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params?.id as string;

  const [inRoom, setInRoom] = useState(false);
  const [participantState, setParticipantState] = useState({
    displayName: 'Arman',
    audioOff: false,
    videoOff: false,
  });

  if (!meetingId) {
    return <div className="p-8 text-center text-red-500">Invalid Meeting URL</div>;
  }

  const handleLobbyJoin = (displayName: string, audioOff: boolean, videoOff: boolean) => {
    setParticipantState({ displayName, audioOff, videoOff });
    setInRoom(true);
  };

  const handleLeaveMeeting = () => {
    router.push('/');
  };

  if (inRoom) {
    return (
      <MeetingRoom
        meetingId={meetingId}
        displayName={participantState.displayName}
        initialAudioOff={participantState.audioOff}
        initialVideoOff={participantState.videoOff}
        onLeaveMeeting={handleLeaveMeeting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <PreJoinLobby
        meetingId={meetingId}
        onJoinMeeting={handleLobbyJoin}
        onCancel={() => router.push('/')}
      />
    </div>
  );
}

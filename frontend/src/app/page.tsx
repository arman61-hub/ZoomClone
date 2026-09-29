'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { Footer } from '@/components/Footer';
import { JoinModal } from '@/components/JoinModal';
import { ScheduleModal } from '@/components/ScheduleModal';
import { PreJoinLobby } from '@/components/PreJoinLobby';
import { MeetingRoom } from '@/components/MeetingRoom';
import { fetchCurrentUser, createInstantMeeting, UserProfile, Meeting } from '@/lib/api';

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('meetings');
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Meeting view state
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  const [inLobby, setInLobby] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [participantState, setParticipantState] = useState({
    displayName: 'Arman',
    audioOff: false,
    videoOff: false,
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await fetchCurrentUser();
        setUser(u);
      } catch (err) {
        console.error('Error loading user profile:', err);
      }
    }
    loadUser();
  }, []);

  const handleStartInstantMeeting = async () => {
    try {
      const meeting = await createInstantMeeting();
      setActiveMeetingId(meeting.id);
      setInLobby(true);
    } catch (err) {
      console.error('Error launching instant meeting:', err);
    }
  };

  const handleJoinFromModal = (meetingId: string, displayName: string, audioOff: boolean, videoOff: boolean) => {
    setActiveMeetingId(meetingId);
    setParticipantState({ displayName, audioOff, videoOff });
    setIsJoinOpen(false);
    setInLobby(true);
  };

  const handleScheduledSuccess = (meeting: Meeting) => {
    // Refresh page/dashboard
    window.location.reload();
  };

  const handleLobbyJoin = (displayName: string, audioOff: boolean, videoOff: boolean) => {
    setParticipantState({ displayName, audioOff, videoOff });
    setInLobby(false);
    setInRoom(true);
  };

  const handleLeaveMeeting = () => {
    setInRoom(false);
    setInLobby(false);
    setActiveMeetingId(null);
  };

  // Render Meeting Room
  if (inRoom && activeMeetingId) {
    return (
      <MeetingRoom
        meetingId={activeMeetingId}
        displayName={participantState.displayName}
        initialAudioOff={participantState.audioOff}
        initialVideoOff={participantState.videoOff}
        onLeaveMeeting={handleLeaveMeeting}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
      {/* Header */}
      <Navbar
        user={user}
        onJoinClick={() => setIsJoinOpen(true)}
        onScheduleClick={() => setIsScheduleOpen(true)}
        onHostClick={handleStartInstantMeeting}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <Dashboard
          user={user}
          onOpenJoin={() => setIsJoinOpen(true)}
          onOpenSchedule={() => setIsScheduleOpen(true)}
          onStartMeeting={(id) => {
            setActiveMeetingId(id);
            setInLobby(true);
          }}
        />
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals & PreJoin Lobby */}
      <JoinModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoinSuccess={handleJoinFromModal}
      />

      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onScheduledSuccess={handleScheduledSuccess}
      />

      {inLobby && activeMeetingId && (
        <PreJoinLobby
          meetingId={activeMeetingId}
          onJoinMeeting={handleLobbyJoin}
          onCancel={() => {
            setInLobby(false);
            setActiveMeetingId(null);
          }}
        />
      )}
    </div>
  );
}

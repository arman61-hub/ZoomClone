import { useState, useEffect, useRef, useCallback } from 'react';

export interface ParticipantInfo {
  id: string;
  displayName: string;
  isHost: boolean;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  stream?: MediaStream;
}

export interface ChatMessage {
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

export function useWebRTC(meetingId: string, participantId: string, displayName: string, isHost: boolean) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize Local Media Stream
  const initLocalStream = useCallback(async (audioOn = true, videoOn = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      
      stream.getAudioTracks().forEach(t => t.enabled = audioOn);
      stream.getVideoTracks().forEach(t => t.enabled = videoOn);

      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsAudioMuted(!audioOn);
      setIsVideoOff(!videoOn);
      return stream;
    } catch (err) {
      console.warn("Could not access camera/mic, fallback to dummy stream:", err);
      // Fallback empty stream for canvas preview if hardware restricted
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1A1C23';
        ctx.fillRect(0, 0, 640, 480);
      }
      const stream = canvas.captureStream(30);
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    }
  }, []);

  // WebSockets Signaling Setup
  useEffect(() => {
    if (!meetingId || !participantId) return;

    const wsUrl = `ws://127.0.0.1:8000/ws/meeting/${encodeURIComponent(meetingId)}/${encodeURIComponent(participantId)}?display_name=${encodeURIComponent(displayName)}&is_host=${isHost}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      const { type } = data;

      switch (type) {
        case 'PARTICIPANT_JOINED':
        case 'PARTICIPANTS_UPDATED':
          setParticipants(data.participants || []);
          break;

        case 'PARTICIPANT_LEFT':
          if (data.participantId && peerConnections.current[data.participantId]) {
            peerConnections.current[data.participantId].close();
            delete peerConnections.current[data.participantId];
          }
          setParticipants(data.participants || []);
          break;

        case 'OFFER':
          handleReceiveOffer(data.senderId, data.sdp);
          break;

        case 'ANSWER':
          handleReceiveAnswer(data.senderId, data.sdp);
          break;

        case 'ICE_CANDIDATE':
          handleReceiveIceCandidate(data.senderId, data.candidate);
          break;

        case 'CHAT_MESSAGE':
          setChatMessages(prev => [...prev, {
            senderId: data.senderId,
            senderName: data.senderName,
            message: data.message,
            timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          break;

        case 'FORCE_MUTE_AUDIO':
          if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(t => t.enabled = false);
            setIsAudioMuted(true);
          }
          break;

        case 'REMOVED_BY_HOST':
          alert('You have been removed from the meeting by the host.');
          window.location.href = '/';
          break;

        default:
          break;
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
      Object.values(peerConnections.current).forEach(pc => pc.close());
    };
  }, [meetingId, participantId, displayName, isHost]);

  // PeerConnection Handlers
  const createPeerConnection = (targetId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'ICE_CANDIDATE',
          targetId,
          candidate: event.candidate
        }));
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    peerConnections.current[targetId] = pc;
    return pc;
  };

  const handleReceiveOffer = async (senderId: string, sdp: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection(senderId);
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'ANSWER',
        targetId: senderId,
        sdp: answer
      }));
    }
  };

  const handleReceiveAnswer = async (senderId: string, sdp: RTCSessionDescriptionInit) => {
    const pc = peerConnections.current[senderId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    }
  };

  const handleReceiveIceCandidate = async (senderId: string, candidate: RTCIceCandidateInit) => {
    const pc = peerConnections.current[senderId];
    if (pc && candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  // Toggle Mute Audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const nextState = !audioTracks[0].enabled;
        audioTracks[0].enabled = nextState;
        setIsAudioMuted(!nextState);

        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'MEDIA_STATE_CHANGE',
            isAudioMuted: !nextState
          }));
        }
      }
    }
  };

  // Toggle Video Camera
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const nextState = !videoTracks[0].enabled;
        videoTracks[0].enabled = nextState;
        setIsVideoOff(!nextState);

        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'MEDIA_STATE_CHANGE',
            isVideoOff: !nextState
          }));
        }
      }
    }
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        screenTrack.onended = () => {
          setIsScreenSharing(false);
          if (localStreamRef.current) {
            const cameraTrack = localStreamRef.current.getVideoTracks()[0];
            replaceVideoTrack(cameraTrack);
          }
        };

        replaceVideoTrack(screenTrack);
        setIsScreenSharing(true);
      } else {
        if (localStreamRef.current) {
          const cameraTrack = localStreamRef.current.getVideoTracks()[0];
          replaceVideoTrack(cameraTrack);
        }
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  const replaceVideoTrack = (newTrack: MediaStreamTrack) => {
    Object.values(peerConnections.current).forEach(pc => {
      const sender = pc.getSenders().find(s => s.track?.kind === 'video');
      if (sender) {
        sender.replaceTrack(newTrack);
      }
    });
  };

  // Toggle Hand Raise
  const toggleHandRaise = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'MEDIA_STATE_CHANGE',
        isHandRaised: nextState
      }));
    }
  };

  // Send Chat Message
  const sendChatMessage = (text: string) => {
    if (text.trim() && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'CHAT_MESSAGE',
        message: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }
  };

  // Host Action: Mute All
  const hostMuteAll = () => {
    if (isHost && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'HOST_ACTION',
        action: 'MUTE_ALL'
      }));
    }
  };

  // Host Action: Remove Participant
  const hostRemoveParticipant = (targetId: string) => {
    if (isHost && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'HOST_ACTION',
        action: 'REMOVE_PARTICIPANT',
        targetParticipantId: targetId
      }));
    }
  };

  return {
    localStream,
    initLocalStream,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    isHandRaised,
    participants,
    chatMessages,
    isConnected,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    toggleHandRaise,
    sendChatMessage,
    hostMuteAll,
    hostRemoveParticipant
  };
}

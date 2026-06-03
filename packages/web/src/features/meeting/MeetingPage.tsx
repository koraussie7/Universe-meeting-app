import { useState, useEffect, useRef } from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff, FiCopy, FiUsers } from 'react-icons/fi';
import { io, Socket } from 'socket.io-client';

const SIGNALING_URL = '';

export default function MeetingPage() {
  const [isInCall, setIsInCall] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('Guest');
  const [token, setToken] = useState('');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [participants, setParticipants] = useState<string[]>([]);
  const [showJoin, setShowJoin] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Create room via API
  const createRoom = async () => {
    try {
      const res = await fetch('/api/v1/live/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: '' }),
      });
      const data = await res.json();
      setRoomName(data.room);
      setToken(data.token);
      setShowJoin(false);
    } catch (e) {
      console.error('Failed to create room:', e);
      // Fallback: local room name
      const fallback = 'room-' + Math.random().toString(36).slice(2, 8);
      setRoomName(fallback);
      setShowJoin(false);
    }
  };

  // Join existing room
  const joinRoomCall = async (room: string) => {
    setRoomName(room);
    setShowJoin(false);
  };

  // Start the actual call
  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Connect signaling
      const socket = io(SIGNALING_URL + '/signaling');
      socketRef.current = socket;

      socket.emit('join-room', { room: roomName, userName });
      setIsInCall(true);

      socket.on('user-joined', (data: { userId: string; userName: string }) => {
        setParticipants(p => [...p, data.userName]);
        createPeerConnection(data.userId, true);
      });

      socket.on('user-left', (data: { userId: string }) => {
        setParticipants(p => p.filter(id => id !== data.userId));
      });

      socket.on('signal', async (data: any) => {
        // Handle incoming WebRTC signal
        if (pcRef.current) {
          if (data.type === 'offer') {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            socket.emit('signal', { to: data.from, type: 'answer', sdp: answer });
          } else if (data.type === 'answer') {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
          } else if (data.type === 'ice-candidate') {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        }
      });
    } catch (e) {
      console.error('Media error:', e);
    }
  };

  const createPeerConnection = async (remoteUserId: string, isInitiator: boolean) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    pcRef.current = pc;

    // Add local stream
    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('signal', {
          to: remoteUserId,
          type: 'ice-candidate',
          candidate: event.candidate,
        });
      }
    };

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit('signal', {
        to: remoteUserId,
        type: 'offer',
        sdp: offer,
      });
    }
  };

  const hangUp = () => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    pcRef.current?.close();
    socketRef.current?.disconnect();
    setIsInCall(false);
    setRoomName('');
    setParticipants([]);
    setShowJoin(true);
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCamOn(videoTrack.enabled);
      }
    }
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(roomName);
  };

  // Join screen
  if (showJoin) {
    return (
      <div className="pt-12 px-4 flex flex-col items-center min-h-[60vh]">
        <h2 className="text-xl font-bold mb-6">🎥 Live & Meetings</h2>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-8">
          <button
            onClick={createRoom}
            className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-xl text-left"
          >
            <FiVideo size={24} className="mb-3" />
            <p className="font-bold text-sm">New Meeting</p>
            <p className="text-xs text-indigo-200 mt-1">Start instantly</p>
          </button>
          <a href="/meeting" className="bg-slate-800 p-4 rounded-xl text-left border border-slate-700">
            <FiUsers size={24} className="mb-3 text-slate-400" />
            <p className="font-bold text-sm">Schedule</p>
            <p className="text-xs text-slate-400 mt-1">Plan ahead</p>
          </a>
        </div>

        {/* Join with code */}
        <div className="w-full max-w-sm space-y-3">
          <p className="text-sm text-slate-400">Join with room code</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
              placeholder="Room code"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => joinRoomCall(roomName)}
              disabled={!roomName}
              className="bg-indigo-600 disabled:opacity-50 px-4 py-3 rounded-xl text-sm font-medium"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  // In-call screen
  if (isInCall) {
    return (
      <div className="relative min-h-screen bg-black">
        {/* Video area */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {!camOn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center">
                <FiVideoOff size={40} className="text-slate-400" />
              </div>
            </div>
          )}
        </div>

        {/* Room info */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-xs text-slate-300">{roomName}</span>
          <button onClick={copyRoomLink}>
            <FiCopy size={14} className="text-slate-400" />
          </button>
          <span className="text-xs text-indigo-400">{participants.length + 1} online</span>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button
            onClick={toggleMic}
            className={'w-14 h-14 rounded-full flex items-center justify-center ' + (micOn ? 'bg-slate-700' : 'bg-red-600')}
          >
            {micOn ? <FiMic size={24} /> : <FiMicOff size={24} />}
          </button>
          <button
            onClick={hangUp}
            className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center"
          >
            <FiPhoneOff size={28} />
          </button>
          <button
            onClick={toggleCam}
            className={'w-14 h-14 rounded-full flex items-center justify-center ' + (camOn ? 'bg-slate-700' : 'bg-red-600')}
          >
            {camOn ? <FiVideo size={24} /> : <FiVideoOff size={24} />}
          </button>
        </div>
      </div>
    );
  }

  // connecting state
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pt-12">
      <p className="text-lg font-bold">Room: {roomName}</p>
      <input
        type="text"
        value={userName}
        onChange={e => setUserName(e.target.value)}
        placeholder="Your name"
        className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 w-64"
      />
      <button
        onClick={startCall}
        className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-medium"
      >
        Join Call
      </button>
    </div>
  );
}

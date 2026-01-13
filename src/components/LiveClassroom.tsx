'use client';
import React, { useEffect, useState, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { Mic, MicOff, Video, VideoOff, LogOut, Users, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- अपना नया APP ID यहाँ डालें (Testing Mode वाला) ---
const APP_ID = "82757c0ca9054fa08b731a039230c396"; 

export default function LiveClassroom({ onLeave }: { onLeave: () => void }) {
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const client = useRef<IAgoraRTCClient | null>(null);
  const localTracks = useRef<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);

  useEffect(() => {
    // 1. क्लाइंट को सिर्फ एक बार बनाएँ
    if (!client.current) {
      client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    }

    const init = async () => {
      // 2. सबसे जरूरी चेक: अगर पहले से कनेक्टेड है तो रुक जाओ
      if (client.current?.connectionState !== 'DISCONNECTED') {
        console.log("Already connecting or connected, skipping...");
        return;
      }

      try {
        // इवेंट लिस्नर्स
        client.current.on("user-published", async (user, mediaType) => {
          await client.current!.subscribe(user, mediaType);
          if (mediaType === "video") {
            setRemoteUsers(prev => [...prev.filter(u => u.uid !== user.uid), user]);
          }
          if (mediaType === "audio") user.audioTrack?.play();
        });

        client.current.on("user-left", (user) => {
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        });

        // कैमरा और माइक ट्रैक बनाएँ
        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracks.current = tracks;

        // चैनल जॉइन करें
        await client.current.join(APP_ID, "test-channel", null, null);
        await client.current.publish(localTracks.current);
        
        // अपना वीडियो चलाएँ
        localTracks.current[1].play("teacher-video");

      } catch (err: any) {
        console.error("Agora Init Error:", err);
      }
    };

    init();

    // Cleanup: क्लास छोड़ते समय सब बंद करें
    return () => {
      const cleanUp = async () => {
        localTracks.current?.forEach(t => { t.stop(); t.close(); });
        if (client.current && client.current.connectionState !== 'DISCONNECTED') {
          await client.current.leave();
        }
        client.current?.removeAllListeners();
      };
      cleanUp();
    };
  }, []);

  // रिमोट वीडियो प्लेबैक
  useEffect(() => {
    remoteUsers.forEach(user => {
      if (user.videoTrack) user.videoTrack.play(`user-${user.uid}`);
    });
  }, [remoteUsers]);

  // म्यूट फंक्शन
  const toggleRemoteAudio = (user: any) => {
    if (user.audioTrack) {
      if (user.audioTrack.isPlaying) {
        user.audioTrack.stop();
      } else {
        user.audioTrack.play();
      }
      setRemoteUsers([...remoteUsers]);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="bg-red-500 w-2 h-2 rounded-full animate-pulse" />
          <span className="text-white font-bold text-[10px] uppercase tracking-widest">Live Classroom</span>
          <div className="text-slate-400 text-[10px] bg-slate-800 px-3 py-1 rounded-full font-bold uppercase tracking-tighter">
            <Users className="w-3 h-3 inline mr-1 text-blue-400" /> {remoteUsers.length + 1} / 11 Online
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant={isMuted ? "destructive" : "secondary"} className="rounded-full w-9 h-9 p-0" onClick={() => {
            localTracks.current?.[0].setEnabled(isMuted);
            setIsMuted(!isMuted);
          }}>
            {isMuted ? <MicOff className="w-4 h-4"/> : <Mic className="w-4 h-4"/>}
          </Button>
          <Button size="sm" variant={isCameraOff ? "destructive" : "secondary"} className="rounded-full w-9 h-9 p-0" onClick={() => {
            localTracks.current?.[1].setEnabled(isCameraOff);
            setIsCameraOff(!isCameraOff);
          }}>
            {isCameraOff ? <VideoOff className="w-4 h-4"/> : <Video className="w-4 h-4"/>}
          </Button>
          <Button size="sm" variant="destructive" className="ml-2 font-bold px-4 text-xs uppercase" onClick={onLeave}>End Class</Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Whiteboard */}
        <div className="flex-1 bg-white relative">
          <Tldraw />
        </div>

        {/* Dynamic Sidebar */}
        <div className="w-64 bg-[#0a0f1d] border-l border-slate-800 p-3 flex flex-col gap-3 overflow-y-auto">
          {/* Teacher Box */}
          <div className="relative aspect-video bg-slate-900 rounded-xl border-2 border-blue-600 overflow-hidden shrink-0 shadow-lg ring-4 ring-blue-600/10">
            <div id="teacher-video" className="w-full h-full" />
            <div className="absolute bottom-1 left-1 bg-blue-600 text-[7px] text-white px-1.5 py-0.5 rounded font-black uppercase">You (Teacher)</div>
          </div>

          <div className="h-px bg-slate-800/50 mx-2" />

          {/* Student Boxes (सिर्फ जॉइन हुए बच्चे दिखेंगे) */}
          {remoteUsers.map(user => (
            <div key={user.uid} className="relative aspect-video bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shrink-0 group hover:border-blue-500/50 transition-colors shadow-md">
              <div id={`user-${user.uid}`} className="w-full h-full" />
              <div className="absolute bottom-1 left-1 bg-black/60 text-[7px] text-white px-1.5 py-0.5 rounded uppercase">Student {user.uid.toString().slice(-4)}</div>
              
              {/* Mute Button */}
              <button 
                onClick={() => toggleRemoteAudio(user)}
                className="absolute top-1 right-1 p-1 bg-slate-900/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700"
              >
                {user.audioTrack?.isPlaying ? <Volume2 className="w-3 h-3"/> : <VolumeX className="w-3 h-3 text-red-500"/>}
              </button>
            </div>
          ))}

          {remoteUsers.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
              <Users className="w-10 h-10 text-slate-500 mb-2" />
              <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest leading-relaxed">No Students Yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';
import React, { useEffect, useState, useRef } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { Mic, MicOff, Video, VideoOff, MonitorUp, LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const APP_ID = "74eaaedcbc3c4ddf88f018cf48f1bce8"; // अपना Agora App ID यहाँ डालें
const TOKEN = null; // टेस्टिंग के लिए null रख सकते हैं (अगर App ID 'Testing mode' में है)

export default function ClassroomView({ channelName, onLeave }: { channelName: string, onLeave: () => void }) {
    const [joined, setJoined] = useState(false);
    const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
    const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    
    const client = useRef<IAgoraRTCClient>(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));

    useEffect(() => {
        const init = async () => {
            client.current.on("user-published", async (user, mediaType) => {
                await client.current.subscribe(user, mediaType);
                if (mediaType === "video") {
                    setRemoteUsers(prev => [...prev.filter(u => u.uid !== user.uid), user]);
                }
                if (mediaType === "audio") user.audioTrack?.play();
            });

            client.current.on("user-left", (user) => {
                setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
            });

            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
            setLocalTracks([audioTrack, videoTrack]);
            
            await client.current.join(APP_ID, channelName, TOKEN, null);
            await client.current.publish([audioTrack, videoTrack]);
            
            setJoined(true);
            videoTrack.play("local-video");
        };

        init();

        return () => {
            localTracks?.[0].close();
            localTracks?.[1].close();
            client.current.leave();
        };
    }, []);

    // Remote Video Play Logic
    useEffect(() => {
        remoteUsers.forEach(user => {
            if (user.videoTrack) {
                user.videoTrack.play(`user-${user.uid}`);
            }
        });
    }, [remoteUsers]);

    const toggleMic = () => {
        localTracks?.[0].setEnabled(isMuted);
        setIsMuted(!isMuted);
    };

    const toggleCamera = () => {
        localTracks?.[1].setEnabled(isCameraOff);
        setIsCameraOff(!isCameraOff);
    };

    return (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
            {/* Top Bar Controls */}
            <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
                <div className="flex items-center gap-4 text-white">
                    <span className="font-bold text-blue-400">Classroom: {channelName}</span>
                    <div className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded-md text-xs">
                        <Users className="w-3 h-3" /> {remoteUsers.length + 1} / 11
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <Button variant="ghost" size="icon" onClick={toggleMic} className={isMuted ? "bg-red-500/20 text-red-500" : "text-white"}>
                        {isMuted ? <MicOff /> : <Mic />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleCamera} className={isCameraOff ? "bg-red-500/20 text-red-500" : "text-white"}>
                        {isCameraOff ? <VideoOff /> : <Video />}
                    </Button>
                    <Button variant="outline" className="text-white border-slate-600"> <MonitorUp className="w-4 h-4 mr-2"/> Screen Share</Button>
                    <Button variant="destructive" onClick={onLeave}><LogOut className="w-4 h-4 mr-2"/> End Class</Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* MIDDLE: WHITEBOARD AREA */}
                <div className="flex-1 bg-white relative">
                    <Tldraw />
                </div>

                {/* RIGHT SIDE: STUDENTS VIDEO (Max 11) */}
                <div className="w-72 bg-slate-800 border-l border-slate-700 overflow-y-auto p-4 space-y-4">
                    {/* Teacher / Local Video */}
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video border-2 border-blue-500 shadow-lg">
                        <div id="local-video" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">You (Teacher)</span>
                    </div>

                    {/* Students / Remote Videos */}
                    {remoteUsers.map(user => (
                        <div key={user.uid} className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-600">
                            <div id={`user-${user.uid}`} className="w-full h-full" />
                            <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded">Student {user.uid}</span>
                            
                            {/* Teacher Controls on Student */}
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button className="p-1 bg-slate-700 rounded-md text-white hover:bg-red-500 transition-colors">
                                    <MicOff className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Empty Slots */}
                    {Array.from({ length: Math.max(0, 10 - remoteUsers.length) }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-slate-700 border-dashed aspect-video flex items-center justify-center text-slate-600 text-xs italic">
                            Waiting for student...
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
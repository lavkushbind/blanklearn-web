// src/hooks/useAgoraJoin.ts

import { useState, useEffect, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, ILocalVideoTrack, ILocalAudioTrack } from 'agora-rtc-sdk-ng';
 import { auth } from '@/lib/firebase'; // Assuming Firebase auth instance is imported
import { httpsCallable } from 'firebase/functions'; 
import { functions } from '@/lib/firebase'; 
type UserRole = 'STUDENT' | 'EDUCATOR';

interface JoinResult {
  client: IAgoraRTCClient | null;
  localVideoTrack: ILocalVideoTrack | null;
  localAudioTrack: ILocalAudioTrack | null;
  isJoined: boolean;
  error: string | null;
}

// --- Main Hook ---
export const useAgoraJoin = (
  sessionId: string,
  role: UserRole | null,
  channelName: string // We expect the channel name to be known or fetched with the token
): JoinResult => {
  
  const [joinState, setJoinState] = useState<JoinResult>({
    client: null,
    localVideoTrack: null,
    localAudioTrack: null,
    isJoined: false,
    error: null,
  });

  const user = auth.currentUser;

  // Function to fetch token securely from Firebase Cloud Function
  const fetchToken = useCallback(async () => {
    if (!user || !role || !channelName) return null;

    try {
      // 1. Call the secure Cloud Function
      const generateToken = httpsCallable(functions, 'generateAgoraToken');
      
      const response = await generateToken({ 
        uid: user.uid, 
        role: role, 
        channel: channelName 
      });

      // The response data structure must match what your Cloud Function returns
      return response.data.token as string; 

    } catch (e) {
      console.error("Error fetching Agora Token:", e);
      setJoinState(prev => ({ ...prev, error: "Failed to get secure session token." }));
      return null;
    }
  }, [user, role, channelName]);


  // Effect to handle joining the session once token is available
  useEffect(() => {
    let client: IAgoraRTCClient | null = null;
    let localVideo: ILocalVideoTrack | null = null;
    let localAudio: ILocalAudioTrack | null = null;

    const join = async () => {
      if (!role || !sessionId || !channelName) return;

      try {
        // 1. Initialize Agora Client
        client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        
        const token = await fetchToken();
        if (!token) return; // Token fetching failed

        // 2. Join the Channel
        await client.join(
            null, // App ID can be passed here if needed, but usually client initialization handles it
            channelName,
            token,
            user!.uid
        );

          const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        
        localAudio = audioTrack;
        localVideo = videoTrack;

        // 4. Publish Tracks (Only Educators might publish immediately, students later)
        if (role === 'EDUCATOR') {
             await client.publish([localAudio, localVideo]);
        } else {
             // Students might only want audio/video off initially, or only subscribe
             // For simplicity in this base hook, we publish both, but UI will hide/mute them if needed.
             await client.publish([localAudio, localVideo]);
        }
        
        // 5. Update State
        setJoinState({
          client,
          localVideoTrack: localVideo,
          localAudioTrack: localAudio,
          isJoined: true,
          error: null,
        });

      } catch (error) {
        console.error("Agora Join Error:", error);
        setJoinState(prev => ({ ...prev, error: "Failed to join the session." }));
      }
    };

    // Clean up function for when component unmounts or dependencies change
    const leave = async () => {
      if (client) {
        await client.leave();
      }
      if (localVideo) {
        localVideo.close();
      }
      if (localAudio) {
        localAudio.close();
      }
      setJoinState({
        client: null,
        localVideoTrack: null,
        localAudioTrack: null,
        isJoined: false,
        error: null,
      });
    };

    join();

    // Cleanup on unmount
    return () => {
      leave();
    };
    
  }, [sessionId, role, channelName, user, fetchToken]); // Dependency array ensures logic reruns if user or session changes

  return joinState;
};
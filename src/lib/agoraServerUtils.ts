 
import { RtcRole, RtcTokenBuilder } from 'agora-rtc-sdk-ng'; 
 
const APP_ID = "bda2ee5618df4e71932c39f6a35cc007"; 
const APP_CERTIFICATE = "d57c4cc33ab144f9945f2517cb2409ec";  
export async function generateAgoraTokenServerSide(
    uid: string | number,
    channelName: string,
    role: 'educator' | 'student',
    expireTimeInSeconds: number = 3600
): Promise<string> {
    
    const expiry = Math.floor(Date.now() / 1000) + expireTimeInSeconds;
    
    const finalRole = role === 'educator' ? RtcRole.ROLE_PUBLISHER : RtcRole.ROLE_SUBSCRIBER; 
    
     const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID, 
        APP_CERTIFICATE, 
        channelName, 
        Number(uid), 
        finalRole, 
        expiry
    );

    return token;
}
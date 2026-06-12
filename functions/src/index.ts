import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { RtcTokenBuilder, RtcRole } from 'agora-rtc-sdk-ng';
import { getFirestore } from 'firebase-admin/firestore'; 

admin.initializeApp();
const db = getFirestore();

// Agora Secrets (Cloud Functions Environment से लोड हो रहे हैं)
const APP_ID = functions.config().agora.app_id; 
const APP_CERTIFICATE = functions.config().agora.app_cert; 

// टोकन जनरेशन यूटिलिटी (सुरक्षित रूप से)
const generateToken = async (uid: string | number, channelName: string, role: 'educator' | 'student'): Promise<string> => {
    const expiry = Math.floor(Date.now() / 1000) + 3600;
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
};
export const testConnection = functions.https.onCall(async (data, context) => {
    
    // 1. चेक करें कि यूजर लॉग इन है या नहीं (Authentication Check)
    if (!context.auth) {
        console.error("AUTH CHECK FAILED: User not logged in for test.");
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to test connection.');
    }

    const userId = context.auth.uid;
    console.log(`[SERVER LOG] Connection successful! Received data: ${JSON.stringify(data)} from User: ${userId}`);
    
    // 2. जो प्राप्त हुआ, वही वापस भेजें (Echo)
    return {
        status: "success",
        message: "Function received your data successfully!",
        receivedData: data,
        testUID: userId 
    };
});
// --- Function 1: Class Creation (Educator initiates) ---
export const createClass = functions.https.onCall(async (data, context) => {
    // शिक्षक को प्रमाणित करना आवश्यक है
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Educator must be logged in.');
    }
    
    const educatorId = context.auth.uid;
    const channelName = `CLASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const masterPassword = Math.random().toString(10).substring(0, 6).toUpperCase(); // 6-digit PIN
    
    const educatorToken = await generateToken(educatorId, channelName, 'educator');
    
    // Firestore में सेव करें
    await db.collection('classes').doc(channelName).set({
        educatorId: educatorId,
        masterPassword: masterPassword,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
        channelName: channelName,
        masterPassword: masterPassword,
        educatorToken: educatorToken,
    };
});


// --- Function 2: Join Token Generation (Student/Educator) ---
export const generateToken = functions.https.onCall(async (data, context) => {
    const { channelName, role, password, uid } = data;
    
    if (!channelName || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing parameters.');
    }

    // UID निर्धारण
    let finalUid = uid || (context.auth ? context.auth.uid : `GUEST_${Date.now()}`);
    
    if (role === 'student') {
        if (!password) {
            throw new functions.https.HttpsError('unauthenticated', 'PIN required.');
        }
        
        // पासवर्ड सत्यापन (Firestore से)
        const classDoc = await db.collection('classes').doc(channelName).get();

        if (!classDoc.exists || classDoc.data()?.masterPassword !== password) {
            throw new functions.https.HttpsError('unauthenticated', 'Invalid PIN.');
        }
        
        const token = await generateToken(finalUid, channelName, 'student');
        return { token, uid: finalUid };

    } else if (role === 'educator') {
        if (!context.auth) {
             throw new functions.https.HttpsError('unauthenticated', 'Educator must be logged in.');
        }
        // शिक्षक के लिए टोकन
        const token = await generateToken(context.auth.uid, channelName, 'educator');
        return { token, uid: context.auth.uid };
    }
    
    throw new functions.https.HttpsError('permission-denied', 'Invalid role.');
});
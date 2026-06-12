// src/components/CreateClassModal.tsx
'use client';
import React, { useState } from 'react';
 
import { Button } from '@/components/ui/button';
import { Copy, Check, Loader2, AlertTriangle } from 'lucide-react';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from '@/components/ui/dialog'; 
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase'; // **यह आपके क्लाइंट-साइड Firebase कॉन्फ़िगरेशन को आयात करता है**

// Firebase Functions इंस्टेंस प्राप्त करें
const functions = getFunctions(app);

interface ClassData {
    channelName: string;
    masterPassword: string;
    educatorToken: string;
    joinUrl: string;
}

interface CreateClassModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated: (data: ClassData) => void;
  onStartClass: (data: ClassData) => void; // नया प्रॉप: क्लास शुरू करने के लिए
}

export default function CreateClassModal({ isOpen, onOpenChange, onClassCreated, onStartClass }: CreateClassModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'linkCopied' | 'passCopied'>('idle');
  const [createdData, setCreatedData] = useState<ClassData | null>(null);

  // जब मॉडल बंद होता है, तो सभी स्टेट्स रीसेट करें
  const handleClose = () => {
      setCreatedData(null);
      setCopyStatus('idle');
      onOpenChange(false);
  }

  const handleCreate = async () => {
    setIsLoading(true);
    try {
        // Firebase Cloud Function को कॉल करें
        const createClass = httpsCallable(functions, 'createClass');
        const result = await createClass({}); // कोई डेटा पास करने की आवश्यकता नहीं
        
        const data = result.data as { channelName: string, masterPassword: string, educatorToken: string };
        
        // बेस URL सेट करें (इसे अपने Next.js रूट के अनुसार बदलें)
        const joinUrl = `${window.location.origin}/join/${data.channelName}`; 
        
        const finalData: ClassData = { 
            ...data,
            joinUrl: joinUrl
        };
        setCreatedData(finalData);
        onClassCreated(finalData); 
        
    } catch (error) {
        console.error("Error creating class:", error);
        alert("Failed to create class. Check Cloud Function logs.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleStartClick = () => {
      if (createdData) {
          onStartClass(createdData); // पैरेंट को सूचित करें कि क्लास शुरू करनी है
          handleClose();
      }
  }

  const handleCopy = (text: string, type: 'link' | 'pass') => {
    navigator.clipboard.writeText(text);
    setCopyStatus(type === 'link' ? 'linkCopied' : 'passCopied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };
  
  const isReadyToSetup = createdData !== null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className='text-white'>Classroom Setup</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 text-blue-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Generating Secure Session...</p>
            </div>
        ) : isReadyToSetup ? (
            // --- Success State ---
            <div className='space-y-4'>
                <DialogDescription className="text-green-400 flex items-center gap-2">
                    <Check className='w-4 h-4'/> Session Ready!
                </DialogDescription>
                
                {/* 1. Join Link */}
                <div className="bg-slate-700 p-3 rounded-lg">
                    <p className='text-xs mb-1 text-slate-400'>Shareable Student Link:</p>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm truncate text-white/80'>{createdData.joinUrl}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(createdData.joinUrl, 'link')} className="text-white hover:bg-slate-600">
                            {copyStatus === 'linkCopied' ? <Check className='w-4 h-4 text-green-400'/> : <Copy className='w-4 h-4'/>}
                        </Button>
                    </div>
                </div>

                {/* 2. Password */}
                <div className="bg-red-800/30 border border-red-700 p-3 rounded-lg">
                    <p className='text-xs mb-1 text-red-300'>Student Access PIN:</p>
                    <div className='flex items-center justify-between'>
                        <span className='text-lg font-extrabold tracking-wider text-red-400'>{createdData.masterPassword}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(createdData.masterPassword, 'pass')} className="text-red-400 hover:bg-red-700/50">
                            {copyStatus === 'passCopied' ? <Check className='w-4 h-4 text-green-400'/> : <Copy className='w-4 h-4'/>}
                        </Button>
                    </div>
                </div>
                
                <Button onClick={handleStartClick} className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                    Join Live Class Now
                </Button>
            </div>
        ) : (
            // Initial State
            <div className="space-y-6">
                <DialogDescription>
                    Generate a unique channel, PIN for students, and your Educator Join Token.
                </DialogDescription>
                <Button 
                    onClick={handleCreate} 
                    disabled={isLoading} 
                    className="w-full bg-green-600 hover:bg-green-700"
                >
                    Create & Get Session Details
                </Button>
            </div>
        )
      }
      </DialogContent>
    </Dialog>
  );
}
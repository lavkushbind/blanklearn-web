'use client'; // MUST be the very first line

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth, realtimeDb } from "@/lib/firebase"; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Zap, Users, TrendingUp, CalendarCheck, Loader2, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils'; // Assuming you have a utility function for class merging

// --- Mock Data & Setup ---

// Define a structure for the schedule (used in the checkLiveStatus logic)
const MOCK_SCHEDULE = {
    classId: "BATCH-A-101", // The batch ID that is currently checked for live status
    nextClassTime: (() => {
        // Set class to be 5 minutes in the future for testing 'GO LIVE NOW'
        const date = new Date();
        date.setMinutes(date.getMinutes() + 5); 
        return date;
    })(),
    joinWindowMinutes: 10 // Educators can join 10 minutes before class starts
};


const MOCK_EDUCATOR_DATA = {
    name: "Ms. Priya Singh",
    id: "EDC1001",
    salaryRate: "₹350/hr",
    batches: [
        { id: "BATCH-A-101", name: "Grade 8 Science (Mon-Fri)", time: "6:00 PM IST", students: 7, scheduledTopic: "Chapter 3: Vectors" },
        { id: "BATCH-B-202", name: "Grade 9 Maths (T/Th/Sat)", time: "7:30 PM IST", students: 5, scheduledTopic: "Quadratic Equations" },
    ]
};

// --- Utility Functions & Constants ---
const glassCardClasses = "backdrop-blur-lg bg-white/5 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-3xl";

// --- Component 1: Batch Schedule Card ---
const BatchCard = ({ batch, onGoLive }: { batch: typeof MOCK_EDUCATOR_DATA['batches'][0] & { isLiveWindow: boolean, timeStatus: string } , onGoLive: (id: string) => void }) => {
    const { toast } = useToast();

    const handleGoLive = () => {
        if (batch.isLiveWindow) {
            toast({ title: "Starting Class", description: `Entering ${batch.name} Classroom.` });
            // In a real app, this would navigate to the live classroom:
            // router.push(`/educator/classroom/${batch.id}`);
            console.log(`Redirecting Educator to Classroom: /classroom/${batch.id}`);
        } else {
            toast({ title: "Not Yet Time", description: `Class starts at ${batch.time}.`, variant: "default" });
        }
    };

    return (
        <Card className={cn(glassCardClasses, "p-6 border-l-4 border-blue-400 flex flex-col")}>
            <CardHeader className="p-0 mb-3">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-blue-300" /> {batch.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow space-y-3 text-white">
                <div className='text-sm space-y-1'>
                    <p className={`flex items-center gap-2 text-lg font-extrabold ${batch.isLiveWindow ? 'text-red-400' : 'text-yellow-300'}`}>
                        <Clock className='w-4 h-4'/> {batch.timeStatus}
                    </p>
                    <p className="flex items-center gap-2 text-blue-200"><Users className='w-4 h-4'/> Students: {batch.students}</p>
                </div>
                <p className='text-sm text-slate-300 border-t border-white/10 pt-3'>Topic Today: <span className='font-semibold'>{batch.scheduledTopic}</span></p>
            </CardContent>
            <div className="mt-4 pt-4 border-t border-white/10">
                <Button 
                    onClick={handleGoLive}
                    disabled={!batch.isLiveWindow}
                    className={cn("w-full h-11 text-lg font-bold transition-all", 
                        batch.isLiveWindow 
                            ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 animate-pulse" 
                            : "bg-slate-700 text-slate-400 cursor-not-allowed"
                    )}
                >
                    {batch.isLiveWindow ? (
                        <span className='flex items-center gap-2'><Zap className="w-5 h-5" /> START CLASS</span>
                    ) : (
                        <span className='flex items-center gap-2'><Clock className="w-5 h-5" /> Wait for Class</span>
                    )}
                </Button>
            </div>
        </Card>
    );
};

// --- Component 2: Educator Stats ---
const EducatorStats = ({ educatorData }: { educatorData: typeof MOCK_EDUCATOR_DATA }) => (
    <Card className={cn(glassCardClasses, "p-6 border-t-4 border-purple-400 col-span-1")}>
        <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-300" /> Performance
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3 text-white">
            <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-sm text-blue-200">Hourly Rate</span>
                <span className="font-bold text-lg text-yellow-300">{educatorData.salaryRate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-sm text-blue-200">Batches Managed</span>
                <span className="font-bold text-lg text-white">{educatorData.batches.length}</span>
            </div>
            <div className="flex justify-between pt-2">
                <span className="text-sm text-blue-200">Total Students</span>
                <span className="font-bold text-lg text-white">{educatorData.batches.reduce((sum, b) => sum + b.students, 0)}</span>
            </div>
        </CardContent>
    </Card>
);


// ===================================================
// 3. MAIN EDUCATOR DASHBOARD (DEFAULT EXPORT)
// ===================================================
const EducatorDashboard = () => {
    const [educatorData] = useState(MOCK_EDUCATOR_DATA);
    // Initialize schedule state based on the mock data structure
    const [scheduleData, setScheduleData] = useState({
        classActive: false,
        classId: MOCK_SCHEDULE.classId,
        nextClassTime: MOCK_SCHEDULE.nextClassTime,
        joinWindowMinutes: MOCK_SCHEDULE.joinWindowMinutes,
    });

    const router = useRouter();
    const { toast } = useToast();

    // Handler for Live Status Checking
    const checkLiveStatus = useCallback(() => {
        const now = new Date();
        const nextClassTime = scheduleData.nextClassTime;
        
        const timeDiffMs = nextClassTime.getTime() - now.getTime();
        const diffMinutes = timeDiffMs / (1000 * 60); // Difference in minutes

        // Check if the current time is within the join window (e.g., 10 minutes before to 10 minutes after start)
        // For simplicity here, we check if we are within the defined window *before* the start time.
        const isWithinJoinWindow = diffMinutes >= -scheduleData.joinWindowMinutes && diffMinutes <= 0;
        
        setScheduleData(prev => ({ 
            ...prev, 
            classActive: isWithinJoinWindow,
            // If class is active, update the time status display dynamically if needed,
            // but for this component, setting classActive is enough to change the button.
        }));
    }, [scheduleData.nextClassTime, scheduleData.joinWindowMinutes]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            // Redirect only if running on the client side (which it is, due to 'use client')
            router.push('/educator/login');
            return;
        }

        // Initial check and continuous check every 10 seconds
        checkLiveStatus(); 
        const interval = setInterval(checkLiveStatus, 10000); 

        return () => clearInterval(interval);
    }, [router, checkLiveStatus]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push('/educator/login');
            toast({ title: "Logged Out", description: "You have been securely signed out." });
        } catch (error) {
            console.error("Logout error:", error);
            toast({ title: "Error", description: "Could not log out.", variant: "destructive" });
        }
    };


    return (
        <div className="min-h-screen p-4 md:p-8 font-sans relative">
            {/* Background Styling - Professional Dark Theme */}
            <div className="fixed inset-0 bg-slate-950 -z-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-indigo-950/90 -z-10 opacity-95"></div>
            <div className="absolute inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                
                {/* Header */}
                <header className="flex justify-between items-center mb-10 pt-4">
                    <div className="flex items-center gap-3">
                        {/* NOTE: Ensure /logo.jpg exists or replace with a correct path */}
                        <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-lg shadow-lg border-2 border-white/50" />
                        <h1 className="text-3xl font-extrabold text-white tracking-tight hidden sm:block">Educator Hub</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-lg font-bold text-white">{educatorData.name}</p>
                            <p className="text-sm text-green-300">Educator ID: {educatorData.id}</p>
                        </div>
                        <Button variant="outline" onClick={handleLogout} className='bg-white/10 text-white border-white/30 hover:bg-white/20'>
                            <LogOut className='w-4 h-4 mr-2'/> Logout
                        </Button>
                    </div>
                </header>

                <main className="space-y-8">
                    
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Today's Schedule</h2>

                    {/* BATCHES ROW */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {educatorData.batches.map((batch) => (
                            <BatchCard 
                                key={batch.id} 
                                batch={{ 
                                    ...batch, 
                                    // Logic to determine if this specific batch is the one currently 'live'
                                    isLiveWindow: scheduleData.classActive && batch.id === scheduleData.classId,
                                    timeStatus: (scheduleData.classActive && batch.id === scheduleData.classId) 
                                                ? "LIVE NOW" 
                                                : batch.time
                                }} 
                                onGoLive={() => { /* Handled internally */ }}
                            />
                        ))}

                        {/* Educator Stats Card */}
                        <EducatorStats educatorData={educatorData} />
                    </div>
                    
                </main>
                
                <footer className='pt-12 text-center text-sm text-slate-400'>
                    &copy; 2026 Blanklearn Educator Portal.
                </footer>
            </div>
        </div>
    );
}

// Ensure this is the final default export that Next.js expects for the route segment.
export default EducatorDashboard;
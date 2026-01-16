'use client'; // *** IMPORTANT: Keeping this at the top ensures all sub-components run as Client Components ***

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onValue, ref } from "firebase/database";
import { auth, realtimeDb } from "@/lib/firebase"; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Clock, Play, DollarSign, Loader2, Zap, CalendarCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // Ensure useToast is imported correctly

// --- MOCK DATA ---
const MOCK_USER_DATA = {
    name: "Aarav Sharma",
    class: "8th Grade",
    isPaid: false, // Change this to true to test Join button functionality
    plan: "Small Group (₹1499/mo)",
    nextClassTopic: "Chapter 3: Vectors & Forces",
};

// Set next class 15 minutes in the FUTURE 
const DURATION_TO_WAIT_MS = 15 * 60 * 1000; 
const MOCK_SCHEDULE = {
    today: "January 16, 2026",
    nextClassTime: new Date(new Date().getTime() + DURATION_TO_WAIT_MS), 
    joinWindowMinutes: 10, 
    classId: "BATCH-A-101",
};

// --- Glassmorphism Style Utility ---
const glassCardClasses = "backdrop-blur-lg bg-white/5 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-3xl";

// --- Component 1: Next Class Card (Now includes useToast hook) ---
const NextClassCard = ({ schedule, userData }: { schedule: typeof MOCK_SCHEDULE, userData: typeof MOCK_USER_DATA }) => {
    const [joinActive, setJoinActive] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('');
    const router = useRouter();
    const { toast } = useToast(); // useToast is now correctly available here

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const classStart = schedule.nextClassTime;
            const timeDiffMs = classStart.getTime() - now.getTime();
            const diffMinutes = Math.floor(timeDiffMs / (1000 * 60));
            
            const isActive = diffMinutes >= -5 && diffMinutes <= schedule.joinWindowMinutes;
            setJoinActive(isActive);
            
            if (timeDiffMs > 0) {
                const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiffMs % (1000 * 60)) / 1000);
                setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
            } else if (isActive) {
                setTimeRemaining("LIVE NOW!");
            } else {
                setTimeRemaining("Waiting for next class...");
            }
        };

        const interval = setInterval(checkTime, 1000);
        checkTime(); 

        return () => clearInterval(interval);
    }, [schedule]);

    const handleJoin = () => {
        if (!userData.isPaid) {
             toast({ title: "Payment Required", description: "Please complete your subscription to join live classes.", variant: "destructive" });
             return;
        }
        if (joinActive) {
            // *** IMPORTANT: Ensure /classroom/[id] page exists and is also 'use client' ***
            router.push(`/classroom/${schedule.classId}`); 
        } else {
            toast({ title: "Wait for Class Time", description: "The join window is not yet active.", variant: "default" });
        }
    };

    return (
        <Card className={cn(glassCardClasses, "p-6 col-span-1 lg:col-span-2 border-t-4 border-blue-400")}>
            <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-300" /> Next Live Class
                </CardTitle>
                <span className="text-xs font-medium text-blue-200 bg-white/10 px-3 py-1 rounded-full">{schedule.today}</span>
            </CardHeader>
            <CardContent className="p-0 space-y-5">
                <div className="text-white">
                    <p className="text-3xl font-extrabold leading-snug">{schedule.nextClassTopic}</p>
                    <p className="text-lg text-blue-200 mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {schedule.nextClassTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                    </p>
                </div>

                <div className='pt-2'>
                    <div className={`p-3 rounded-xl text-center transition-colors ${joinActive ? 'bg-green-500/20 text-green-200 border border-green-400' : 'bg-slate-600/30 text-slate-300 border border-slate-600'}`}>
                        <p className='text-sm font-semibold'>{joinActive ? "Class Active!" : "Time Until Join Window"}</p>
                        <p className='text-2xl font-bold mt-0.5'>{timeRemaining}</p>
                    </div>
                </div>

                <Button 
                    onClick={handleJoin} 
                    disabled={!joinActive || !userData.isPaid}
                    className={cn("w-full h-12 text-lg font-bold transition-all", 
                        joinActive && userData.isPaid ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-slate-700 text-slate-400 cursor-not-allowed"
                    )}
                >
                    {joinActive && userData.isPaid ? (
                        <span className='flex items-center gap-2'><Play className="w-5 h-5 fill-current" /> JOIN CLASS NOW</span>
                    ) : !userData.isPaid ? (
                        <span className='flex items-center gap-2'><DollarSign className="w-5 h-5" /> COMPLETE PAYMENT</span>
                    ) : (
                        <span className='flex items-center gap-2'><Clock className="w-5 h-5" /> Wait for {timeRemaining}</span>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};

// --- Component 2: Status & Plan Card ---
const StatusCard = ({ userData, onPaymentClick }: { userData: typeof MOCK_USER_DATA, onPaymentClick: () => void }) => {
    const isPaid = userData.isPaid;
    
    return (
        <Card className={cn(glassCardClasses, "p-6 border-t-4 border-purple-400 col-span-1")}>
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-300" /> Enrollment Status
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-white">
                <div className='space-y-1'>
                    <p className="text-lg font-semibold">{userData.plan}</p>
                    <p className='text-sm text-blue-200'>{userData.class}</p>
                </div>

                <div className={`p-3 rounded-lg text-center font-bold ${isPaid ? 'bg-green-600/20 text-green-300 border border-green-400' : 'bg-red-600/20 text-red-300 border border-red-400'}`}>
                    {isPaid ? "Subscription Active" : "Trial Expired / Pending"}
                </div>

                {!isPaid && (
                    <Button 
                        onClick={onPaymentClick}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold shadow-lg shadow-yellow-500/30"
                    >
                        <DollarSign className="w-5 h-5 mr-2" /> Pay ₹1499 Now
                    </Button>
                )}
                
                {isPaid && (
                     <Button variant="outline" className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20">
                        View Invoice
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

// --- Component 3: Learning Overview Card ---
const LearningCard = () => (
    <Card className={cn(glassCardClasses, "p-6 border-t-4 border-green-400 col-span-1 lg:col-span-1")}>
        <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-green-300" /> Learning Overview
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3 text-white">
            <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-sm text-blue-200">Overall Progress</span>
                <span className="font-bold text-lg text-green-300">78%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
                <span className="text-sm text-blue-200">Upcoming Topics</span>
                <span className="font-bold text-lg text-white">4 More</span>
            </div>
            <div className="flex justify-between pt-2">
                <span className="text-sm text-blue-200">Last Session Score</span>
                <span className="font-bold text-lg text-white">9/10</span>
            </div>
            <Button variant="link" className='text-sm text-white/80 hover:text-white mt-3 p-0'>View Detailed Report →</Button>
        </CardContent>
    </Card>
);


// ===================================================
// 4. MAIN DASHBOARD PAGE
// ===================================================
export default function StudentDashboard() {
    const [userData] = useState(MOCK_USER_DATA);
    const [scheduleData] = useState(MOCK_SCHEDULE);
    const router = useRouter();
    const { toast } = useToast();

    const handlePaymentClick = () => {
        router.push('/student/payment');
        toast({ title: "Navigate to Payment", description: "Redirecting to the payment portal." });
    }

    // Security Check: Use useCallback for stable function reference
    const checkAuthStatus = useCallback(() => {
        const user = auth.currentUser;
        if (!user) {
            router.push('/student/login');
        }
    }, [router]);

    useEffect(() => {
        checkAuthStatus();
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                router.push('/student/login');
            }
        });
        return () => unsubscribe();
    }, [checkAuthStatus]);

    return (
        <div className="min-h-screen p-4 md:p-8 font-sans relative">
            {/* Background Styling - Deep Indigo/Blue Gradient for Premium Feel */}
            <div className="fixed inset-0 bg-slate-950 -z-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-slate-900/90 to-blue-900/80 -z-10 opacity-95"></div>
            <div className="absolute inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm"></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                
                {/* Header */}
                <header className="flex justify-between items-center mb-10 pt-4">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-lg shadow-lg border-2 border-white/50" />
                        <h1 className="text-3xl font-extrabold text-white tracking-tight hidden sm:block">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-lg font-bold text-white">{userData.name}</p>
                            <p className="text-sm text-blue-300">{userData.class}</p>
                        </div>
                        {/* User Avatar Placeholder */}
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold border border-white/50 shadow-md">
                            {userData.name[0]}
                        </div>
                    </div>
                </header>

                <main className="space-y-8">
                    
                    {/* TOP ROW: Next Class & Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* 1. Next Class Card (Takes 2/3 width) */}
                        <NextClassCard schedule={scheduleData} userData={userData} />
                        
                        {/* 2. Status Card (Takes 1/3 width) */}
                        <StatusCard 
                            userData={userData} 
                            onPaymentClick={handlePaymentClick}
                        />
                    </div>

                    {/* SECOND ROW: Learning Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* 3. Learning Overview Card */}
                        <LearningCard />
                        
                        {/* Placeholder Card */}
                        <Card className={cn(glassCardClasses, "p-6 col-span-1 lg:col-span-2 border-l-4 border-indigo-400")}>
                            <CardHeader className="p-0 mb-3">
                                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-300" /> Welcome Message
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 text-white">
                                <p className='text-lg font-medium'>Your next class is scheduled for **{scheduleData.nextClassTime.toLocaleDateString()}**.</p>
                                <p className='text-sm text-blue-200 mt-2'>Make sure your device and internet connection are ready 5 minutes before class starts.</p>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                
                <footer className='pt-12 text-center text-sm text-slate-400'>
                    &copy; 2026 Blanklearn. Secured Access.
                </footer>
            </div>
        </div>
    );
}
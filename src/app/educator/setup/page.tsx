"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, PlusCircle, XCircle, Loader2 } from "lucide-react";
import { db } from '@/lib/firebase'; // Ensure correct path
import { ref, set, update } from "firebase/database";

// --- MOCK DATA (These should ideally come from config files or another DB node) ---
const MOCK_CLASSES = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const MOCK_SUBJECTS = ["Maths", "Science", "English", "Social Studies"];
const MOCK_SLOTS = ["8:00 AM - 9:00 AM", "11:00 AM - 12:00 PM", "4:00 PM - 5:00 PM", "6:00 PM - 7:00 PM"];
// --- END MOCK DATA ---

// Temporary Educator ID for simulation. In a real app, this comes from Auth context.
const DUMMY_EDUCATOR_ID = "FvlPVOxvMHdN5GSEb8GQXoVJMv02"; // Using the ID from your screenshot

interface NewSchedule {
    class: string;
    subject: string;
    timeSlot: string;
}

const SessionSetupPage = () => {
    const [newSchedule, setNewSchedule] = useState<NewSchedule>({
        class: '',
        subject: '',
        timeSlot: ''
    });
    const [currentSchedules, setCurrentSchedules] = useState<Record<string, any>>({}); // To display existing sessions
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // --- Placeholder for loading existing schedules (Use on Mount) ---
    // In a full app, you'd use useEffect with onValue or onSnapshot to fetch data dynamically.
    // For this example, we'll use the structure you provided:
    useMemo(() => {
        // Simulate loading existing data structure provided by user for John Doe
        setCurrentSchedules({
            "slot1": { class: "Class 5", subject: "Maths", timeSlot: "4:00 PM - 5:00 PM", studentsCount: 3, isActive: true },
            "slot2": { class: "Class 8", subject: "Science", timeSlot: "11:00 AM - 12:00 PM", studentsCount: 0, isActive: true },
        });
    }, []);


    const handleNewScheduleChange = (key: keyof NewSchedule, value: string) => {
        setNewSchedule(prev => ({ ...prev, [key]: value }));
        setMessage(null); // Clear message on change
    };

    const handleAddSchedule = async () => {
        if (!newSchedule.class || !newSchedule.subject || !newSchedule.timeSlot) {
            setMessage({ type: 'error', text: 'Please select Class, Subject, and Time Slot.' });
            return;
        }

        setIsLoading(true);
        
        // Generate a unique key for the new schedule slot
        const newKey = `session_${Date.now()}`; 

        const scheduleData = {
            ...newSchedule,
            studentsCount: 0, // Initialize with 0 students
            isActive: true,
            // We might also want to save classes/subjects taught as an array in the main user profile
        };

        try {
            // Target the specific educator's schedule node
            await set(ref(db, `Users/${DUMMY_EDUCATOR_ID}/schedules/${newKey}`), scheduleData);
            
            setMessage({ type: 'success', text: `Successfully added schedule: ${newSchedule.class} (${newSchedule.subject}) at ${newSchedule.timeSlot}` });
            
            // Update local state immediately for better UX
            setCurrentSchedules(prev => ({ ...prev, [newKey]: scheduleData }));
            
            // Reset form
            setNewSchedule({ class: '', subject: '', timeSlot: '' });

        } catch (error) {
            console.error("Error setting schedule:", error);
            setMessage({ type: 'error', text: 'Failed to save schedule to database.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (key: string, currentStatus: boolean) => {
        try {
            await update(ref(db, `Users/${DUMMY_EDUCATOR_ID}/schedules/${key}/isActive`), !currentStatus);
            
            // Update local state
            setCurrentSchedules(prev => ({
                ...prev,
                [key]: { ...prev[key], isActive: !currentStatus }
            }));
            setMessage({ type: 'success', text: `Schedule ${currentStatus ? 'deactivated' : 'activated'} successfully.` });

        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update schedule status.' });
        }
    };

    // Helper to map mock data to SelectItems
    const renderSelectItems = (options: string[]) => options.map(option => (
        <SelectItem key={option} value={option}>{option}</SelectItem>
    ));


    return (
        <main className="flex-1 p-8 bg-slate-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Session Configuration</h1>
                <p className="text-slate-500">Define the classes, subjects, and time slots you are available for.</p>
            </header>

            {message && (
                <Card className={`mb-6 p-4 border-l-4 ${message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    <div className="flex items-center">
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> : <XCircle className="w-5 h-5 text-red-600 mr-2" />}
                        <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{message.text}</p>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Add New Session Card */}
                <Card className="lg:col-span-1 h-fit shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PlusCircle className="w-5 h-5 text-blue-600"/> Define New Session</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Class Level</label>
                            <Select 
                                onValueChange={(v) => handleNewScheduleChange('class', v)} 
                                value={newSchedule.class}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {renderSelectItems(MOCK_CLASSES)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Subject</label>
                            <Select 
                                onValueChange={(v) => handleNewScheduleChange('subject', v)}
                                value={newSchedule.subject}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {renderSelectItems(MOCK_SUBJECTS)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Time Slot</label>
                            <Select 
                                onValueChange={(v) => handleNewScheduleChange('timeSlot', v)}
                                value={newSchedule.timeSlot}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Time Slot" />
                                </SelectTrigger>
                                <SelectContent>
                                    {renderSelectItems(MOCK_SLOTS)}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button 
                            onClick={handleAddSchedule} 
                            className="w-full bg-blue-600 hover:bg-blue-700 mt-4 font-bold"
                            disabled={isLoading}
                        >
                            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Add Session Slot"}
                        </Button>
                    </CardContent>
                </Card>

                {/* 2. Existing Schedules List */}
                <Card className="lg:col-span-2 shadow-lg">
                    <CardHeader>
                        <CardTitle>Currently Configured Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.keys(currentSchedules).length === 0 ? (
                                <p className="text-center text-slate-500 p-10 border border-dashed rounded-lg">No sessions defined yet. Use the panel on the left to start configuring.</p>
                            ) : (
                                Object.entries(currentSchedules).map(([key, session]) => (
                                    <div key={key} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors shadow-sm">
                                        
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${session.isActive ? 'text-blue-600' : 'text-red-500'}`}>
                                                {session.isActive ? 'Active' : 'Inactive'}
                                            </p>
                                            <h4 className="text-lg font-bold text-slate-900 truncate">
                                                {session.class} • {session.subject}
                                            </h4>
                                            <p className="text-sm text-slate-500 mt-0.5">{session.timeSlot}</p>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3">
                                            <span className="text-sm font-semibold text-slate-700 hidden sm:block">{session.studentsCount} Students</span>
                                            
                                            <Button 
                                                size="sm" 
                                                variant={session.isActive ? "destructive" : "outline"}
                                                onClick={() => handleToggleActive(key, session.isActive)}
                                                disabled={isLoading}
                                            >
                                                {session.isActive ? <XCircle className='w-4 h-4'/> : <CheckCircle className='w-4 h-4 text-green-600'/>}
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default SessionSetupPage;
"use client"; // <-- THIS MUST BE THE ABSOLUTE FIRST LINE

import React, { useState, useMemo } from 'react';import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";  
import { Clock, Video, Phone, BookOpen, Mail, Users, LogOut, Menu, Calendar, ListChecks, BarChart3 } from "lucide-react";

// --- Mock Data Interfaces (As defined above) ---
interface Student {
    id: number;
    name: string;
    phone: string;
    attendance: number; // Percentage
    lastActivity: string;
}

interface Batch {
    id: number;
    time: string;
    class: string;
    subject: string;
    filled: number;
    capacity: number;
    students: Student[];
}

interface Teacher {
    id: number;
    name: string;
    role: string;
}

// --- Mock Data (As defined above) ---
const mockStudents: Student[] = [
    { id: 101, name: "Aarav Singh", phone: "+91-9876543210", attendance: 95, lastActivity: "2 days ago" },
    { id: 102, name: "Bhavna Patel", phone: "+91-9988776655", attendance: 88, lastActivity: "1 hour ago" },
    { id: 103, name: "Chirag Verma", phone: "+91-9123456789", attendance: 100, lastActivity: "Today" },
    { id: 104, name: "Divya Rao", phone: "+91-9001122334", attendance: 75, lastActivity: "Yesterday" },
    { id: 105, name: "Eshan Kumar", phone: "+91-8877665544", attendance: 92, lastActivity: "3 hours ago" },
];

const mockBatches: Batch[] = [
  {
    id: 1,
    time: "4:00 PM - 5:00 PM",
    class: "Class 5",
    subject: "Maths",
    filled: 3,
    capacity: 5,
    students: mockStudents.slice(0, 3),
  },
  {
    id: 2,
    time: "5:30 PM - 6:30 PM",
    class: "Class 8",
    subject: "Science",
    filled: 5,
    capacity: 10,
    students: mockStudents.slice(2, 7).filter((_, i) => i < 5),
  },
];

const mockTeacher: Teacher = {
    id: 1,
    name: "Priya Sharma",
    role: "Maths Expert",
}


// --- Sidebar Component ---
const Sidebar: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
    const [activeItem, setActiveItem] = useState('Dashboard');

    const navItems = [
        { name: 'Dashboard', icon: BarChart3, key: 'Dashboard' },
        { name: 'My Schedule', icon: Calendar, key: 'Schedule' },
        { name: 'My Batches', icon: Users, key: 'Batches' },
        { name: 'Study Material', icon: BookOpen, key: 'Material' },
        { name: 'Messages', icon: Mail, key: 'Messages' },
    ];

    return (
        <div className="fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shadow-2xl z-20">
            <div>
                <div className="flex items-center gap-2 p-4 mb-8">
                    <div className="p-1 bg-blue-600 rounded-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-extrabold tracking-wide text-white">Educator Pro</h2>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <div
                            key={item.key}
                            onClick={() => setActiveItem(item.key)}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                                activeItem === item.key
                                    ? 'bg-blue-600 text-white font-semibold shadow-lg'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </div>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold mr-3">
                        {teacher.name[0]}
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{teacher.name}</p>
                        <p className="text-xs text-slate-400">{teacher.role}</p>
                    </div>
                </div>
                <div className="flex items-center p-2 rounded-lg text-red-400 hover:bg-slate-800 cursor-pointer transition-colors">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Logout</span>
                </div>
            </div>
        </div>
    );
};

// --- Student Detail Modal Component ---
interface ProfileModalProps {
    viewProfile: Student | null;
    setViewProfile: (student: Student | null) => void;
}

const StudentProfileModal: React.FC<ProfileModalProps> = ({ viewProfile, setViewProfile }) => {
    if (!viewProfile) return null;

    return (
        <Dialog open={!!viewProfile} onOpenChange={() => setViewProfile(null)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className='text-xl'>Student Profile: {viewProfile.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 ring-4 ring-blue-50">
                            {viewProfile.name[0]}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{viewProfile.name}</h2>
                            <p className="text-slate-500">Student ID: {viewProfile.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div>
                            <p className="text-sm text-slate-500 uppercase tracking-wider">Parent Contact</p>
                            <p className="font-semibold text-lg flex items-center gap-2"><Phone className="w-4 h-4"/> {viewProfile.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 uppercase tracking-wider">Last Seen</p>
                            <p className="font-semibold text-lg">{viewProfile.lastActivity}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-slate-500 uppercase tracking-wider">Attendance Rate</p>
                        <div className="flex items-center gap-3">
                            <Progress value={viewProfile.attendance} className="flex-1 h-2" />
                            <span className="text-base font-bold text-green-600 w-10 text-right">{viewProfile.attendance}%</span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setViewProfile(null)}>Close</Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Phone className="w-4 h-4 mr-2" /> Contact Parent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// --- Main Dashboard Component ---

const TeacherDashboard: React.FC = () => {
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [viewProfile, setViewProfile] = useState<Student | null>(null);
    const [isLive, setIsLive] = useState(false); // State for starting a class

    // Calculate summary statistics
    const totalCapacity = useMemo(() => mockBatches.reduce((sum, b) => sum + b.capacity, 0), []);
    const totalEnrolled = useMemo(() => mockBatches.reduce((sum, b) => sum + b.filled, 0), []);
    const onlineStatus = true; // Simulated online status

    const handleStartClass = (batch: Batch) => {
        console.log(`Starting live class for ${batch.class} ${batch.subject}`);
        // In a real app, this would trigger navigation or API call
        setIsLive(true);
    };

    const handleBatchSelect = (batch: Batch) => {
        setSelectedBatch(batch);
        setViewProfile(null); // Close profile if a new batch is selected
    }
    
    const handleViewProfile = (student: Student) => {
        setSelectedBatch(null); // Ensure the sidebar list view is deselected
        setViewProfile(student);
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* 1. Sidebar */}
            <Sidebar teacher={mockTeacher} />

            {/* 2. Main Content Area */}
            <main className="flex-1 ml-64 p-8">
                {/* Header and Status */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Teacher Dashboard
                        </h1>
                        <p className="text-slate-500 text-base">Welcome back, {mockTeacher.name}. Manage your sessions today.</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                        onlineStatus ? 'bg-green-100 border-green-200' : 'bg-amber-100 border-amber-200'
                    }`}>
                        <span className={`w-3 h-3 rounded-full ${onlineStatus ? 'bg-green-600 animate-pulse' : 'bg-amber-600'}`}></span>
                        <span className={`text-sm font-bold uppercase ${onlineStatus ? 'text-green-700' : 'text-amber-700'}`}>
                            {onlineStatus ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <Card className="shadow-lg border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Today's Sessions</CardTitle>
                            <Calendar className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockBatches.length} Classes</div>
                            <p className="text-xs text-slate-400 mt-1">Scheduled for today</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalEnrolled} / {totalCapacity}</div>
                            <p className="text-xs text-slate-400 mt-1">Across all active batches</p>
                        </CardContent>
                    </Card>

                     <Card className="shadow-lg border-l-4 border-l-amber-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Study Material</CardTitle>
                            <BookOpen className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12 Resources</div>
                            <p className="text-xs text-slate-400 mt-1">Uploaded this week</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Pending Reports</CardTitle>
                            <ListChecks className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2 Urgent</div>
                            <p className="text-xs text-slate-400 mt-1">Submit feedback by EOD</p>
                        </CardContent>
                    </Card>
                </div>


                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Upcoming Sessions */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold text-slate-800">Today's Live Sessions</h2>
                        
                        {mockBatches.length > 0 ? (
                            mockBatches.map((batch) => (
                                <Card key={batch.id} className="border-l-4 border-l-blue-600 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Badge variant="secondary" className="mb-2 text-xs bg-blue-100 text-blue-700 border-blue-300">
                                                    <Clock className="w-3 h-3 mr-1"/> {batch.time}
                                                </Badge>
                                                <h3 className="text-xl font-bold text-slate-900">{batch.class} • {batch.subject}</h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-blue-600">{batch.filled}/{batch.capacity}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Students Attended</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex gap-3 border-t pt-4">
                                            <Button 
                                                onClick={() => handleStartClass(batch)} 
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold"
                                                disabled={batch.filled === 0} // Disable if no students are currently enrolled/present
                                            >
                                                <Video className="w-4 h-4 mr-2" /> Start Live Class
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => handleBatchSelect(batch)} 
                                                className={`border-slate-300 ${selectedBatch?.id === batch.id ? 'bg-slate-100' : ''}`}
                                            >
                                                Details & Roster
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-8 text-center border-dashed border-slate-300 bg-white">
                                <Calendar className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                                <p className="text-slate-600 font-semibold">No sessions scheduled for today.</p>
                                <p className="text-sm text-slate-400 mt-1">Check your schedule for future classes.</p>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Student Roster / Batch Details */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-slate-800">Student Roster</h2>
                        {selectedBatch ? (
                            <Card className="bg-white shadow-lg">
                                <CardHeader className="bg-slate-50 p-4 border-b rounded-t-xl">
                                    <CardTitle className="text-lg">
                                        {selectedBatch.class} ({selectedBatch.subject})
                                    </CardTitle>
                                    <p className="text-sm text-slate-500">{selectedBatch.filled} Students Enrolled</p>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                                    {selectedBatch.students.map((stu) => (
                                        <div key={stu.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-white hover:bg-blue-50 transition-colors">
                                            <span className="font-semibold text-sm text-slate-800">{stu.name}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">{stu.attendance}%</Badge>
                                                <Button size="sm" variant="ghost" onClick={() => handleViewProfile(stu)} title="View Profile">
                                                    <Phone className="w-4 h-4 text-blue-600"/>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="p-10 border-2 border-dashed border-blue-200 rounded-xl text-center text-slate-500 bg-white h-[calc(100vh-350px)] flex flex-col justify-center items-center">
                                <Users className="w-10 h-10 mb-3 text-blue-400" />
                                <p className="font-semibold">Select a batch from the left</p>
                                <p className="text-sm mt-1">To view the student roster and performance details.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Live Class Modal Placeholder */}
            <Dialog open={isLive} onOpenChange={setIsLive}>
                <DialogContent className="sm:max-w-4xl bg-gray-900 text-white border-none">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-white">LIVE CLASS IN PROGRESS</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-xl">
                        [Live Video Feed Placeholder: Class in Session]
                    </div>
                    <DialogFooter>
                        <Button variant="destructive" onClick={() => setIsLive(false)}>End Class</Button>
                        <Button>Mute All</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Student Profile Modal is rendered separately */}
            <StudentProfileModal 
                viewProfile={viewProfile} 
                setViewProfile={handleViewProfile} 
            />
        </div>
    );
};

export default TeacherDashboard;
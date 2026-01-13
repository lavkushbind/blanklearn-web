'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Video, Clock, Calendar, FileText, LogOut, 
  PlayCircle, CheckCircle, User 
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check Login
    const storedUser = localStorage.getItem("studentUser");
    if (!storedUser) {
      router.push("/student/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studentUser");
    router.push("/student/login");
  };

  const joinClass = () => {
    // Future: Redirect to actual Video Room (/classroom/batchId)
    // Abhi ke liye demo room
    window.open(`/classroom/demo-room`, '_blank');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.studentName?.[0]}
          </div>
          <div>
            <h1 className="font-bold text-slate-900">{user.studentName}</h1>
            <p className="text-xs text-slate-500">{user.studentClass} • {user.interestedPlan}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:bg-red-50">
          <LogOut size={18} className="mr-2"/> Logout
        </Button>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* HERO: UPCOMING CLASS */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Up Next</span>
            <h2 className="text-3xl font-bold mt-4">Mathematics Live Class</h2>
            <div className="flex items-center gap-4 mt-2 text-blue-100">
              <span className="flex items-center gap-1"><Calendar size={16}/> Today</span>
              <span className="flex items-center gap-1"><Clock size={16}/> {user.demoTime || "6:00 PM"}</span>
            </div>
            <p className="mt-4 text-sm opacity-90">Topic: Algebra Basics & Linear Equations</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm text-center min-w-[250px]">
            <p className="text-sm font-medium mb-4">Class starts in 10 mins</p>
            <Button onClick={joinClass} size="lg" className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg">
              <Video className="mr-2 w-5 h-5" /> Join Now
            </Button>
          </div>
        </div>

        {/* SECTION: MY LEARNING */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Recent Recordings */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <PlayCircle className="text-blue-600"/> Recent Recordings
            </h3>
            
            {[1, 2].map((item) => (
              <Card key={item} className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-purple-500">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900">Science: Forces & Motion</h4>
                    <p className="text-xs text-slate-500 mt-1">Recorded on 8th Jan • 45 mins</p>
                  </div>
                  <Button variant="outline" size="sm"><PlayCircle size={16} className="mr-2"/> Watch</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Assignments / Notice */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <FileText className="text-orange-500"/> Assignments
            </h3>
            
            <Card className="bg-orange-50 border-orange-100">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-orange-600 w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Maths Worksheet 2.1</p>
                    <p className="text-xs text-slate-600 mt-1">Due: Tomorrow, 10 AM</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600 text-xs mt-2">Download PDF</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
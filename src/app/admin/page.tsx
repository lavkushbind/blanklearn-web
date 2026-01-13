'use client';

import { useEffect, useState } from "react";
import { realtimeDb } from "@/lib/firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Phone, MessageCircle, Search, Trash2, 
  CheckCircle, LayoutDashboard, UserCheck, Calendar 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'users'
  const [search, setSearch] = useState("");
  
  // Data States
  const [leads, setLeads] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalLeads: 0, totalUsers: 0 });

  // --- FETCH DATA ---
  useEffect(() => {
    // 1. Fetch Website Leads (DemoBookings)
    const leadsRef = ref(realtimeDb, "DemoBookings");
    onValue(leadsRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([key, val]: any) => ({
          id: key, 
          ...val
        })).reverse(); // Latest first
        setLeads(list);
        setStats(prev => ({ ...prev, totalLeads: list.length }));
      }
    });

    // 2. Fetch App Users (Users)
    const usersRef = ref(realtimeDb, "Users");
    onValue(usersRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([uid, val]: any) => ({
          uid, 
          ...val
        }));
        setUsers(list);
        setStats(prev => ({ ...prev, totalUsers: list.length }));
      }
    });
  }, []);

  // --- FILTER LOGIC ---
  const filteredData = (activeTab === 'leads' ? leads : users).filter((item) => {
    const q = search.toLowerCase();
    const name = item.studentName || item.name || "";
    const phone = item.mobileNumber || item.phone || "";
    const cls = item.studentClass || "";
    return name.toLowerCase().includes(q) || phone.includes(q) || cls.toLowerCase().includes(q);
  });

  // --- ACTIONS ---
  const markLeadStatus = async (id: string, status: string) => {
    await update(ref(realtimeDb, `DemoBookings/${id}`), { status });
  };

  const deleteEntry = async (path: string) => {
    if(confirm("Are you sure?")) {
      await remove(ref(realtimeDb, path));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-6 fixed h-full hidden md:block">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <LayoutDashboard /> Admin
        </h2>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'leads' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}`}
          >
            <Calendar size={18} /> Website Leads
            <Badge className="bg-white text-slate-900 ml-auto">{stats.totalLeads}</Badge>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'users' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800'}`}
          >
            <Users size={18} /> App Users
            <Badge className="bg-white text-slate-900 ml-auto">{stats.totalUsers}</Badge>
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-8">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            {activeTab === 'leads' ? 'Demo Bookings Management' : 'Registered App Users'}
          </h1>
          <div className="relative w-96">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Search Name, Phone, Class..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* --- LEADS TAB (WEBSITE BOOKINGS) --- */}
        {activeTab === 'leads' && (
          <div className="grid gap-4">
            {filteredData.map((lead) => (
              <Card key={lead.id} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  
                  {/* Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">{lead.studentName}</h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">{lead.studentClass}</Badge>
                      <span className="text-xs text-slate-400">{lead.bookingDate}</span>
                    </div>
                    <p className="text-slate-600 text-sm font-medium">Plan: {lead.interestedPlan} • Slot: {lead.demoTime}</p>
                    <p className="text-slate-500 text-xs">ID: {lead.id}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${lead.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {lead.status === 'booked_free' ? 'Pending' : lead.status}
                    </div>

                    {/* WhatsApp */}
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(`https://wa.me/91${lead.mobileNumber}?text=Hello ${lead.studentName}, regarding your Demo Class for ${lead.studentClass}...`, '_blank')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                    </Button>

                    {/* Call */}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`tel:${lead.mobileNumber}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" /> Call
                    </Button>

                    {/* Mark Done */}
                    {lead.status !== 'done' && (
                      <Button size="sm" variant="ghost" onClick={() => markLeadStatus(lead.id, 'done')} title="Mark as Done">
                        <CheckCircle className="w-5 h-5 text-slate-400 hover:text-green-600" />
                      </Button>
                    )}

                    {/* Delete */}
                    <Button size="sm" variant="ghost" onClick={() => deleteEntry(`DemoBookings/${lead.id}`)} title="Delete Lead">
                      <Trash2 className="w-5 h-5 text-red-400 hover:text-red-600" />
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}
            {filteredData.length === 0 && <p className="text-center text-slate-500 mt-10">No leads found.</p>}
          </div>
        )}

        {/* --- USERS TAB (APP USERS) --- */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-4 font-bold text-slate-700">Name</th>
                  <th className="p-4 font-bold text-slate-700">Phone</th>
                  <th className="p-4 font-bold text-slate-700">Status</th>
                  <th className="p-4 font-bold text-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user) => (
                  <tr key={user.uid} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-medium">{user.name || "No Name"}</td>
                    <td className="p-4 text-slate-600">{user.phone}</td>
                    <td className="p-4">
                      <Badge className={user.verify ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                        {user.verify ? "Verified" : "Unverified"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8"
                            onClick={() => update(ref(realtimeDb, `Users/${user.uid}`), { verify: !user.verify })}
                        >
                            <UserCheck className="w-4 h-4 mr-1" /> {user.verify ? "Block" : "Verify"}
                        </Button>
                        <Button size="sm" variant="destructive" className="h-8" onClick={() => deleteEntry(`Users/${user.uid}`)}>
                            Delete
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && <div className="p-8 text-center text-slate-500">No users found matching search.</div>}
          </div>
        )}

      </div>
    </div>
  );
}
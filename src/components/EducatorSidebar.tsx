'use client';
import { LayoutDashboard, Calendar, Users, MessageSquare, FileText, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';

export default function EducatorSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'schedule', label: 'My Schedule', icon: <Calendar size={20} /> },
    { id: 'batches', label: 'My Batches', icon: <Users size={20} /> },
    { id: 'chat', label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'resources', label: 'Study Material', icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-slate-300 border-r border-slate-800">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="rounded-lg" />
        <span className="font-bold text-white text-lg">Educator Pro</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-medium' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">P</div>
            <div>
                <p className="text-white text-sm font-bold">Priya Sharma</p>
                <p className="text-xs text-slate-500">Maths Expert</p>
            </div>
        </div>
        <button className="w-full flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
            <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
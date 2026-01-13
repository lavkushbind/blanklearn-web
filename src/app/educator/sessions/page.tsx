"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, PlusCircle, XCircle } from "lucide-react";

import { auth, realtimeDb } from "@/lib/firebase";
import { ref, set, update, onValue } from "firebase/database";
import { useRouter } from "next/navigation";

const CLASSES = ["Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SUBJECTS = ["Maths", "Science", "English", "Social"];
const SLOTS = ["8-9 AM", "11-12 PM", "4-5 PM", "6-7 PM"];

export default function SessionSetup() {
  const router = useRouter();
  const [newSession, setNewSession] = useState({ class: "", subject: "", time: "" });
  const [sessions, setSessions] = useState<any>({});

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return router.push("/login");

    // Check verification
    onValue(ref(realtimeDb, `teachers/${user.uid}`), (snap) => {
      const data = snap.val();
      if (!data?.isVerified) {
        router.push("/educator/verify");
      }
    });

    // Load sessions
    onValue(ref(realtimeDb, `teachers/${user.uid}/sessions`), (snap) => {
      setSessions(snap.val() || {});
    });
  }, []);

  const addSession = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const id = Date.now().toString();

    await set(ref(realtimeDb, `teachers/${user.uid}/sessions/${id}`), {
      ...newSession,
      isActive: true,
      students: 0
    });

    setNewSession({ class: "", subject: "", time: "" });
  };

  const toggle = async (id: string, status: boolean) => {
    const user = auth.currentUser;
    if (!user) return;

    await update(ref(realtimeDb, `teachers/${user.uid}/sessions/${id}`), {
      isActive: !status
    });
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Teaching Sessions</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Add Session</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Select onValueChange={(v) => setNewSession({ ...newSession, class: v })}>
              <SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>

            <Select onValueChange={(v) => setNewSession({ ...newSession, subject: v })}>
              <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>

            <Select onValueChange={(v) => setNewSession({ ...newSession, time: v })}>
              <SelectTrigger><SelectValue placeholder="Time" /></SelectTrigger>
              <SelectContent>{SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>

            <Button onClick={addSession} className="w-full"><PlusCircle className="w-4 h-4 mr-2"/>Add</Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-3">
          {Object.entries(sessions).map(([id, s]: any) => (
            <Card key={id} className="flex justify-between p-4">
              <div>
                <h4 className="font-bold">{s.class} - {s.subject}</h4>
                <p className="text-sm text-slate-500">{s.time}</p>
              </div>

              <Button variant={s.isActive ? "destructive" : "outline"} onClick={() => toggle(id, s.isActive)}>
                {s.isActive ? <XCircle/> : <CheckCircle/>}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

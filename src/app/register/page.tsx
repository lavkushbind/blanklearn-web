"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BookOpen, ShieldCheck, User, Mail, Phone, GraduationCap } from "lucide-react";

import { auth, realtimeDb } from "@/lib/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { ref, set, get } from "firebase/database";

export default function TeacherRegistration() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
  });

  // 🔐 Auto-login detection
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const snap = await get(ref(realtimeDb, `Users/${user.uid}`));
      const data = snap.val();

      if (data?.verify === true) {
        router.replace("/educator/sessions");
      } else {
        router.replace("/educator/verify");
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-lg font-semibold">
        Checking your session…
      </div>
    );
  }

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const { name, email, phone, subject } = formData;
      if (!name || !email || !phone || !subject) {
        throw new Error("All fields are required");
      }

      // 🔑 Firebase Auth account
      const cred = await createUserWithEmailAndPassword(auth, email, "Educator@123");

      // 🔥 Save to Realtime DB (Users Node)
      await set(ref(realtimeDb, `Users/${cred.user.uid}`), {
        name,
        email,
        phone,
        subject,
        role: "Educator",
        verify: false,
        createdAt: Date.now(),
      });

      router.replace("/educator/verify");

    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">

      <div className="grid md:grid-cols-2 max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* LEFT PANEL */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8"/>
            <h1 className="text-2xl font-bold">Blanklearn Educator</h1>
          </div>

          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Turn Your Knowledge Into Income
          </h2>

          <p className="text-blue-100 mb-8">
            Join India’s fastest growing online teaching platform. Teach from home. Earn monthly.
          </p>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-400"/>
              Verified teachers get students instantly
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-400"/>
              Earn ₹30,000–₹80,000/month
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-400"/>
              We handle marketing & payments
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-10">
          <CardHeader className="mb-6">
            <CardTitle className="text-3xl font-bold text-slate-800">
              Create Educator Account
            </CardTitle>
            <p className="text-slate-500 mt-2">
              Sign up once. Complete verification. Start earning.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400 w-4"/>
                  <Input name="name" className="pl-10" placeholder="Your full name" onChange={handleChange}/>
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400 w-4"/>
                  <Input name="email" className="pl-10" placeholder="teacher@gmail.com" onChange={handleChange}/>
                </div>
              </div>

              <div>
                <Label>Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400 w-4"/>
                  <Input name="phone" className="pl-10" placeholder="10 digit mobile" onChange={handleChange}/>
                </div>
              </div>

              <div>
                <Label>Subject Expertise</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 text-slate-400 w-4"/>
                  <Input name="subject" className="pl-10" placeholder="Maths, Physics, Science" onChange={handleChange}/>
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button disabled={submitting} className="w-full bg-blue-700 hover:bg-blue-800 py-6 text-lg font-bold">
                {submitting ? "Creating Account…" : "Continue to Verification"}
              </Button>

            </form>
          </CardContent>
        </div>

      </div>
    </div>
  );
}

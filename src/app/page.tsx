'use client';
import { ref, onValue, push, set } from "firebase/database";
import { realtimeDb } from "@/lib/firebase"; 
import ReactPixel from 'react-facebook-pixel'; 
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

 import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

 import {
  Users,
  Target,
  FileText,Heart, Phone, Mail, MapPin ,
  BarChart,Sparkles, Shield,  ArrowRight, Brain, MessageCircle, Zap, 
  PlayCircle,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  Gift,
  Loader2,
  Play, 
  Quote,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- FINAL DEMO BOOKING MODAL (Updated for Single Plan) ---
const DemoBookingModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) => {
    const { toast } = useToast();
    
    // States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [className, setClassName] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const PLAN_PRICE = '1499';

    // 1. SMART PIXEL TRACKING: Jab Modal Khule (InitiateCheckout)
    useEffect(() => {
        if (open) {
            import("react-facebook-pixel").then((x) => x.default).then((ReactPixel) => {
                ReactPixel.track('InitiateCheckout', { 
                    content_name: 'Free Demo Modal Opened' 
                });
            });
        } else {
            // Reset Form on Close
            setTimeout(() => {
                setIsSuccess(false);
                setName(''); setPhone(''); setClassName('');
                setSelectedSlot('');
            }, 300);
        }
    }, [open]);

    const handleFreeBooking = async () => {
        if (!name || !phone || !className || !selectedSlot) {
            toast({ title: 'Details Missing', description: 'Please fill all details.', variant: 'destructive' });
            return;
        }
        if (phone.length < 10) {
            toast({ title: 'Invalid Phone', description: 'Enter valid 10-digit number.', variant: 'destructive' });
            return;
        }

        setLoading(true);

        try {
            const sanitizedPhone = phone.replace(/\D/g, '');
            const bookingRef = ref(realtimeDb, `DemoBookings/${sanitizedPhone}`);
            
            await set(bookingRef, {
                studentName: name,
                mobileNumber: phone,
                studentClass: className,
                interestedPlan: `Group of 5 (${PLAN_PRICE}/mo)`,
                demoTime: selectedSlot,
                status: "booked_free",
                bookingDate: new Date().toLocaleString(),
                isAppRegistered: false
            });
            
            // 2. PIXEL TRACKING: Booking Confirm (Lead)
            import("react-facebook-pixel").then((x) => x.default).then((ReactPixel) => {
                ReactPixel.track('Lead', { 
                    value: 0, 
                    currency: 'INR',
                    content_name: 'Small Group Lead'
                });
            });

            setTimeout(() => {
                setLoading(false);
                setIsSuccess(true);
                toast({ title: 'Success!', description: 'Your Admit Pass is ready.' });
            }, 1500);

        } catch (error) {
            console.error("Error", error);
            setLoading(false);
            toast({ title: 'Error', description: 'Network issue. Try again.', variant: 'destructive' });
        }
    }

    // Updated Plan Features for ₹1499
    const planFeatures = [
        "📚 1 Hr Live Class (Daily)",
        "📅 5 Days/Week (Mon-Fri)",
        "👥 Max 5 Students Batch",
        "🎥 Recording Access",
        "✅ Homework Done in Class"
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-full max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                {!isSuccess ? (
                    <>
                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center flex-shrink-0">
                            <DialogTitle className="text-2xl font-bold">Book Trial</DialogTitle>
                            <DialogDescription className="text-blue-100 mt-1">Join our interactive Small Group Class today.</DialogDescription>
                        </div>
                        
                        {/* SCROLLABLE CONTENT */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* Plan Display (Fixed) */}
                            <div className="space-y-2">
                                <Label className="text-slate-900 font-semibold text-xs uppercase tracking-wider">YOUR INTERESTED PLAN</Label>
                                <div className="border-2 border-blue-600 bg-blue-50/50 rounded-xl p-3 text-center shadow-md">
                                    <p className="font-bold text-slate-900 text-lg">Small Group Class</p>
                                    <p className="text-sm text-slate-500">₹{PLAN_PRICE}/Month</p>
                                </div>
                                
                                {/* Dynamic Features */}
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2">
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                                        {planFeatures.map((feature, idx) => (
                                            <p key={idx} className="text-[10px] md:text-[11px] text-slate-700 font-medium flex items-center gap-1.5">
                                                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" /> {feature}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                             {/* Time Slot */}
                             <div className="space-y-2">
                                <Label className="text-slate-900 font-semibold flex items-center gap-2 text-xs uppercase tracking-wider">
                                    <Clock className="w-3 h-3 text-blue-600" /> SELECT DEMO TIME (TOMORROW)
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['4:00 PM - 5:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM'].map((slot) => (
                                        <div 
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`cursor-pointer border rounded-lg p-2 text-center text-[11px] font-medium transition-all ${selectedSlot === slot ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-100 hover:border-slate-300'}`}
                                        >
                                            {slot}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-3 pb-2">
                                <Input className="h-10 bg-slate-50 text-sm" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" />
                                <Input className="h-10 bg-slate-50 text-sm" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number (10-digit)" />
                                <Input className="h-10 bg-slate-50 text-sm" id="class" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class (e.g. 5th)" />
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
                            <Button onClick={handleFreeBooking} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-bold shadow-lg shadow-blue-200">
                                {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4"/> Processing...</span> : 'Confirm Free Seat'}
                            </Button>
                        </div>
                    </>
                ) : (
                    // SUCCESS SCREEN
                    <div className="flex flex-col items-center justify-center text-center p-6 space-y-5 animate-in fade-in zoom-in duration-300 bg-slate-50 h-full overflow-y-auto">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shadow-inner mt-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-extrabold text-slate-800">Booking Confirmed!</DialogTitle>
                            <p className="text-slate-500 text-sm mt-1">Your Demo Admit Pass is ready.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-0 rounded-2xl w-full text-left relative overflow-hidden shadow-xl">
                            <div className="bg-slate-900 text-white p-3 flex justify-between items-center">
                                <span className="text-xs font-bold tracking-widEST">BLANKLEARN PASS</span>
                                <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">DEMO</span>
                            </div>
                            <div className="p-5 relative">
                                <div className="absolute top-4 right-4 opacity-10"><QrCode className="w-16 h-16" /></div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Student Name</p>
                                <p className="font-bold text-xl text-slate-900 mb-3">{name}</p>
                                <div className="flex justify-between border-t border-dashed border-slate-200 pt-3">
                                    <div><p className="text-[10px] text-slate-400 uppercase font-bold">Class</p><p className="font-semibold text-slate-800">{className}</p></div>
                                    <div className="text-right"><p className="text-[10px] text-slate-400 uppercase font-bold">Time</p><p className="font-semibold text-blue-600">{selectedSlot}</p></div>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-2 text-center border-t border-slate-100">
                                <p className="text-xs text-blue-700 font-medium">Plan: Small Group (₹{PLAN_PRICE}/mo)</p>
                            </div>
                        </div>
                        <div className="w-full space-y-3 pb-4">
                            <Button className="w-full h-12 bg-black hover:bg-slate-800 text-white gap-2 shadow-lg" onClick={() => window.open('https://play.google.com/store/apps/details?id=com.blank_learn.dark', '_blank')}>
                                <PlayCircle className="fill-current w-5 h-5" /> Download App to Join
                            </Button>
                            <p className="text-xs text-slate-400 font-medium bg-white px-3 py-1 rounded-full border border-slate-200 inline-block">🔔 Link active 10 mins before demo time</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

// --- REST OF THE SECTIONS (Unchanged) ---

const NavigationBar = ({ onBookDemoClick }: { onBookDemoClick: () => void; }) => (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="rounded-lg shadow-sm" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">Blanklearn</span>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200/50" onClick={onBookDemoClick}>
            Book Demo
        </Button>
      </div>
    </header>
);

const HeroHeader = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
  <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 via-white to-white relative overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold mb-6 border border-yellow-200 shadow-sm">
             <Star className="w-3 h-3 fill-current" /> 4.9/5 Rated by Parents
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Stop the Homework <span className="text-blue-600">Struggle.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Live interactive classes that kids actually love. Homework help, concept clarity, and confidence building—starting at just <span className="font-bold text-slate-900">₹2499/mo</span>.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-bold shadow-xl shadow-blue-200" onClick={onBookDemoClick}>
              Book Live Demo
            </Button>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-600" /> No credit card needed
            </p>
          </div>
        </div>
        <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="grid grid-cols-2 gap-4">
                <Image src="/img2.png" alt="Child" width={500} height={400} className="rounded-2xl shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 border-4 border-white" />
                <Image src="/img1.png" alt="Parent" width={500} height={400} className="rounded-2xl shadow-2xl transform rotate-[3deg] hover:rotate-0 transition-transform duration-500 mt-12 border-4 border-white" />
            </div>
        </div>
      </div>
    </div>
  </section>
);

const StudentHighlights = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    const videosRef = ref(realtimeDb, 'VideoUploads');
    onValue(videosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setVideos(Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key, url: value.videoUrl || value.postUrl || value.url, thumbnail: value.thumbnail || value.image || ""
        })));
      }
      setLoading(false);
    });
  }, []);

  const handlePlay = (id: string) => {
    Object.keys(videoRefs.current).forEach((key) => {
      if (key !== id && videoRefs.current[key]) videoRefs.current[key]?.pause();
    });
    if (videoRefs.current[id]) videoRefs.current[id]?.play();
    setPlayingId(id);
  };

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-xs font-bold tracking-wider uppercase mb-4">Raw & Unscripted 🎥</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">See the Magic <span className="text-blue-400">Live.</span></h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Watch how our expert mentors make tough concepts easy in real-time.</p>
        </div>
        {loading ? <div className="flex justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div> : 
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.length > 0 ? videos.map((video) => (
                <div key={video.id} className={`relative group rounded-2xl overflow-hidden bg-black border border-slate-700 transition-all duration-300 ${playingId === video.id ? 'ring-2 ring-blue-500 shadow-2xl scale-105 z-10' : 'hover:scale-[1.02]'}`} style={{ aspectRatio: '16/9' }}>
                  <video ref={(el) => { videoRefs.current[video.id] = el; }} className="w-full h-full object-cover" src={video.url} controls={playingId === video.id} controlsList="nodownload noremoteplayback" playsInline poster={video.thumbnail} onPlay={() => setPlayingId(video.id)} onEnded={() => setPlayingId(null)} />
                  {playingId !== video.id && (
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer" onClick={() => handlePlay(video.id)}>
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-xl group-hover:scale-110 transition-transform"><div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner text-blue-600"><Play className="w-5 h-5 fill-current ml-1" /></div></div>
                    </div>
                  )}
                </div>
              )) : <p className="text-center col-span-full text-slate-500">No videos available.</p>}
          </div>
        }
      </div>
    </section>
  );
};

 
const PainAndSolution = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
  <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-blue-50 relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
    
    <div className="container mx-auto px-4 relative z-10">
      {/* Badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          Trusted by 500+ Working Parents
        </div>
      </div>
      
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          <span className="text-slate-900">Why </span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Parents Love Us</span>
          <span className="text-slate-900">? 💝</span>
        </h2>
        <p className="mt-6 text-slate-600 text-lg max-w-2xl mx-auto">
          Real problems. Real solutions. Real peace of mind.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Pain 1 - The Struggle */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-red-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 font-bold text-sm">Pain</span>
            </div>
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Clock className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">The Struggle 😫</h3>
            <p className="text-slate-600 leading-relaxed">
              Coming home tired to pending homework battles. No energy left for family time or your own relaxation.
            </p>
            <div className="mt-6 pt-4 border-t border-red-100">
              <p className="text-sm text-red-500 font-semibold">⚠️ 78% parents feel this daily</p>
            </div>
          </div>
        </div>

        {/* Pain 2 - The Crowd */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-orange-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-500 font-bold text-sm">Pain</span>
            </div>
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <AlertTriangle className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">The Crowd 😰</h3>
            <p className="text-slate-600 leading-relaxed">
              Local tuitions pack 50+ kids. Your child is just a number, lost in the crowd with zero attention.
            </p>
            <div className="mt-6 pt-4 border-t border-orange-100">
              <p className="text-sm text-orange-500 font-semibold">⚠️ 1 teacher = 50+ students</p>
            </div>
          </div>
        </div>

        {/* Solution */}
        <div 
          onClick={onBookDemoClick}
          className="group relative cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            {/* Animated background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">The Solution ✨</h3>
            <p className="text-blue-100 leading-relaxed">
              Small Batches (Max 5). Personal attention. Homework done in class. Parents chill. Child excels.
            </p>
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm">100% Attention</span>
              </div>
              <div className="flex items-center gap-2 text-white font-bold group-hover:gap-3 transition-all">
                Try Demo <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="mt-16 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-wrap justify-around gap-6 border border-slate-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">500+</div>
          <div className="text-sm text-slate-500">Happy Families</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">98%</div>
          <div className="text-sm text-slate-500">Homework Completion</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">4.9⭐</div>
          <div className="text-sm text-slate-500">Parent Rating</div>
        </div>
      </div>
    </div>
  </section>
);

const ProductFeatures = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
  <section className="py-24 bg-white relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <Zap className="w-4 h-4" />
          More Than Just Tuition
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          Everything Your Child Needs
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            To Shine Bright 🌟
          </span>
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          We don't just teach. We build confidence, curiosity, and lifelong learning habits.
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {[
          { 
            icon: <Users className="w-8 h-8" />, 
            title: "Small Batches (1:5)", 
            desc: "Every child speaks. Every child is heard. No backbenchers here.",
            color: "blue",
            stat: "5 Students Max"
          },
          { 
            icon: <FileText className="w-8 h-8" />, 
            title: "Homework Support", 
            desc: "We finish school homework during class so your evenings are completely free.",
            color: "green",
            stat: "100% Done in Class"
          },
          { 
            icon: <Brain className="w-8 h-8" />, 
            title: "Visual Learning", 
            desc: "No rote memorization. We use 3D models, animations & stories to explain concepts.",
            color: "purple",
            stat: "3D Visual Learning"
          },
          { 
            icon: <MessageCircle className="w-8 h-8" />, 
            title: "AI Doubt Solver", 
            desc: "24x7 AI assistant. Just click photo of question → Get instant solution + follow-ups.",
            color: "orange",
            stat: "Available 24x7"
          }
        ].map((f, i) => (
          <div 
            key={i} 
            onClick={onBookDemoClick} 
            className="group relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-3xl shadow-lg border border-slate-100 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden">
              {/* Colorful gradient bar on hover */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${f.color}-500 to-${f.color === 'blue' ? 'indigo' : f.color === 'green' ? 'emerald' : f.color === 'purple' ? 'pink' : 'red'}-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              
              <div className={`w-16 h-16 bg-${f.color}-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`text-${f.color}-600`}>{f.icon}</div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{f.desc}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{f.stat}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Extra Features Row */}
      <div className="mt-16 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800">✨ Bonus Features ✨</h3>
            <p className="text-slate-600">No hidden costs. Everything included.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Weekly Progress Report",
              "Parent-Teacher Meet",
              "Monthly Test & Analysis",
              "Doubt Clearing Session",
              "Recorded Backup Class",
              "Quiz & Gamification"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button 
              onClick={onBookDemoClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              Book Your Demo Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const SocialProof = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  useEffect(() => {
    onValue(ref(realtimeDb, 'reviews'), (snapshot) => {
      const data = snapshot.val();
      if (data) setReviews(Object.entries(data).map(([key, value]: [string, any]) => ({ id: key, name: value.name || "Parent", attribution: value.attribution || "", imageUrl: value.imageUrl || "", rating: value.rating || 5, reviewText: value.reviewText || value.text || "No review.", tag: value.statusTag || "" })));
    });
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">What Parents Are Saying</h2></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors relative">
                  <Quote className="w-10 h-10 text-blue-100 absolute top-4 right-4" />
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">{review.imageUrl ? <img src={review.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500 text-lg font-bold">{review.name[0]}</div>}</div>
                    <div><h4 className="font-bold text-slate-900 text-sm">{review.name}</h4><div className="flex text-yellow-400 gap-0.5 mt-1">{Array(5).fill(0).map((_,i)=><Star key={i} className={`w-3 h-3 ${i<review.rating?'fill-current':''}`}/>)}</div></div>
                  </div>
                  <p className="text-slate-600 text-sm italic leading-relaxed relative z-10">"{review.reviewText}"</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

const PricingPlan = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Simple, Affordable Pricing.</h2>
                <p className="mt-4 text-slate-600">Quality education shouldn't be expensive. Special discounts on long-term plans!</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Plan 1: Monthly - ₹2,499 (Was ₹3,000) */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative">
                    <div className="bg-green-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">Save 17%</div>
                    <div className="p-6 text-center border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">Monthly Plan</h3>
                        <div className="flex justify-center items-baseline mt-4 gap-1">
                            <span className="text-4xl font-extrabold text-slate-900">₹2,499</span>
                            <span className="text-slate-500">/mo</span>
                        </div>
                        <p className="text-slate-400 text-sm line-through">₹3,000/mo</p>
                        <p className="text-green-600 text-sm font-semibold mt-1">You save ₹501</p>
                    </div>
                    <div className="p-6 bg-slate-50/30">
                        <ul className="space-y-3 mb-6">
                            {['Live Classes (Mon-Fri)', '1 Hour Daily Sessions', 'Max 5 Students Batch', '24×7 AI Doubt Solver', 'Homework Completion Support'].map((f, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-700 font-medium">
                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"/> {f}
                                </li>
                            ))}
                        </ul>
                        <Button onClick={onBookDemoClick} className="w-full bg-green-600 hover:bg-green-700 h-11 text-base shadow-lg shadow-green-200">Book Demo</Button>
                    </div>
                </div>

                {/* Plan 2: Quarterly - ₹5,500 (Was ₹6,300) */}
                <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-600 overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative">
                    <div className="bg-blue-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">🔥 Best Value 🔥</div>
                    <div className="p-6 text-center border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">Quarterly Plan</h3>
                        <div className="flex justify-center items-baseline mt-4 gap-1">
                            <span className="text-4xl font-extrabold text-slate-900">₹5,500</span>
                            <span className="text-slate-500">/3 mo</span>
                        </div>
                        <p className="text-slate-400 text-sm line-through">₹6,300/3 mo</p>
                        <p className="text-blue-600 text-sm font-semibold mt-1">Save ₹800 + Get 1 Week Free</p>
                    </div>
                    <div className="p-6 bg-blue-50/30">
                        <ul className="space-y-3 mb-6">
                            {['Live Classes (Mon-Fri)', '1 Hour Daily Sessions', 'Max 5 Students Batch', '24×7 AI Doubt Solver', 'Homework Completion Support', 'Monthly Progress Report'].map((f, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-700 font-medium">
                                    <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"/> {f}
                                </li>
                            ))}
                        </ul>
                        <Button onClick={onBookDemoClick} className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base shadow-lg shadow-blue-200">Book Demo</Button>
                    </div>
                </div>

                {/* Plan 3: Annual - ₹15,000 (Was ₹18,000) */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative">
                    <div className="bg-purple-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">Save 17%</div>
                    <div className="p-6 text-center border-b border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900">Annual Plan</h3>
                        <div className="flex justify-center items-baseline mt-4 gap-1">
                            <span className="text-4xl font-extrabold text-slate-900">₹15,000</span>
                            <span className="text-slate-500">/10 mo</span>
                        </div>
                        <p className="text-slate-400 text-sm line-through">₹18,000/10 mo</p>
                        <p className="text-purple-600 text-sm font-semibold mt-1">Save ₹3,000 + 2 Months Free!</p>
                    </div>
                    <div className="p-6 bg-slate-50/30">
                        <ul className="space-y-3 mb-6">
                            {['Live Classes (Mon-Fri)', '1 Hour Daily Sessions', 'Max 5 Students Batch', '24×7 AI Doubt Solver', 'Homework Completion Support', 'Monthly Progress Report', 'Priority Support', 'Free E-books & Materials'].map((f, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-700 font-medium">
                                    <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5"/> {f}
                                </li>
                            ))}
                        </ul>
                        <Button onClick={onBookDemoClick} className="w-full bg-purple-600 hover:bg-purple-700 h-11 text-base shadow-lg shadow-purple-200">Book Demo</Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

 
const FinalFAQ = () => (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="container max-w-4xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <MessageCircle className="w-4 h-4" />
                    Got Questions? We've Got Answers
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
                    Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Questions</span>
                </h2>
                <p className="mt-4 text-slate-600 text-lg">Everything you need to know about our program</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
                {[
                    { 
                        q: "🎥 Is it Live or Recorded Class?", 
                        a: "100% LIVE & Interactive classes on our platform. Students can ask questions, clarify doubts, and interact with the teacher face-to-face in real-time. No pre-recorded videos." 
                    },
                    { 
                        q: "📅 What if my child misses a class?", 
                        a: "Since it's a live class, attendance is important. However, if your child misses a class due to emergency, we offer one makeup class per month. Regular attendance is encouraged for best results."
                    },
                    { 
                        q: "👥 How many students per batch?", 
                        a: "Maximum 5 students per batch only. This ensures every child gets personal attention and can actively participate in every session."
                    },
                    { 
                        q: "📚 What's the class schedule?", 
                        a: "Classes are held Monday to Friday, 1 hour daily. Timings are flexible based on batch availability. Evening slots available for working parents."
                    },
                    { 
                        q: "🤖 How does the AI Doubt Solver work?", 
                        a: "Students can click a photo of any question, upload it to our app, and the AI instantly provides solution with step-by-step explanation. They can also ask follow-up questions for complete clarity - available 24x7!"
                    },
                    { 
                        q: "💰 Is there any refund policy?", 
                        a: "We focus on quality education. You can book a FREE demo class first to experience our teaching. After enrollment, no refunds are provided as we commit dedicated resources for your child's learning."
                    },
                    { 
                        q: "📱 What platform do you use?", 
                        a: "Classes happen on our interactive web/app platform. No additional software needed. Parents get weekly progress reports on WhatsApp."
                    }
                ].map((item, index) => (
                    <AccordionItem 
                        key={index} 
                        value={`item-${index}`} 
                        className="bg-white rounded-2xl px-6 border border-slate-200 shadow-sm hover:shadow-md transition-all data-[state=open]:border-blue-300 data-[state=open]:shadow-lg"
                    >
                        <AccordionTrigger className="font-semibold text-slate-800 text-lg py-5 hover:no-underline hover:text-blue-600 transition-colors">
                            {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 pb-5 leading-relaxed">
                            {item.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {/* Still have questions CTA */}
            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                    <span>Still have questions?</span>
                    <button className="text-blue-600 font-semibold hover:underline">Contact our team →</button>
                </div>
            </div>
        </div>
    </section>
);

const Footer = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
  <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
    
    <div className="container mx-auto px-4 relative z-10">
        {/* Main CTA Section */}
        <div className="py-16 text-center border-b border-slate-800">
            <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                    <Sparkles className="w-4 h-4" />
                    Limited Batches Available
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    Ready to Transform Your Child's
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"> Learning Journey?</span>
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                    Join 500+ happy parents who've seen real improvement in their child's confidence and grades.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-14 px-10 text-lg font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all hover:scale-105" 
                        onClick={onBookDemoClick}
                    >
                        Book Demo Now <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8 text-lg"
                        onClick={() => window.location.href = "tel:9235044520"}
                    >
                        <Phone className="w-5 h-5 mr-2" /> Call Us
                    </Button>
                </div>
                <p className="text-xs text-slate-500 mt-6">
                    ✅ 1-hour demo class | ✅ No credit card required | ✅ Cancel anytime before first paid class
                </p>
            </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">B</span>
                    </div>
                    <div>
                        <span className="font-bold text-white text-lg">Blanklearn</span>
                        <p className="text-xs text-slate-500">Empowering Young Minds</p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-8 text-sm">
                    <a href="/about" className="hover:text-white transition-colors">About Us</a>
                    <a href="/how-it-works" className="hover:text-white transition-colors">How It Works</a>
                    <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
                    <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                    <a href="/policies" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="/policies" className="hover:text-white transition-colors">Terms of Service</a>
                </div>

                {/* Social/Contact */}
               
            </div>
            
            {/* Copyright */}
            <div className="text-center mt-8 pt-6 border-t border-slate-800/50">
                <p className="text-xs text-slate-500">
                    © 2024 Blanklearn Education. All rights reserved. | Live classes only | No refunds after enrollment
                </p>
                <p className="text-xs text-slate-600 mt-2">
                    📍 Serving students across India | ⭐ 4.9/5 from 500+ parents
                </p>
            </div>
        </div>
    </div>
  </footer>
);

const StickyBookingBar = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const toggle = () => setIsVisible(window.scrollY > 400);
        window.addEventListener('scroll', toggle);
        return () => window.removeEventListener('scroll', toggle);
    }, []);
    return (
        <div className={cn("fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40 transition-transform md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]", isVisible ? 'translate-y-0' : 'translate-y-full')}>
            <div className="flex justify-between items-center">
                <div><p className="font-bold text-slate-900 text-sm">🔥 ₹2499 Plan</p><p className="text-xs text-green-600 font-medium">Book Demo</p></div>
                <Button className="bg-blue-600 text-white font-bold" onClick={onBookDemoClick}>Book Now</Button>
            </div>
        </div>
    )
}

export default function HomePage() {
  const [isDemoModalOpen, setDemoModalOpen] = useState(false);
  const handleBookDemoClick = () => setDemoModalOpen(true);
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      <Suspense fallback={null}><DemoBookingModal open={isDemoModalOpen} onOpenChange={setDemoModalOpen} /></Suspense>
      <NavigationBar onBookDemoClick={handleBookDemoClick} />
      <main>
        <HeroHeader onBookDemoClick={handleBookDemoClick} />
        <StudentHighlights />
        <PainAndSolution onBookDemoClick={handleBookDemoClick} />
        <ProductFeatures onBookDemoClick={handleBookDemoClick} />
        <SocialProof />
        <PricingPlan onBookDemoClick={handleBookDemoClick} />
        <FinalFAQ />
      </main>
      <Footer onBookDemoClick={handleBookDemoClick} />
      <StickyBookingBar onBookDemoClick={handleBookDemoClick} />
    </div>
  );
}
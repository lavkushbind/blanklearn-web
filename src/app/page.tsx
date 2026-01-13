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
  FileText,
  BarChart,
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

// --- FINAL DEMO BOOKING MODAL (Pixel + Fixed Layout) ---
const DemoBookingModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) => {
    const { toast } = useToast();
    
    // States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [className, setClassName] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('999'); 
    const [selectedSlot, setSelectedSlot] = useState('');

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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
                setSelectedPlan('999'); setSelectedSlot('');
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
                interestedPlan: selectedPlan === '999' ? 'Small Group (999)' : 'Semi-Private (2999)',
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
                    content_name: selectedPlan === '999' ? 'Small Group Lead' : 'Private Lead'
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

    const planFeatures = selectedPlan === '999' ? [
        "📚 1 Hr Live Class (Daily)",
        "📅 5 Days/Week (Mon-Fri)",
        "👥 Max 8 Students Batch",
        "🎥 Recording Access"
    ] : [
        "📚 1 Hr Live Class (Daily)",
        "📅 6 Days/Week (Mon-Sat)",
        "💎 Max 3 Students (VIP)",
        "🤝 Weekly Parent Meeting",
        "🎯 Personal Curriculum"
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-full max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                {!isSuccess ? (
                    <>
                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center flex-shrink-0">
                            <DialogTitle className="text-2xl font-bold">Book Free Trial</DialogTitle>
                            <DialogDescription className="text-blue-100 mt-1">Join 2000+ Happy Students today.</DialogDescription>
                        </div>
                        
                        {/* SCROLLABLE CONTENT */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* Plan Selection */}
                            <div className="space-y-2">
                                <Label className="text-slate-900 font-semibold text-xs uppercase tracking-wider">SELECT INTEREST</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div 
                                        onClick={() => setSelectedPlan('999')}
                                        className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all relative ${selectedPlan === '999' ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        {selectedPlan === '999' && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">BEST VALUE</div>}
                                        <p className="font-bold text-slate-900 text-sm">Small Group</p>
                                        <p className="text-xs text-slate-500">₹999/mo</p>
                                    </div>
                                    <div 
                                        onClick={() => setSelectedPlan('2999')}
                                        className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all relative ${selectedPlan === '2999' ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        {selectedPlan === '2999' && <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">PREMIUM</div>}
                                        <p className="font-bold text-slate-900 text-sm">Semi-Private</p>
                                        <p className="text-xs text-slate-500">₹2,999/mo</p>
                                    </div>
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
                                    <Clock className="w-3 h-3 text-blue-600" /> TIME SLOT (TOMORROW)
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
                            <p className="text-slate-500 text-sm mt-1">Take a screenshot of your pass.</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-0 rounded-2xl w-full text-left relative overflow-hidden shadow-xl">
                            <div className="bg-slate-900 text-white p-3 flex justify-between items-center">
                                <span className="text-xs font-bold tracking-widest">BLANKLEARN PASS</span>
                                <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded">ADMIT</span>
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
                                <p className="text-xs text-blue-700 font-medium">Plan: {selectedPlan === '999' ? 'Small Group (₹999)' : 'Semi-Private (₹2999)'}</p>
                            </div>
                        </div>
                        <div className="w-full space-y-3 pb-4">
                            <Button className="w-full h-12 bg-black hover:bg-slate-800 text-white gap-2 shadow-lg" onClick={() => window.open('https://play.google.com/store/apps/details?id=com.blank_learn.dark', '_blank')}>
                                <PlayCircle className="fill-current w-5 h-5" /> Download App to Join
                            </Button>
                            <p className="text-xs text-slate-400 font-medium bg-white px-3 py-1 rounded-full border border-slate-200 inline-block">🔔 Class link activates 10 mins before time</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

// --- REST OF THE SECTIONS ---

const NavigationBar = ({ onBookDemoClick }: { onBookDemoClick: () => void; }) => (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="rounded-lg shadow-sm" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">Blanklearn</span>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200/50" onClick={onBookDemoClick}>
            Book Free Demo
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
            Live interactive classes that kids actually love. Homework help, concept clarity, and confidence building—starting at just <span className="font-bold text-slate-900">₹999/mo</span>.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-bold shadow-xl shadow-blue-200" onClick={onBookDemoClick}>
              Book Free Live Demo
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
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Why Parents Choose Us?</h2></div>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="bg-red-50/50 border-red-100 hover:shadow-lg transition-all"><CardHeader><div className="mx-auto bg-white rounded-full p-4 shadow-sm w-fit"><Clock className="w-8 h-8 text-red-500" /></div><CardTitle className="mt-4 text-xl text-center">The Struggle</CardTitle></CardHeader><CardContent><p className="text-center text-slate-600">Coming home tired to pending homework battles. It drains family time.</p></CardContent></Card>
        <Card className="bg-yellow-50/50 border-yellow-100 hover:shadow-lg transition-all"><CardHeader><div className="mx-auto bg-white rounded-full p-4 shadow-sm w-fit"><AlertTriangle className="w-8 h-8 text-yellow-500" /></div><CardTitle className="mt-4 text-xl text-center">The Crowd</CardTitle></CardHeader><CardContent><p className="text-center text-slate-600">Local tuitions pack 50+ kids. Your child is just a number lost in the crowd.</p></CardContent></Card>
        <Card className="bg-blue-600 text-white shadow-xl shadow-blue-200 cursor-pointer hover:scale-105 transition-transform border-none" onClick={onBookDemoClick}><CardHeader><div className="mx-auto bg-white/20 rounded-full p-4 w-fit"><CheckCircle className="w-8 h-8 text-white" /></div><CardTitle className="mt-4 text-xl text-center">The Solution</CardTitle></CardHeader><CardContent><p className="text-center opacity-90">Small Batches (Max 8). Personal attention. Homework done in class.<br/><span className="font-bold underline mt-4 inline-block">Try Free Demo →</span></p></CardContent></Card>
      </div>
    </div>
  </section>
);

const ProductFeatures = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">More Than Just Tuition.</h2></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[{ icon: <Users className="w-8 h-8 text-blue-600" />, title: "Small Batches (1:8)", desc: "Every child speaks. Every child is heard. No backbenchers here." }, { icon: <FileText className="w-8 h-8 text-blue-600" />, title: "Homework Support", desc: "We finish school homework during class so your evenings are free." }, { icon: <Target className="w-8 h-8 text-blue-600" />, title: "Visual Learning", desc: "No rote memorization. We use 3D models & stories to explain concepts." }, { icon: <BarChart className="w-8 h-8 text-blue-600" />, title: "Progress Reports", desc: "Weekly WhatsApp updates on exactly how your child is improving." }].map((f, i) => (
            <div key={i} onClick={onBookDemoClick} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
              <div className="mb-6 bg-blue-50 w-fit p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">{f.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
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
            <div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Simple, Affordable Pricing.</h2><p className="mt-4 text-slate-600">Quality education shouldn't be expensive.</p></div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
                    <div className="p-8 text-center border-b border-slate-50">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                        <h3 className="text-2xl font-bold text-slate-900 mt-4">Small Group</h3>
                        <div className="flex justify-center items-baseline mt-4 gap-1"><span className="text-5xl font-extrabold text-slate-900">₹999</span><span className="text-slate-500">/mo</span></div>
                        <p className="text-slate-500 text-sm mt-2">Max 8 Students • Daily Classes</p>
                    </div>
                    <div className="p-8 bg-slate-50/50">
                        <ul className="space-y-4 mb-8">{['Live Classes (Mon-Fri)', 'Homework Help Included', 'Recording Access', 'Monthly PTM'].map((f, i)=><li key={i} className="flex gap-3 text-sm text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0"/> {f}</li>)}</ul>
                        <Button onClick={onBookDemoClick} className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-lg">Choose Plan</Button>
                    </div>
                </div>
                <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-600 overflow-hidden hover:scale-[1.02] transition-transform duration-300 relative">
                    <div className="bg-blue-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest">Premium Attention</div>
                    <div className="p-8 text-center border-b border-slate-50">
                        <h3 className="text-2xl font-bold text-slate-900">Semi-Private</h3>
                        <div className="flex justify-center items-baseline mt-4 gap-1"><span className="text-5xl font-extrabold text-slate-900">₹2,999</span><span className="text-slate-500">/mo</span></div>
                        <p className="text-slate-500 text-sm mt-2">Max 3 Students • VIP Focus</p>
                    </div>
                    <div className="p-8 bg-blue-50/30">
                        <ul className="space-y-4 mb-8">{['Live Classes (Mon-Sat)', 'Dedicated Mentor', 'Personalized Curriculum', 'Weekly Parents Meeting'].map((f, i)=><li key={i} className="flex gap-3 text-sm text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0"/> {f}</li>)}</ul>
                        <Button onClick={onBookDemoClick} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-lg shadow-blue-200">Choose Plan</Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FinalFAQ = () => (
    <section className="py-24 bg-white">
        <div className="container max-w-3xl mx-auto px-4">
            <div className="text-center mb-12"><h2 className="text-3xl font-extrabold text-slate-900">Common Questions</h2></div>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {[{q: "Is it Live or Recorded?", a: "100% Live & Interactive on our App."}, {q: "What if I miss a class?", a: "Recordings are available instantly on the App."}, {q: "Is there a Refund Policy?", a: "Yes! 7-Day Money Back Guarantee."}, {q: "Do I need a laptop?", a: "No, works perfectly on mobile."}].map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="bg-slate-50 rounded-xl px-6 border-none data-[state=open]:bg-blue-50 transition-colors">
                        <AccordionTrigger className="font-semibold text-slate-900 text-lg py-4 hover:no-underline">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-slate-600 pb-4 leading-relaxed">{item.a}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </section>
);

const Footer = ({ onBookDemoClick }: { onBookDemoClick: () => void }) => (
  <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
    <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Ready to boost your child's grades?</h2>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-10 text-lg font-bold shadow-lg shadow-blue-500/30 mb-12" onClick={onBookDemoClick}>Book Free Demo Now</Button>
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-800 pt-8 gap-4">
            <div className="flex items-center gap-2"><Image src="/logo.jpg" alt="Logo" width={32} height={32} className="rounded opacity-80" /><span className="font-bold text-white">Blanklearn</span></div>
            <div className="flex gap-6 text-sm"><a href="/policies" className="hover:text-white transition-colors">Privacy</a><a href="/policies" className="hover:text-white transition-colors">Terms</a><a href="/policies" className="hover:text-white transition-colors">Refunds</a></div>
            <p className="text-xs text-slate-500">© 2025 Blanklearn Education.</p>
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
                <div><p className="font-bold text-slate-900 text-sm">🔥 Limited Seats</p><p className="text-xs text-green-600 font-medium">Free for today</p></div>
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
 